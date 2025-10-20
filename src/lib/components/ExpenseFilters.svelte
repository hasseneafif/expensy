<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Search, Calendar, Filter, SortDesc, ChevronDown, ChevronUp } from 'lucide-svelte';
  
  export let categories: string[];
  const dispatch = createEventDispatcher();
  
  let searchQuery = '';
  let selectedCategory = 'all';
  let selectedDateRange = 'all';
  let selectedAmountRange = 'all';
  let groupBy = 'date';
  let sortOrder = 'desc';
  let isExpanded = false;
  
  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];
  
  function handleFilterChange() {
    dispatch('filter', {
      search: searchQuery,
      category: selectedCategory,
      dateRange: selectedDateRange,
      amountRange: selectedAmountRange,
      groupBy,
      sortOrder
    });
  }
  
  function toggleExpand() {
    isExpanded = !isExpanded;
  }
  
  $: {
    searchQuery, selectedCategory, selectedDateRange, selectedAmountRange, groupBy, sortOrder;
    handleFilterChange();
  }
</script>

<div class="glass-card mb-6">
  <div class="pb-4">
    <div class="relative">
      <Search class="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search expenses..."
        class="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      />
    </div>
  </div>
  
  <button
    on:click={toggleExpand}
    class="w-full flex items-center justify-between py-3 px-4 -mx-4 hover:bg-slate-800/30 transition-colors rounded-lg"
  >
    <div class="flex items-center gap-2 text-slate-300">
      <Filter class="w-4 h-4" />
      <span class="text-sm font-medium">Advanced Filters</span>
    </div>
    {#if isExpanded}
      <ChevronUp class="w-5 h-5 text-slate-400" />
    {:else}
      <ChevronDown class="w-5 h-5 text-slate-400" />
    {/if}
  </button>
  
  {#if isExpanded}
    <div class="pt-4 mt-4 border-t border-slate-700/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="space-y-2">
        <label for="category-filter" class="text-sm font-medium text-slate-400">Category</label>
        <select
          id="category-filter"
          bind:value={selectedCategory}
          class="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer"
          style="color-scheme: dark;"
        >
          <option value="all">All Categories</option>
          {#each categories as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>
      
      <div class="space-y-2">
        <label for="date-filter" class="text-sm font-medium text-slate-400">Time Period</label>
        <select
          id="date-filter"
          bind:value={selectedDateRange}
          class="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer"
          style="color-scheme: dark;"
        >
          {#each dateRanges as range}
            <option value={range.value}>{range.label}</option>
          {/each}
        </select>
      </div>
      
      <div class="space-y-2">
        <label for="amount-filter" class="text-sm font-medium text-slate-400">Amount Range</label>
        <select
          id="amount-filter"
          bind:value={selectedAmountRange}
          class="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer"
          style="color-scheme: dark;"
        >
          <option value="all">All Amounts</option>
          <option value="0-50">$0 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-500">$100 - $500</option>
          <option value="500+">$500+</option>
        </select>
      </div>
      
      <div class="space-y-2">
        <label for="group-filter" class="text-sm font-medium text-slate-400">Group By</label>
        <select
          id="group-filter"
          bind:value={groupBy}
          class="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer"
          style="color-scheme: dark;"
        >
          <option value="date">Date</option>
          <option value="category">Category</option>
          <option value="none">No Grouping</option>
        </select>
      </div>
    </div>
  {/if}
</div>