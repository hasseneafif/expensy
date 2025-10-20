<script lang="ts" context="module">
  export {};
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Trash2, ShoppingBag, Car, FileText, Gamepad2, ShoppingCart, Heart, GraduationCap, Package, ChevronRight } from 'lucide-svelte';
  
  export let expenses: any[];
  export let groupBy: string = 'date';
  
  const dispatch = createEventDispatcher();
  
  let groupedExpenses: Record<string, any[]>;
  
  $: {
    if (groupBy === 'date') {
      const groups = expenses.reduce((acc: Record<string, any[]>, expense) => {
        const date = formatDate(expense.date);
        if (!acc[date]) acc[date] = [];
        acc[date].push(expense);
        return acc;
      }, {});

      const sortedDates = Object.keys(groups).sort((a, b) => {
        const getTimestamp = (displayDate: string) => {
          if (displayDate === 'Today') return new Date().setHours(0, 0, 0, 0);
          if (displayDate === 'Yesterday') return new Date().setDate(new Date().getDate() - 1);
          return new Date(displayDate).getTime();
        };
        return getTimestamp(b) - getTimestamp(a); // Descending order
      });

      groupedExpenses = sortedDates.reduce((acc: Record<string, any[]>, date) => {
        acc[date] = groups[date];
        return acc;
      }, {});
    } else if (groupBy === 'category') {
      const groups = expenses.reduce((acc: Record<string, any[]>, expense) => {
        if (!acc[expense.category]) acc[expense.category] = [];
        acc[expense.category].push(expense);
        return acc;
      }, {});

      const sortedCategories = Object.entries(groups)
        .sort(([, a], [, b]) => {
          const totalA = a.reduce((sum, e) => sum + e.amount, 0);
          const totalB = b.reduce((sum, e) => sum + e.amount, 0);
          return totalB - totalA;
        })
        .reduce((acc: Record<string, any[]>, [category, expenses]) => {
          acc[category] = expenses;
          return acc;
        }, {});

      groupedExpenses = sortedCategories;
    } else {
      groupedExpenses = { 'All Expenses': expenses };
    }
  }
  
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    }).format(date);
  }
  
  function getCategoryIcon(category: string) {
    const icons: Record<string, any> = {
      'Food': ShoppingBag,
      'Transport': Car,
      'Bills': FileText,
      'Entertainment': Gamepad2,
      'Shopping': ShoppingCart,
      'Healthcare': Heart,
      'Education': GraduationCap,
      'Other': Package
    };
    return icons[category] || Package;
  }
  
  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Food': 'from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-400',
      'Transport': 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
      'Bills': 'from-red-500/20 to-rose-500/10 border-red-500/30 text-red-400',
      'Entertainment': 'from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-400',
      'Shopping': 'from-pink-500/20 to-fuchsia-500/10 border-pink-500/30 text-pink-400',
      'Healthcare': 'from-green-500/20 to-emerald-500/10 border-green-500/30 text-green-400',
      'Education': 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-400',
      'Other': 'from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-400'
    };
    return colors[category] || 'from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-400';
  }
  
  function handleDelete(id: string) {
    dispatch('delete', { id });
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-bold text-white">Transaction History</h2>
    <span class="text-sm text-slate-400">{expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}</span>
  </div>
  
  {#each Object.entries(groupedExpenses) as [group, groupExpenses]}
    <div class="space-y-4">
      <div class="flex items-center gap-2 text-slate-300">
        <ChevronRight class="w-4 h-4" />
        <h3 class="text-lg font-semibold">{group}</h3>
        <span class="text-sm text-slate-400">({groupExpenses.length})</span>
      </div>
      
      <div class="space-y-3">
        {#each groupExpenses as expense, index}
          {@const Icon = getCategoryIcon(expense.category)}
          <div 
            class="glass-card group hover:scale-[1.01] transition-all duration-300"
            style="animation: slide-in 0.3s ease-out {index * 0.05}s both"
          >
            <div class="flex items-start gap-4">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-br {getCategoryColor(expense.category)} rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div class="relative w-12 h-12 rounded-xl bg-gradient-to-br {getCategoryColor(expense.category)} border flex items-center justify-center">
                  <svelte:component this={Icon} class="w-5 h-5" />
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3 mb-1">
                  <div class="flex-1">
                    <h3 class="text-white font-semibold text-lg">{expense.category}</h3>
                    <p class="text-sm text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{formatDate(expense.date)}</span>
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-white whitespace-nowrap">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                </div>
                
                {#if expense.description}
                  <p class="text-sm text-slate-400 mt-2 leading-relaxed">
                    {expense.description}
                  </p>
                {/if}
              </div>
              
              <button
                on:click={() => handleDelete(expense._id)}
                class="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2.5 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-500/20"
                title="Delete expense"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>