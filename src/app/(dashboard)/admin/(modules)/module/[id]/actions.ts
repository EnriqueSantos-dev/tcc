"use server";

import { documents, files, modules } from "@/lib/db/schemas";
import { embeddings as embeddingsTable } from "@/lib/db/schemas/embeddings";
import { env } from "@/lib/env.mjs";
import { generateDocuments } from "@/lib/langchain";
import { documentSchema, moduleSchema } from "@/lib/permissions/schemas";
import { uploadFileFactory } from "@/lib/upload-file/factory";
import { getFileExtension } from "@/lib/utils";
import { authenticatedProcedure } from "@/lib/zsa";
import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { z } from "zod";
import { editModuleSchema } from "../../validation";
import { createDocumentSchema, editDocumentSchema } from "./validations";

const procedure = authenticatedProcedure.createServerAction();

export const editModule = procedure
  .input(editModuleSchema)
  .handler(async ({ input, ctx }) => {
    const { can } = ctx.userAbilities;

    const foundedModule = await db.query.modules.findFirst({
      where: eq(modules.id, input.id)
    });

    if (!foundedModule) {
      throw new Error("Não foi possível encontrar o documento");
    }

    const moduleParsed = moduleSchema.parse({
      id: input.id,
      ownerId: foundedModule.userId
    });

    if (!can("update", moduleParsed)) {
      throw new Error("Você não tem permissão para editar este módulo");
    }

    await db
      .update(modules)
      .set({
        name: input.name,
        description: input.description
      })
      .where(eq(modules.id, input.id));

    revalidatePath(`/module/${input.id}`);
  });

export const deleteModule = procedure
  .input(
    z.object({
      id: z.string().min(1)
    })
  )
  .handler(async ({ input, ctx }) => {
    const moduleFromDb = await db.query.modules.findFirst({
      where: eq(modules.id, input.id),
      with: {
        user: true
      }
    });

    if (!moduleFromDb) {
      throw new Error("Não foi possível encontrar o módulo");
    }

    const { can } = ctx.userAbilities;

    const moduleParsed = moduleSchema.parse({
      id: moduleFromDb.id,
      ownerId: moduleFromDb.userId
    });

    if (!can("delete", moduleParsed)) {
      throw new Error("Você não tem permissão para deletar este módulo");
    }

    await db.delete(modules).where(eq(modules.id, input.id));

    redirect("/modules");
  });

export const deleteDocumentAction = procedure
  .input(
    z.object({
      id: z.string().min(1),
      moduleId: z.string().min(1)
    })
  )
  .handler(async ({ input, ctx }) => {
    try {
      const [moduleFromDb, document] = await Promise.all([
        db.query.modules.findFirst({
          where: eq(modules.id, input.moduleId)
        }),
        db.query.documents.findFirst({ where: eq(documents.id, input.id) })
      ]);

      if (!moduleFromDb || !document) {
        throw new Error("Não foi possível encontrar o documento");
      }

      const documentParsed = documentSchema.safeParse({
        id: input.id,
        ownerId: document.ownerId,
        module: {
          id: moduleFromDb.id,
          ownerId: moduleFromDb.userId
        }
      });

      if (!documentParsed.success) {
        throw new Error("Não foi possível deletar o documento");
      }

      const documentFromDb = await db.query.documents.findFirst({
        where: eq(documents.id, input.id)
      });

      if (!documentFromDb) {
        throw new Error("Não foi possível encontrar o documento");
      }

      const { can } = ctx.userAbilities;

      const documentParsedData = documentParsed.data;

      if (!can("delete", documentParsedData)) {
        throw new Error("Você não tem permissão para deletar este documento");
      }

      await db.transaction(async (tx) => {
        await tx
          .delete(embeddingsTable)
          .where(eq(embeddingsTable.documentId, input.id));
        await tx.delete(documents).where(eq(documents.id, input.id));
      });
    } catch (error) {
      throw error;
    } finally {
      revalidatePath(`/module/${input.moduleId}`);
    }
  });

export const createDocumentAction = procedure
  .input(createDocumentSchema, {
    type: "formData"
  })
  .handler(async ({ input, ctx }) => {
    try {
      const { can } = ctx.userAbilities;

      const moduleFromDb = await db.query.modules.findFirst({
        where: eq(modules.id, input.moduleId)
      });

      if (!moduleFromDb) {
        throw new Error(
          "Não foi possível criar o documento pois o módulo não existe."
        );
      }

      // avoid using schema because new documents no have amount of fields
      const documentParsed = documentSchema.parse({
        id: "", // empty for new documents,
        ownerId: "", // irrelevant for now,
        module: {
          id: input.moduleId,
          ownerId: moduleFromDb.userId
        }
      });

      if (!can("create", documentParsed)) {
        throw new Error(
          "Você não tem permissão para criar documentos nesse módulo"
        );
      }

      const fileExtension = getFileExtension(input.file);
      const originalFileName = path.basename(
        input.file.name.trim().toLowerCase(),
        fileExtension
      );
      const fileNameToSave =
        `${nanoid()}-${Date.now()}${fileExtension}`.replaceAll(/\s/g, "-");

      const bucket = env.SUPABASE_BUCKET;

      const uploadFileFn = uploadFileFactory();
      const uploadedFileUrl = await uploadFileFn({
        file: input.file,
        folder: bucket,
        filename: `files/${fileNameToSave}`
      });

      if (!uploadedFileUrl) {
        throw new Error(
          "Não foi possível criar o seu documento, tente mais tarde!"
        );
      }

      const metadata = {
        fileUrl: uploadedFileUrl,
        fileName: originalFileName.trim().replaceAll(/\s/g, "-")
      };
      const docs = await generateDocuments(input.file, metadata);

      if (!docs) {
        throw new Error("Não foi possível criar o documento");
      }

      const documentTexts = docs.map((doc) => doc.pageContent);

      const { embeddings } = await embedMany({
        model: openai.embedding("text-embedding-3-small"),
        values: documentTexts
      });

      await db.transaction(async (tx) => {
        const [file] = await tx
          .insert(files)
          .values({
            fileName: originalFileName,
            fileSize: input.file.size,
            fileType: input.file.type,
            fileUrl: uploadedFileUrl
          })
          .returning({ id: files.id });

        const [createdDoc] = await tx
          .insert(documents)
          .values({
            name: input.name,
            description: input.description,
            fileId: file.id,
            moduleId: input.moduleId,
            ownerId: ctx.user.id
          })
          .returning({ id: documents.id });

        await tx.insert(embeddingsTable).values(
          embeddings.map((embedding, index) => ({
            documentId: createdDoc.id,
            content: docs[index].pageContent,
            metadata: docs[index].metadata,
            embedding
          }))
        );
      });
    } catch (error) {
      console.log("CREATE_DOCUMENT_ERROR", error);

      throw error;
    } finally {
      revalidatePath(`/module/${input.moduleId}`);
    }
  });

export const editDocumentAction = procedure
  .input(editDocumentSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const { can } = ctx.userAbilities;

      const document = await db.query.documents.findFirst({
        where: eq(documents.id, input.id),
        with: {
          module: true
        }
      });

      if (!document) {
        throw new Error("Não foi possível encontrar o documento");
      }

      const documentParsed = documentSchema.parse({
        id: input.id,
        ownerId: document.ownerId,
        module: {
          id: document.moduleId,
          ownerId: document.module.userId
        }
      });

      if (!can("update", documentParsed)) {
        throw new Error("Você não tem permissão para editar este documento");
      }

      await db
        .update(documents)
        .set({
          name: input.name,
          description: input.description
        })
        .where(eq(documents.id, input.id));
    } catch (error) {
      throw error;
    } finally {
      revalidatePath(`/module/${input.moduleId}`);
    }
  });
