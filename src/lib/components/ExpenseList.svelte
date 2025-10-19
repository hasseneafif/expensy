<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Trash2, ShoppingBag, Car, FileText, Gamepad2, ShoppingCart, Heart, GraduationCap, Package } from 'lucide-svelte';
  
  export let expenses: any[];
  
  const dispatch = createEventDispatcher();
  
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
    
    // Check if today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    // Check if yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    // Otherwise return formatted date
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

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-bold text-white">Transaction History</h2>
    <span class="text-sm text-slate-400">{expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}</span>
  </div>
  
  <div class="space-y-3">
    {#each expenses as expense, index}
      {@const Icon = getCategoryIcon(expense.category)}
      <div 
        class="glass-card group hover:scale-[1.01] transition-all duration-300"
        style="animation: slide-in 0.3s ease-out {index * 0.05}s both"
      >
        <div class="flex items-start gap-4">
          <!-- Category Icon -->
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br {getCategoryColor(expense.category)} rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div class="relative w-12 h-12 rounded-xl bg-gradient-to-br {getCategoryColor(expense.category)} border flex items-center justify-center">
              <svelte:component this={Icon} class="w-5 h-5" />
            </div>
          </div>
          
          <!-- Expense Details -->
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
          
          <!-- Delete Button -->
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