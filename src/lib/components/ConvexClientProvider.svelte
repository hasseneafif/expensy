<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { ConvexClient } from 'convex/browser';
  import { VITE_CONVEX_URL } from '$env/static/public';
  
  const client = new ConvexClient(VITE_CONVEX_URL);
  const convexStore = writable(client);
  
  setContext('convex', convexStore);
  
  onMount(() => {
    return () => {
      client.close();
    };
  });
</script>

<slot />