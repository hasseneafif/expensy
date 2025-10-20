import { mutation } from "./_generated/server";

export const seedSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = ""; 
    
    const categories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Other'];
    
    // Generate expenses for the last 60 days
    const today = new Date();
    const expenses = [];
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const numExpenses = Math.floor(Math.random() * 4) + 1;
      
      for (let j = 0; j < numExpenses; j++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const amount = parseFloat((Math.random() * 150 + 5).toFixed(2)); // $5 - $155
        
        const descriptions: Record<string, string[]> = {
          'Food': ['Grocery shopping', 'Lunch at cafe', 'Dinner with friends', 'Coffee', 'Fast food'],
          'Transport': ['Uber ride', 'Gas', 'Parking', 'Bus ticket', 'Train fare'],
          'Bills': ['Internet bill', 'Phone bill', 'Electricity', 'Water bill', 'Subscription'],
          'Entertainment': ['Movie tickets', 'Concert', 'Gaming', 'Streaming service', 'Books'],
          'Shopping': ['Clothes', 'Electronics', 'Home decor', 'Gifts', 'Online shopping'],
          'Healthcare': ['Pharmacy', 'Doctor visit', 'Gym membership', 'Vitamins', 'Dental'],
          'Education': ['Course fee', 'Books', 'Online class', 'Workshop', 'Certification'],
          'Other': ['Miscellaneous', 'Personal care', 'Pet supplies', 'Repairs', 'Various']
        };
        
        const description = descriptions[category][Math.floor(Math.random() * descriptions[category].length)];
        
        expenses.push({
          userId,
          amount,
          category,
          description,
          date: date.toISOString().split('T')[0],
          createdAt: date.getTime(),
        });
      }
    }
    
    for (const expense of expenses) {
      await ctx.db.insert("expenses", expense);
    }
    
    return { message: `Successfully seeded ${expenses.length} expenses!` };
  },
});

export const clearUserExpenses = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = ""; 
    
    const expenses = await ctx.db
      .query("expenses")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    
    for (const expense of expenses) {
      await ctx.db.delete(expense._id);
    }
    
    return { message: `Deleted ${expenses.length} expenses` };
  },
});