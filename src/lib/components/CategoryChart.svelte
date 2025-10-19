<script lang="ts">
  import { ShoppingBag, Car, FileText, Gamepad2, ShoppingCart, Heart, GraduationCap, Package } from 'lucide-svelte';
  
  export let data: Array<{ category: string; amount: number }>;
  
  $: total = data.reduce((sum, item) => sum + item.amount, 0);
  $: sortedData = [...data].sort((a, b) => b.amount - a.amount);
  $: maxAmount = Math.max(...data.map(d => d.amount));
  
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
  
  function getPercentage(amount: number): number {
    return (amount / total) * 100;
  }
  
  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Food': 'from-orange-500 to-amber-500',
      'Transport': 'from-blue-500 to-cyan-500',
      'Bills': 'from-red-500 to-rose-500',
      'Entertainment': 'from-purple-500 to-violet-500',
      'Shopping': 'from-pink-500 to-fuchsia-500',
      'Healthcare': 'from-green-500 to-emerald-500',
      'Education': 'from-indigo-500 to-blue-500',
      'Other': 'from-slate-500 to-slate-600'
    };
    return colors[category] || 'from-slate-500 to-slate-600';
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
  
  function getCategoryBgColor(category: string): string {
    const colors: Record<string, string> = {
      'Food': 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      'Transport': 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      'Bills': 'bg-red-500/10 border-red-500/20 text-red-400',
      'Entertainment': 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      'Shopping': 'bg-pink-500/10 border-pink-500/20 text-pink-400',
      'Healthcare': 'bg-green-500/10 border-green-500/20 text-green-400',
      'Education': 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      'Other': 'bg-slate-500/10 border-slate-500/20 text-slate-400'
    };
    return colors[category] || 'bg-slate-500/10 border-slate-500/20 text-slate-400';
  }
</script>

<div class="space-y-6">
  <!-- Category Breakdown -->
  <div class="space-y-4">
    {#each sortedData as item, index}
      {@const percentage = getPercentage(item.amount)}
      {@const barWidth = (item.amount / maxAmount) * 100}
      {@const Icon = getCategoryIcon(item.category)}
      
      <div 
        class="space-y-3 animate-fade-in"
        style="animation-delay: {index * 0.1}s"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 flex-1">
            <div class="w-10 h-10 rounded-xl {getCategoryBgColor(item.category)} border flex items-center justify-center">
              <svelte:component this={Icon} class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <span class="text-white font-semibold block">{item.category}</span>
              <span class="text-slate-400 text-xs">{percentage.toFixed(1)}% of total</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-white font-bold text-lg block">{formatCurrency(item.amount)}</span>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="relative h-3 bg-slate-900/50 rounded-full overflow-hidden border border-slate-800/50">
          <div 
            class="absolute inset-0 bg-gradient-to-r {getCategoryColor(item.category)} rounded-full transition-all duration-700 ease-out animate-shimmer"
            style="width: {barWidth}%"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Total Summary -->
  <div class="pt-6 border-t border-slate-800/50">
    <div class="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-900/50 to-slate-800/30 border border-slate-700/50">
      <div>
        <span class="text-slate-400 text-sm font-medium block mb-1">Total Spending</span>
        <span class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          {formatCurrency(total)}
        </span>
      </div>
      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
        <Package class="w-6 h-6 text-cyan-400" />
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out both;
  }
  
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  
  .animate-shimmer {
    background-size: 1000px 100%;
  }
</style>