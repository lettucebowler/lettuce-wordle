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
	a {
		color: var(--nord-6);
		text-align: center;
		font-size: 1.5rem;
		padding: 8px 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		margin: 4px 4px;
		border-radius: 9px;
	}

	a:hover {
		color: var(--nord-4);
		background-color: var(--nord-1);
	}

	.current {
		background-color: var(--nord-0);
	}

	.current:hover {
		background-color: var(--nord-0);
	}

	a:active {
		background-color: var(--nord-0);
	}

	body {
		background-color: var(--nord-0);
		margin: 0px 0px;
		font-family: 'Courier New', monospace;
		font-weight: 500;
	}

	nav {
		display: flex;
		justify-content: center;
		background-color: var(--nord-1);
		height: calc((100 / 8.5)vh - 8px);
		aspect-ratio: 11;
		border-radius: 4px;
		margin: 2px 2px;
	}

	.toast {
		font-size: 1rem;
	}
</style>
