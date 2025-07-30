import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const plants = pgTable("plants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scientific: text("scientific").notNull(),
  korean: text("korean").notNull(),
  lifeForm: text("life_form").notNull(), // 교목, 관목, 초화
  maxHeight: real("max_height").notNull(),
  rootDepth: text("root_depth").notNull(),
  lightNeed: integer("light_need").notNull(),
  lifespan: integer("lifespan").notNull(),
});

export const insertPlantSchema = createInsertSchema(plants).omit({
  id: true,
});

export type InsertPlant = z.infer<typeof insertPlantSchema>;
export type Plant = typeof plants.$inferSelect;
