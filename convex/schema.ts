import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  expenses: defineTable({
    userId: v.string(),
    amount: v.number(),
    category: v.string(),
    description: v.optional(v.string()),
    date: v.string(), // ISO date string
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "date"]),
  
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"]),
});