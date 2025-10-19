import { v } from "convex/values";
import { query } from "./_generated/server";

// Get spending summary by time period
export const getSpendingSummary = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const daily = expenses
      .filter((e) => new Date(e.date) >= today)
      .reduce((sum, e) => sum + e.amount, 0);

    const weekly = expenses
      .filter((e) => new Date(e.date) >= weekAgo)
      .reduce((sum, e) => sum + e.amount, 0);

    const monthly = expenses
      .filter((e) => new Date(e.date) >= monthAgo)
      .reduce((sum, e) => sum + e.amount, 0);

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    return { daily, weekly, monthly, total };
  },
});

// Get spending by category
export const getCategoryBreakdown = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const categoryMap = new Map<string, number>();
    
    expenses.forEach((expense) => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
    }));
  },
});

// Generate insights
export const getInsights = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (expenses.length === 0) {
      return [];
    }

    const insights: string[] = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Define time periods
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    // Get expenses for different periods
    const thisWeek = expenses.filter((e) => new Date(e.date) >= weekAgo);
    const lastWeek = expenses.filter(
      (e) => new Date(e.date) >= twoWeeksAgo && new Date(e.date) < weekAgo
    );
    const thisMonth = expenses.filter((e) => new Date(e.date) >= monthAgo);
    const lastMonth = expenses.filter(
      (e) => new Date(e.date) >= twoMonthsAgo && new Date(e.date) < monthAgo
    );

    // Calculate totals
    const thisWeekTotal = thisWeek.reduce((sum, e) => sum + e.amount, 0);
    const lastWeekTotal = lastWeek.reduce((sum, e) => sum + e.amount, 0);
    const thisMonthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);
    const lastMonthTotal = lastMonth.reduce((sum, e) => sum + e.amount, 0);
    const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Week-over-week comparison
    if (lastWeekTotal > 0) {
      const percentChange = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
      if (percentChange > 10) {
        insights.push(
          `You spent ${Math.abs(percentChange).toFixed(1)}% more this week compared to last week. Consider reviewing your recent purchases.`
        );
      } else if (percentChange < -10) {
        insights.push(
          `Great job! Your spending decreased by ${Math.abs(percentChange).toFixed(1)}% compared to last week.`
        );
      }
    }

    // Month-over-month comparison
    if (lastMonthTotal > 0) {
      const percentChange = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      if (percentChange > 15) {
        insights.push(
          `Your spending increased by ${Math.abs(percentChange).toFixed(1)}% this month. Time to review your budget!`
        );
      } else if (percentChange < -15) {
        insights.push(
          `Excellent! You've reduced your spending by ${Math.abs(percentChange).toFixed(1)}% this month.`
        );
      }
    }

    // Category analysis
    const categoryMap = new Map<string, number>();
    expenses.forEach((expense) => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    const sortedCategories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1]);

    if (sortedCategories.length > 0) {
      const topCategory = sortedCategories[0];
      const topPercentage = (topCategory[1] / totalSpending) * 100;
      
      if (topPercentage > 40) {
        insights.push(
          `${topCategory[0]} makes up ${topPercentage.toFixed(1)}% of your total spending. Consider if this aligns with your priorities.`
        );
      }

      // Category trend analysis
      const lastMonthCategories = new Map<string, number>();
      lastMonth.forEach((expense) => {
        const current = lastMonthCategories.get(expense.category) || 0;
        lastMonthCategories.set(expense.category, current + expense.amount);
      });

      categoryMap.forEach((amount, category) => {
        const lastMonthAmount = lastMonthCategories.get(category) || 0;
        if (lastMonthAmount > 0) {
          const change = ((amount - lastMonthAmount) / lastMonthAmount) * 100;
          if (change > 30) {
            insights.push(
              `Your ${category} expenses increased by ${change.toFixed(1)}% compared to last month.`
            );
          } else if (change < -30) {
            insights.push(
              `You're spending ${Math.abs(change).toFixed(1)}% less on ${category} than last month. Keep it up!`
            );
          }
        }
      });
    }

    // Average daily spending
    const daysWithExpenses = new Set(expenses.map((e) => e.date)).size;
    if (daysWithExpenses > 0) {
      const avgDaily = totalSpending / daysWithExpenses;
      insights.push(
        `Your average daily spending is $${avgDaily.toFixed(2)} based on ${daysWithExpenses} days of tracked expenses.`
      );
    }

    // Spending frequency
    if (expenses.length > 10) {
      const recentExpenses = expenses.slice(0, 10);
      const frequentCategories = new Map<string, number>();
      recentExpenses.forEach((e) => {
        frequentCategories.set(e.category, (frequentCategories.get(e.category) || 0) + 1);
      });
      const mostFrequent = Array.from(frequentCategories.entries())
        .sort((a, b) => b[1] - a[1])[0];
      
      if (mostFrequent) {
        insights.push(
          `${mostFrequent[0]} is your most frequent expense category in recent transactions.`
        );
      }
    }

    return insights.slice(-5); 
  },
});