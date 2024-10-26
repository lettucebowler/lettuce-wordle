<script lang="ts">
	import { browser } from '$app/environment';
	import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';

	let { children } = $props();

	let queryClient = $state(
		new QueryClient({
			defaultOptions: {
				queries: {
					enabled: browser
				}
			}
		})
	);
</script>

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
