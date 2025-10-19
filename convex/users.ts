import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user
export const upsertUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { name: args.name });
      return existing._id;
    } else {
      const userId = await ctx.db.insert("users", {
        userId: args.userId,
        name: args.name,
        createdAt: Date.now(),
      });
      return userId;
    }
  },
});

// Get user by userId
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
    
    return user;
  },
});