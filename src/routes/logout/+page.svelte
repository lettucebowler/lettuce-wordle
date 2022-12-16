<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import { onMount } from 'svelte';

	onMount(() => {
		const session = $page.data.session;
		if (session) {
			signOut({ callbackUrl: '/' });
		} else {
			goto('/');
		}
	});
</script>
