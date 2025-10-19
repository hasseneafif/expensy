import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Add a new expense
export const addExpense = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    category: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const expenseId = await ctx.db.insert("expenses", {
      userId: args.userId,
      amount: args.amount,
      category: args.category,
      description: args.description,
      date: args.date,
      createdAt: Date.now(),
    });
    return expenseId;
  },
});

// Get all expenses for a user
export const getExpenses = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Sort by date descending (newest first)
    return expenses.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
});

// Update an expense
export const updateExpense = mutation({
  args: {
    id: v.id("expenses"),
    amount: v.optional(v.number()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete an expense
export const deleteExpense = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get expenses within a date range
export const getExpensesByDateRange = query({
  args: {
    userId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const start = new Date(args.startDate);
      const end = new Date(args.endDate);
      return expenseDate >= start && expenseDate <= end;
    });
  },
});