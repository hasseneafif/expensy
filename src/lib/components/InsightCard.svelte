<script lang="ts">
  import { TrendingUp, TrendingDown, Activity, RefreshCw, CheckCircle, AlertCircle } from 'lucide-svelte';
  
  export let insight: string;
  
  function getInsightIcon(insight: string) {
    if (insight.includes('increased') || insight.includes('more')) {
      return TrendingUp;
    } else if (insight.includes('decreased') || insight.includes('less') || insight.includes('Great job')) {
      return TrendingDown;
    } else if (insight.includes('average')) {
      return Activity;
    } else if (insight.includes('frequent')) {
      return RefreshCw;
    } else if (insight.includes('Excellent') || insight.includes('reduced')) {
      return CheckCircle;
    } else if (insight.includes('Consider')) {
      return AlertCircle;
    }
    return Activity;
  }
  
  function getInsightColor(insight: string): string {
    if (insight.includes('Great job') || insight.includes('Excellent') || insight.includes('reduced') || insight.includes('decreased by')) {
      return 'from-emerald-500/10 via-green-500/5 to-transparent border-emerald-500/20 text-emerald-400 icon-emerald';
    } else if (insight.includes('increased by') || insight.includes('Consider')) {
      return 'from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20 text-amber-400 icon-amber';
    }
    return 'from-cyan-500/10 via-blue-500/5 to-transparent border-cyan-500/20 text-cyan-400 icon-cyan';
  }
</script>

<div class="insight-card bg-gradient-to-r {getInsightColor(insight)} backdrop-blur-sm border rounded-xl p-5 hover:scale-[1.01] transition-all duration-300 group">
  <div class="flex items-start gap-4">
    <div class="relative mt-0.5">
      <div class="absolute inset-0 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
      <div class="relative w-10 h-10 rounded-xl bg-gradient-to-br border flex items-center justify-center">
        <svelte:component this={getInsightIcon(insight)} class="w-5 h-5" />
      </div>
    </div>
    <p class="text-slate-200 leading-relaxed flex-1 font-medium">
      {insight}
    </p>
  </div>
</div>

<style>
  .insight-card.icon-emerald .relative {
    @apply from-emerald-500/20 to-green-500/10 border-emerald-500/30;
  }
  
  .insight-card.icon-emerald :global(svg) {
    @apply text-emerald-400;
  }
  
  .insight-card.icon-amber .relative {
    @apply from-amber-500/20 to-orange-500/10 border-amber-500/30;
  }
  
  .insight-card.icon-amber :global(svg) {
    @apply text-amber-400;
  }
  
  .insight-card.icon-cyan .relative {
    @apply from-cyan-500/20 to-blue-500/10 border-cyan-500/30;
  }
  
  .insight-card.icon-cyan :global(svg) {
    @apply text-cyan-400;
  }
</style>