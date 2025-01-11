import path from "node:path";
import * as schema from "./schemas";
import { pgGenerate } from "drizzle-dbml-generator";

const out = path.join("drizzle", "schema.dbml");
const relational = true;

pgGenerate({ schema, out, relational });
