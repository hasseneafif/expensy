<script lang="ts">
  import { onMount } from 'svelte';
  import { useQuery, useMutation } from '$lib/convex';
  import { api } from '../../../convex/_generated/api';
  import ExpenseForm from '$lib/components/ExpenseForm.svelte';
  import ExpenseList from '$lib/components/ExpenseList.svelte';
  import ExpenseFilters from '$lib/components/ExpenseFilters.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import { Plus, X, DollarSign } from 'lucide-svelte';
  
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
  
  let activeFilters = {
    search: '',
    category: 'all',
    dateRange: 'all',
    amountRange: 'all',
    groupBy: 'date',
    sortOrder: 'desc'
  };
  
  let userId = '';
  let showAddForm = false;
  
  onMount(() => {
    userId = localStorage.getItem('expensyUserId') || '';
  });
  
  interface Expense {
    _id: string;
    userId: string;
    amount: number;
    category: string;
    description?: string;
    date: string;
  }

  $: expenses = useQuery(api.expenses.getExpenses, userId ? { userId } : 'skip' as any);
  
  const addExpense = useMutation(api.expenses.addExpense);
  const deleteExpense = useMutation(api.expenses.deleteExpense);
  
  async function handleAddExpense(event: CustomEvent<{
    amount: string;
    category: string;
    description?: string;
    date: string;
  }>) {
    const { amount, category, description, date } = event.detail;
    
    try {
      await addExpense({
        userId,
        amount: parseFloat(amount),
        category,
        description: description || undefined,
        date,
      });
      showAddForm = false;
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    }
  }
  
  async function handleDeleteExpense(event: CustomEvent) {
    const { id } = event.detail;
    
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense({ id });
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  }
  
  function handleFilter(event: CustomEvent) {
    activeFilters = event.detail;
  }
  
  $: filteredExpenses = $expenses ? $expenses.filter((expense: Expense) => {
    if (activeFilters.search && !expense.description?.toLowerCase().includes(activeFilters.search.toLowerCase()) &&
        !expense.category.toLowerCase().includes(activeFilters.search.toLowerCase())) {
      return false;
    }
    
    if (activeFilters.category !== 'all' && expense.category !== activeFilters.category) {
      return false;
    }
    
    const expenseDate = new Date(expense.date);
    const today = new Date();
    const thisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);
    
    if (activeFilters.dateRange === 'today' && expenseDate.toDateString() !== today.toDateString()) {
      return false;
    }
    if (activeFilters.dateRange === 'week' && expenseDate < thisWeek) {
      return false;
    }
    if (activeFilters.dateRange === 'month' && expenseDate < thisMonth) {
      return false;
    }
    if (activeFilters.dateRange === 'year' && expenseDate < thisYear) {
      return false;
    }
    
    if (activeFilters.amountRange !== 'all') {
      const [min, max] = activeFilters.amountRange.split('-').map(n => n === '+' ? Infinity : Number(n));
      if (expense.amount < min || (max !== Infinity && expense.amount >= max)) {
        return false;
      }
    }
    
    return true;
  }).sort((a: Expense, b: Expense) => {
    const sortMultiplier = activeFilters.sortOrder === 'desc' ? -1 : 1;
    return (new Date(b.date).getTime() - new Date(a.date).getTime()) * sortMultiplier;
  }) : [];
</script>

<div class="space-y-6 animate-fade-in">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div class="space-y-2">
      <h1 class="text-4xl font-bold text-white tracking-tight">Expenses</h1>
      <p class="text-slate-400">Track and manage your daily transactions</p>
    </div>
    
    <button
      on:click={() => showAddForm = !showAddForm}
      class="{showAddForm ? 'btn-secondary' : 'btn-primary'} inline-flex items-center gap-2 transition-all duration-300"
    >
      {#if showAddForm}
        <X class="w-4 h-4" />
        Cancel
      {:else}
        <Plus class="w-4 h-4" />
        New Expense
      {/if}
    </button>
  </div>
  
  {#if showAddForm}
    <div class="glass-card border-cyan-500/20 animate-slide-down">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
          <DollarSign class="w-5 h-5 text-cyan-400" />
        </div>
        <h2 class="text-xl font-bold text-white">Add New Expense</h2>
      </div>
      <ExpenseForm on:submit={handleAddExpense} on:cancel={() => showAddForm = false} />
    </div>
  {/if}
  
  {#if !$expenses}
    <div class="flex justify-center items-center min-h-[300px]">
      <LoadingSpinner size="w-12 h-12" />
    </div>
  {:else if $expenses.length > 0}
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border-cyan-500/20">
          <h3 class="text-sm font-medium text-slate-400 mb-1">Total Spent</h3>
          <p class="text-2xl font-bold text-white">
            {formatCurrency($expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0))}
          </p>
        </div>
        <div class="glass-card bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20">
          <h3 class="text-sm font-medium text-slate-400 mb-1">This Month</h3>
          <p class="text-2xl font-bold text-white">
            {formatCurrency($expenses.filter((e: Expense) => new Date(e.date).getMonth() === new Date().getMonth())
              .reduce((sum: number, e: Expense) => sum + e.amount, 0))}
          </p>
        </div>
        <div class="glass-card bg-gradient-to-br from-emerald-500/10 to-green-500/5 border-emerald-500/20">
          <h3 class="text-sm font-medium text-slate-400 mb-1">Average per Day</h3>
          <p class="text-2xl font-bold text-white">
            {formatCurrency($expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0) / 30)}
          </p>
        </div>
        <div class="glass-card bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20">
          <h3 class="text-sm font-medium text-slate-400 mb-1">Most Spent On</h3>
          <p class="text-2xl font-bold text-white">
            {Object.entries($expenses.reduce((acc: Record<string, number>, e: Expense) => 
              ({...acc, [e.category]: (acc[e.category] || 0) + e.amount}), {}))
              .sort(([,a], [,b]) => (b as number) - (a as number))[0][0]}
          </p>
        </div>
      </div>
      
      <ExpenseFilters
        categories={Array.from(new Set($expenses.map((e: Expense) => e.category)))}
        on:filter={handleFilter}
      />
      
      <ExpenseList
        expenses={filteredExpenses}
        groupBy={activeFilters.groupBy}
        on:delete={handleDeleteExpense}
      />
    </div>
  {:else if !showAddForm}
    <div class="glass-card text-center py-16">
      <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 flex items-center justify-center mx-auto mb-6">
        <DollarSign class="w-10 h-10 text-slate-500" />
      </div>
      <h3 class="text-2xl font-bold text-white mb-3">No Expenses Yet</h3>
      <p class="text-slate-400 mb-8 max-w-md mx-auto">
        Start building your financial story by recording your first transaction
      </p>
      <button
        on:click={() => showAddForm = true}
        class="btn-primary inline-flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Add Your First Expense
      </button>
    </div>
  {/if}
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
  
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
  
  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }
</style>