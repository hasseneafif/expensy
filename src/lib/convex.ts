import { getContext } from 'svelte';
import { readable, type Readable } from 'svelte/store';
import type { ConvexClient } from 'convex/browser';
import type { FunctionReference, OptionalRestArgs } from 'convex/server';

export function useQuery<Query extends FunctionReference<'query'>>(
  query: Query,
  ...args: OptionalRestArgs<Query>
): Readable<any> {
  const convexStore = getContext<any>('convex');
  let client: ConvexClient;
  
  convexStore.subscribe((value: ConvexClient) => {
    client = value;
  });
  
  return readable(undefined, (set) => {
    if (args[0] === 'skip') {
      set(undefined);
      return () => {};
    }
    
    // Use onUpdate for reactive queries
    const watch = client.onUpdate(query, args[0] || {}, (result: any) => {
      set(result);
    });
    
    return () => {
      watch();
    };
  });
}

export function useMutation<Mutation extends FunctionReference<'mutation'>>(
  mutation: Mutation
) {
  const convexStore = getContext<any>('convex');
  let client: ConvexClient;
  
  convexStore.subscribe((value: ConvexClient) => {
    client = value;
  });
  
  return async (args: any) => {
    return await client.mutation(mutation, args);
  };
}