<script lang="ts">
  import { onMount } from 'svelte';
  import { useQuery } from '$lib/convex';
  import { api } from '../../../convex/_generated/api';
  import CategoryChart from '$lib/components/CategoryChart.svelte';
  import InsightCard from '$lib/components/InsightCard.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import { TrendingUp, Calendar, Wallet, DollarSign, Sparkles } from 'lucide-svelte';
  
  let userId = '';
  
  onMount(() => {
    userId = localStorage.getItem('expensyUserId') || '';
  });
  
  $: summary = useQuery(api.analytics.getSpendingSummary, userId ? { userId } : 'skip' as any);
  $: categoryData = useQuery(api.analytics.getCategoryBreakdown, userId ? { userId } : 'skip' as any);
  $: insights = useQuery(api.analytics.getInsights, userId ? { userId } : 'skip' as any);
  
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
</script>

<div class="space-y-8 animate-fade-in">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div class="space-y-2">
      <h1 class="text-4xl font-bold text-white tracking-tight">
        Dashboard
      </h1>
      <p class="text-slate-400">Monitor your financial activity in real-time</p>
    </div>
  </div>
  
  {#if !$summary}
    <div class="flex justify-center items-center min-h-[300px]">
      <LoadingSpinner size="w-12 h-12" />
    </div>
  {:else}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="glass-card group hover:scale-[1.02] transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
              <Calendar class="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span class="text-slate-400 text-sm font-medium">Today</span>
        </div>
      </div>
      <p class="text-3xl font-bold text-white mb-1">
        {$summary ? formatCurrency($summary.daily) : '$0.00'}
      </p>
      <div class="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden mt-3">
        <div class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-2/3 animate-pulse-glow"></div>
      </div>
    </div>
    
    <div class="glass-card group hover:scale-[1.02] transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <TrendingUp class="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <span class="text-slate-400 text-sm font-medium">This Week</span>
        </div>
      </div>
      <p class="text-3xl font-bold text-white mb-1">
        {$summary ? formatCurrency($summary.weekly) : '$0.00'}
      </p>
      <div class="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden mt-3">
        <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-3/4 animate-pulse-glow"></div>
      </div>
    </div>
    
    <div class="glass-card group hover:scale-[1.02] transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Wallet class="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <span class="text-slate-400 text-sm font-medium">This Month</span>
        </div>
      </div>
      <p class="text-3xl font-bold text-white mb-1">
        {$summary ? formatCurrency($summary.monthly) : '$0.00'}
      </p>
      <div class="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden mt-3">
        <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-4/5 animate-pulse-glow"></div>
      </div>
    </div>
    
    <div class="glass-card group hover:scale-[1.02] transition-all duration-300 border-amber-500/20">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <DollarSign class="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <span class="text-slate-400 text-sm font-medium">All Time</span>
        </div>
      </div>
      <p class="text-3xl font-bold text-white mb-1">
        {$summary ? formatCurrency($summary.total) : '$0.00'}
      </p>
      <div class="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden mt-3">
        <div class="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-full animate-pulse-glow"></div>
      </div>
    </div>
  </div>
  
  {#if $insights && $insights.length > 0}
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center">
          <Sparkles class="w-5 h-5 text-violet-400" />
        </div>
        <h2 class="text-2xl font-bold text-white">Data Analytics</h2>
      </div>
      <div class="grid grid-cols-1 gap-3">
        {#each $insights as insight}
          <InsightCard {insight} />
        {/each}
      </div>
    </div>
  {/if}
  
  {#if $categoryData && $categoryData.length > 0}
    <div class="glass-card">
      <h2 class="text-2xl font-bold text-white mb-6">Spending by Category</h2>
      <CategoryChart data={$categoryData} />
    </div>
  {:else}
    <div class="glass-card text-center py-16 animate-slide-up transform transition-all duration-500 hover:scale-[1.02]">
      <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 flex items-center justify-center mx-auto mb-6 animate-float relative overflow-hidden group">
        <div class="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <TrendingUp class="w-10 h-10 text-slate-500 group-hover:text-slate-300 transition-colors duration-300" />
      </div>
      <h3 class="text-2xl font-bold text-white mb-3 animate-slide-up opacity-0" style="animation-delay: 200ms; animation-fill-mode: forwards;">No Data Yet</h3>
      <p class="text-slate-400 mb-8 max-w-md mx-auto animate-slide-up opacity-0" style="animation-delay: 400ms; animation-fill-mode: forwards;">
        Start tracking your expenses to unlock powerful insights and analytics
      </p>
      <a href="/expenses" class="btn-primary inline-flex items-center gap-2 animate-slide-up opacity-0 hover:scale-105 hover:brightness-110 transition-all duration-300" style="animation-delay: 600ms; animation-fill-mode: forwards;">
        <DollarSign class="w-4 h-4 animate-bounce-gentle" />
        Add Your First Expense
      </a>
    </div>
  {/if}
  {/if}
</div>

<style>
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-15px) scale(1.05);
    }
  }

  .animate-float {
    animation: float 4s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(200%);
    }
  }

  .animate-shimmer {
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes bounce-gentle {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }

  .animate-bounce-gentle {
    animation: bounce-gentle 1.5s ease-in-out infinite;
  }
</style>