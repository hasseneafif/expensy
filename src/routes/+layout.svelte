<svelte:head>
  <link rel="preload" href="/src/lib/assets/logo.svg" as="image" />
  <meta name="description" content="Track and manage your daily expenses with Expensy" />
  <link rel="dns-prefetch" href="https://optimistic-starling-428.convex.cloud" />
</svelte:head>

<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ConvexClientProvider from '$lib/components/ConvexClientProvider.svelte';
  import { LayoutDashboard, Receipt, User, Sparkles, LogOut } from 'lucide-svelte';
  
  let showNamePopup = false;
  let showUserIdPopup = false;
  let showImportAccount = false;
  let userName = '';
  let userId = '';
  let importUserId = '';
  let importUserIdError = '';

  function handleLogout() {
    localStorage.setItem('expensyForceHero', 'true');
    goto('/');
  }
  
  onMount(() => {
    userId = localStorage.getItem('expensyUserId') || '';
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('expensyUserId', userId);
    }
    
    const hasSetName = localStorage.getItem('expensyHasSetName');
    if (!hasSetName) {
      showNamePopup = true;
    }
  });
  
  function saveName() {
    if (userName.trim()) {
      localStorage.setItem('expensyUserName', userName.trim());
      localStorage.setItem('expensyHasSetName', 'true');
      showNamePopup = false;
    }
  }
  
  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      if (showImportAccount) {
        handleImportAccount();
      } else {
        saveName();
      }
    }
  }

  function handleImportAccount() {
    const idPattern = /^user_\d+_[a-z0-9]{9}$/;
    if (!idPattern.test(importUserId)) {
      importUserIdError = 'Invalid user ID format';
      return;
    }
    localStorage.setItem('expensyUserId', importUserId);
    userId = importUserId;
    showNamePopup = false;
    importUserIdError = '';
  }

  function copyUserId() {
    navigator.clipboard.writeText(userId);
  }
</script>

<ConvexClientProvider>
  <div class="min-h-screen bg-black">
    <div class="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 pt-4">
      <nav class="floating-nav max-w-7xl mx-auto">
        <div class="px-4 sm:px-6">
          <div class="flex items-center justify-between p-0 md:p-3">
<a href="/" class="flex items-center space-x-3 group hidden md:block">
  <div class="relative">
    <div class="absolute  inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
    <div class="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25 overflow-hidden bg-transparent">
      <img src="/src/lib/assets/logo.svg" alt="Expensy logo" class="w-10 h-10 object-contain" />
    </div>
  </div>
</a>

            
            <div class="hidden md:flex items-center space-x-2">
              <a 
                href="/dashboard" 
                class="nav-link {$page.url.pathname.startsWith('/dashboard') ? 'nav-link-active' : ''}"
              >
                <LayoutDashboard class="w-4 h-4" />
                Dashboard
              </a>
              <a 
                href="/expenses" 
                class="nav-link {$page.url.pathname.startsWith('/expenses') ? 'nav-link-active' : ''}"
              >
                <Receipt class="w-4 h-4" />
                Expenses
              </a>
            </div>
            
            <div class="hidden md:flex items-center gap-3">
              {#if userName || typeof window !== 'undefined' && localStorage.getItem('expensyUserName')}
                <button 
                  on:click={() => showUserIdPopup = true}
                  class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-slate-600/50 transition-all"
                >
                  <User class="w-4 h-4 text-slate-400" />
                  <span class="text-slate-300 text-sm font-medium">
                    {userName || localStorage.getItem('expensyUserName')}
                  </span>
                </button>
                {#if $page.url.pathname !== '/'}
                  <button 
                    on:click={handleLogout}
                    class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-slate-800/50"
                    title="Logout"
                  >
                    <LogOut class="w-4 h-4 text-slate-400" />
                  </button>
                {/if}
              {/if}
            </div>
          </div>
          
          <div class="md:hidden flex gap-2 pb-3 pt-2">
            <a 
              href="/dashboard" 
              class="nav-link-mobile {$page.url.pathname.startsWith('/dashboard') ? 'nav-link-mobile-active' : ''}"
            >
              <LayoutDashboard class="w-4 h-4" />
              Dashboard
            </a>
            <a 
              href="/expenses" 
              class="nav-link-mobile {$page.url.pathname.startsWith('/expenses') ? 'nav-link-mobile-active' : ''}"
            >
              <Receipt class="w-4 h-4" />
              Expenses
            </a>
          </div>
        </div>
      </nav>
    </div>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-24 pb-8">
      <slot />
    </main>
  </div>

  {#if showUserIdPopup}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" on:click={() => showUserIdPopup = false}>
      <div class="glass-card w-full max-w-[min(90vw,24rem)] my-4 shadow-2xl shadow-cyan-500/10 animate-scale-in" on:click|stopPropagation>
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-white mb-3">Your Account ID</h2>
          <p class="text-slate-400 text-sm mb-4">You can use this ID to log in from other devices and see your expense history</p>
          <div class="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <code class="text-cyan-400 flex-1 text-sm break-all">{userId}</code>
            <button 
              on:click={copyUserId}
              class="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 text-sm transition-all shrink-0"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if showNamePopup}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
      <div class="glass-card w-full max-w-[min(90vw,24rem)] my-4 shadow-2xl shadow-cyan-500/10 animate-scale-in">
        <div class="text-center mb-4 sm:mb-6">
          <div class="relative inline-block mb-4 sm:mb-6">
            <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-50"></div>
            <div class="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Welcome to Expensy</h2>
          <p class="text-slate-400 text-sm sm:text-base">Let's personalize your experience</p>
        </div>
        
        {#if !showImportAccount}
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
                What should we call you?
              </label>
              <input
                id="name"
                type="text"
                bind:value={userName}
                on:keypress={handleKeyPress}
                placeholder="Enter your name"
                class="input-field w-full text-base"
                autofocus
              />
            </div>
            
            <button
              on:click={saveName}
              disabled={!userName.trim()}
              class="btn-primary w-full py-2.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Started
            </button>

            <button
              on:click={() => showImportAccount = true}
              class="w-full text-sm text-slate-400 hover:text-slate-300 transition-colors mt-4 py-2"
            >
              Already have an account?
            </button>
          </div>
        {:else}
          <div class="space-y-4">
            <div>
              <label for="userId" class="block text-sm font-medium text-slate-300 mb-2">
                Enter your Account ID
              </label>
              <input
                id="userId"
                type="text"
                bind:value={importUserId}
                on:keypress={handleKeyPress}
                placeholder="e.g., user_1234567890_abc123def"
                class="input-field w-full text-base"
                autofocus
              />
              {#if importUserIdError}
                <p class="text-red-400 text-sm mt-1">{importUserIdError}</p>
              {/if}
            </div>
            
            <button
              on:click={handleImportAccount}
              disabled={!importUserId.trim()}
              class="btn-primary w-full py-2.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import Account
            </button>

            <button
              on:click={() => {
                showImportAccount = false;
                importUserIdError = '';
                importUserId = '';
              }}
              class="w-full text-sm text-slate-400 hover:text-slate-300 transition-colors mt-4 py-2"
            >
              Create new account instead
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</ConvexClientProvider>

<style>
  :global(body) {
    overflow-x: hidden;
    background: #000000;
  }
  
  .floating-nav {
    @apply bg-slate-900/20 backdrop-blur-2xl;
    @apply border border-slate-700/30 rounded-2xl;
    @apply shadow-2xl shadow-black/20;
    background-image: 
      radial-gradient(at 50% 0%, rgba(6, 182, 212, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 50%, rgba(139, 92, 246, 0.05) 0px, transparent 50%);
  }
  
  .floating-nav:hover {
    @apply border-slate-600/40;
    box-shadow: 
      0 0 0 1px rgba(148, 163, 184, 0.05),
      0 20px 40px -12px rgba(0, 0, 0, 0.5),
      0 0 80px -20px rgba(6, 182, 212, 0.15);
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out;
  }
</style>