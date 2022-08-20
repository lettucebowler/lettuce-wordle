<script lang="ts">
	import LetterPageContentContainer from '$lib/components/LetterPageContentContainer.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Navbar from '@lettucebowler/lettuce-ui/components/Navbar.svelte';
	import smallFavicon from '$lib/assets/favicon-16x16.png';
	import bigFavicon from '$lib/assets/favicon-32x32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import safariPinnedTabIcon from '$lib/assets/safari-pinned-tab.svg';

	import '$lib/assets/app.css';

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

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
	<link rel="icon" type="image/png" sizes="32x32" href={bigFavicon} />
	<link rel="icon" type="image/png" sizes="16x16" href={smallFavicon} />
	<link rel="mask-icon" href={safariPinnedTabIcon} color="#a3be8c" />
</svelte:head>

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

	:global(body, html) {
		height: 100%;
		min-height: 100%;
		box-sizing: border-box;
	}

	.toast {
		font-size: 1rem;
		font-weight: 700;
	}
</style>
