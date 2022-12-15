<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('login');
		signIn('github');
	});
</script>
