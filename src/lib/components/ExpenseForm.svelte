<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { DollarSign, Tag, Calendar, FileText, Check, X } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  let amount = '';
  let category = 'Food';
  let description = '';
  let date = new Date().toISOString().split('T')[0];
  
  const categories = [
    'Food',
    'Transport',
    'Bills',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Education',
    'Other'
  ];
  
  function handleSubmit() {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    dispatch('submit', {
      amount,
      category,
      description,
      date
    });
    
    // Reset form
    amount = '';
    category = 'Food';
    description = '';
    date = new Date().toISOString().split('T')[0];
  }
  
  function handleCancel() {
    dispatch('cancel');
  }
  
  // Quick amount buttons
  const quickAmounts = [10, 25, 50, 100];
  
  function setQuickAmount(value: number) {
    amount = value.toString();
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  <!-- Amount Input with Quick Select -->
  <div class="space-y-3">
    <label for="amount" class="flex items-center gap-2 text-sm font-medium text-slate-300">
      <DollarSign class="w-4 h-4 text-cyan-400" />
      Amount
    </label>
    <div class="relative">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-semibold">$</span>
      <input
        id="amount"
        type="number"
        step="0.01"
        min="0"
        bind:value={amount}
        placeholder="0.00"
        class="input-field w-full pl-10 text-lg font-semibold"
        required
      />
    </div>
    
    <!-- Quick Amount Buttons -->
    <div class="flex gap-2">
      {#each quickAmounts as quickAmount}
        <button
          type="button"
          on:click={() => setQuickAmount(quickAmount)}
          class="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800/30 text-slate-300 border border-slate-700/50 hover:bg-slate-800/50 hover:text-white hover:border-slate-600/50 transition-all duration-200"
        >
          ${quickAmount}
        </button>
      {/each}
    </div>
  </div>
  
  <!-- Category and Date in Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label for="category" class="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
        <Tag class="w-4 h-4 text-purple-400" />
        Category
      </label>
      <select
        id="category"
        bind:value={category}
        class="input-field w-full"
      >
        {#each categories as cat}
          <option value={cat}>{cat}</option>
        {/each}
      </select>
    </div>
    
    <div>
      <label for="date" class="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
        <Calendar class="w-4 h-4 text-emerald-400" />
        Date
      </label>
      <input
        id="date"
        type="date"
        bind:value={date}
        class="input-field w-full"
        required
      />
    </div>
  </div>
  
  <!-- Description -->
  <div>
    <label for="description" class="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
      <FileText class="w-4 h-4 text-amber-400" />
      Description
      <span class="text-slate-500 text-xs ml-auto">(Optional)</span>
    </label>
    <textarea
      id="description"
      bind:value={description}
      placeholder="What was this expense for?"
      rows="3"
      class="input-field w-full resize-none"
    />
  </div>
  
  <!-- Action Buttons -->
  <div class="flex gap-3 pt-2">
    <button type="submit" class="btn-primary flex-1 inline-flex items-center justify-center gap-2">
      <Check class="w-4 h-4" />
      Add Expense
    </button>
    <button type="button" on:click={handleCancel} class="btn-secondary inline-flex items-center gap-2">
      <X class="w-4 h-4" />
      Cancel
    </button>
  </div>
</form>