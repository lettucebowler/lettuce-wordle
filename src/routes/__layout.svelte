<script lang="ts">
	import '$lib/styles/app.css';
	import LetterPageContentContainer from '$lib/components/LetterPageContentContainer.svelte';
	import { page } from '$app/stores';
	import { SvelteToast } from '@zerodevx/svelte-toast';
import Navbar from '$lib/components/Navbar.svelte';

	const links = [
		{
			path: '/',
			name: 'Daily',
		},
		{
			path: '/random',
			name: 'Random',
		},
		{
			path: '/about',
			name: 'About'
		}
	];
</script>


<svelte:head>
	<link rel="icon" type="image/png" href="/favicon.png" />
</svelte:head>
<body>
	<div class="toast">
		<SvelteToast />
	</div>
	<div id="clipboard" />
	<LetterPageContentContainer>
		<Navbar {links} />
		<slot />
	</LetterPageContentContainer>
</body>

<style>
	body {
		background-color: var(--nord-0);
		margin: 0px 0px;
		font-family: 'Courier New', monospace;
	}

	.toast {
		font-size: 1rem;
		font-weight: 700;
	}
</style>
