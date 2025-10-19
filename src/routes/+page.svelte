<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Sparkles, TrendingUp, Shield, Zap, ArrowRight, BarChart3, DollarSign } from 'lucide-svelte';
  import logo from '$lib/assets/logo.svg';
  
  let isFirstTime = true;
  
  onMount(() => {
    const userId = localStorage.getItem('expensyUserId');
    const forceHero = localStorage.getItem('expensyForceHero');
    
    if (userId && !forceHero) {
      goto('/dashboard');
    } else {
      localStorage.removeItem('expensyForceHero');
      isFirstTime = true;
    }
  });
  
  function getStarted() {
    let userId = localStorage.getItem('expensyUserId');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('expensyUserId', userId);
    }
    goto('/dashboard');
  }
</script>

{#if isFirstTime}
  <div class="min-h-screen bg-black relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
    </div>
    
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="min-h-screen flex flex-col items-center justify-center py-12">
        <div class="text-center space-y-8 max-w-4xl">
          <div class="relative inline-block mb-8 animate-float">
            <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-2xl opacity-50 animate-pulse-glow"></div>
            <div class="relative">
              <img 
                src={logo} 
                alt="Expensy Logo" 
                class="w-32 h-32 mx-auto drop-shadow-2xl" 
                loading="eager"
                decoding="async"
                fetchpriority="high"
              />
            </div>
          </div>
          
          <div class="space-y-4">
            <h1 class="text-5xl sm:text-5xl md:text-7xl font-bold leading-tight">
              <span class="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Data for your
              </span>
              <br />
              <span class="bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Wallet
              </span>
            </h1>
            <p class="text-xl sm:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Take control of your finances with Data-powered insights and analytics
            </p>
          </div>
          
          <div class="pt-8">
            <button
              on:click={getStarted}
              class="group relative inline-flex items-center gap-3 px-6 py-2 text-md font-semibold text-white rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-400/20 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.05] active:scale-[0.98]"
            >
              <span>Get Started Free</span>
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"></div>
            </button>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-16 max-w-3xl mx-auto">
            <div class="glass-feature-card group">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles class="w-6 h-6 text-cyan-400" />
              </div>
              <h3 class="text-white font-semibold mb-2">AI Insights</h3>
              <p class="text-slate-400 text-sm leading-relaxed">
                Get smart recommendations based on your spending patterns
              </p>
            </div>
            
            <div class="glass-feature-card group">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 class="w-6 h-6 text-purple-400" />
              </div>
              <h3 class="text-white font-semibold mb-2">Visual Analytics</h3>
              <p class="text-slate-400 text-sm leading-relaxed">
                Beautiful charts and graphs to understand your finances
              </p>
            </div>
            
            <div class="glass-feature-card group">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap class="w-6 h-6 text-emerald-400" />
              </div>
              <h3 class="text-white font-semibold mb-2">Lightning Fast</h3>
              <p class="text-slate-400 text-sm leading-relaxed">
                Add expenses in seconds with our streamlined interface
              </p>
            </div>
          </div>
          
          <div class="flex items-center justify-center gap-8 pt-12 text-slate-500 text-sm">
            <div class="flex items-center gap-2">
              <Shield class="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
            <div class="flex items-center gap-2">
              <DollarSign class="w-4 h-4" />
              <span>100% Free</span>
            </div>
            <div class="flex items-center gap-2">
              <TrendingUp class="w-4 h-4" />
              <span>Real-time Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      {#each Array(20) as _, i}
        <div 
          class="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float-particle"
          style="
            left: {Math.random() * 100}%;
            top: {Math.random() * 100}%;
            animation-delay: {Math.random() * 5}s;
            animation-duration: {5 + Math.random() * 10}s;
          "
        ></div>
      {/each}
    </div>
  </div>
{:else}
  <div class="flex items-center justify-center min-h-screen bg-black">
    <div class="text-center">
      <div class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Sparkles class="w-8 h-8 text-white" />
      </div>
      <p class="text-slate-400">Loading Expensy...</p>
    </div>
  </div>
{/if}

<style>
  .glass-feature-card {
    @apply relative p-6 rounded-2xl;
    @apply bg-slate-900/20 backdrop-blur-xl;
    @apply border border-slate-700/30;
    @apply transition-all duration-300;
    @apply hover:bg-slate-900/30 hover:border-slate-600/40;
    @apply hover:scale-[1.02];
    background-image: 
      radial-gradient(at 50% 0%, rgba(6, 182, 212, 0.03) 0px, transparent 50%);
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
  }
  
  @keyframes pulse-slow-delayed {
    0%, 100% {
      opacity: 0.2;
      transform: scale(1);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.15);
    }
  }
  
  @keyframes float-particle {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 0;
    }
    10% {
      opacity: 0.5;
    }
    90% {
      opacity: 0.5;
    }
    100% {
      transform: translate(100px, -100vh) scale(0);
      opacity: 0;
    }
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.6;
    }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 8s ease-in-out infinite;
  }
  
  .animate-pulse-slow-delayed {
    animation: pulse-slow-delayed 10s ease-in-out infinite 2s;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }
  
  .animate-float-particle {
    animation: float-particle linear infinite;
  }
</style>