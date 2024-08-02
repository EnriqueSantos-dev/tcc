import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const oauthAccounts = pgTable(
  "oauth_account",
  {
    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: varchar("user_id", { length: 191 })
      .notNull()
      .references(() => users.id)
  },
  (table) => ({
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] })
  })
);

export const oauthAccountRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userId],
    references: [users.id]
  })
}));
