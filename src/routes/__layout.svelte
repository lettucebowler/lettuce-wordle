<script>
	import '$lib/styles/app.css';
	import LetterPageContentContainer from '$lib/components/LetterPageContentContainer.svelte';
    import {page} from '$app/stores';
    import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<nav>
	<a sveltekit:prefetch href="/" class="{$page.url.pathname === '/' ? 'current' : ''}" >Daily</a>
	<a sveltekit:prefetch href="/random" class="{$page.url.pathname === '/random' ? 'current' : ''}" >Random</a>
	<a sveltekit:prefetch href="/about" class="{$page.url.pathname === '/about' ? 'current' : ''}" >About</a>
</nav>

<svelte:head>
  <link rel="icon" type="image/png" href="/favicon.png">
</svelte:head>

<body>
    <SvelteToast />
	<LetterPageContentContainer>
		<slot />
	</LetterPageContentContainer>
</body>

<style>
	a {
		color: var(--nord-6);
		text-align: center;
		font-size: 2rem;
		padding: 8px 12px;
		display: inline-block;
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

    .current:hover{
        background-color: var(--nord-0);
    }

    a:active {
        background-color: var(--nord-0);
    }

	body {
		background-color: var(--nord-0);
		margin: 0px 0px;
		min-width: 600px;
	}

	nav {
		display: flex;
		justify-content: center;
		background-color: var(--nord-1);
	}
</style>
