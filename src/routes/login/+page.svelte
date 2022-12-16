<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';
	import { onMount } from 'svelte';

	onMount(() => {
		const session = $page.data.session;
		if (!session) {
			signIn('github', { callbackUrl: '/?saveGame=true' });
		} else {
			goto('/');
		}
	});
</script>

<div
	class="flex flex-col items-center justify-center gap-4 pt-6 text-3xl font-medium text-snow-300"
>
	<p>Just a sec...</p>
	<svg
		class="-ml-1 mr-3 h-5 w-5 animate-spin text-snow-300"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
	>
		<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
		<path
			class="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		/>
	</svg>
</div>
