<script lang="ts">
	import LetterPageContentContainer from '$lib/components/LetterPageContentContainer.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Navbar from '$lib/components/Navbar.svelte';

	import '$lib/assets/app.css';
	import '$lib/assets/icomoon.css';

	const links = [
		{
			path: '/',
			name: 'Daily'
		},
		{
			path: '/about',
			name: 'About'
		}
	];
</script>

<div class="toast">
	<SvelteToast />
</div>
<LetterPageContentContainer>
	<Navbar {links} />
	<slot />
</LetterPageContentContainer>

<style>
	:global(body) {
		background-color: var(--nord-0);
		margin: 0px 0px;
	}

	.toast {
		font-size: 1rem;
		font-weight: 700;
	}
</style>
