<script lang="ts">
	import AuthNav from '$lib/components/AuthNav.svelte';
	import LetterPageContentContainer from '$lib/components/LetterPageContentContainer.svelte';
	import smallFavicon from '$lib/assets/favicon-16x16.png';
	import bigFavicon from '$lib/assets/favicon-32x32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import safariPinnedTabIcon from '$lib/assets/safari-pinned-tab.svg';
	import '$lib/assets/app.css';

	export let data: import('./$types').LayoutData;

	$: user = data.user;

	$: links = [
		{
			path: '/',
			name: 'Home',
			enabled: true
		},
		{
			path: '/about',
			name: 'About',
			enabled: true
		},
		{
			path: '/login',
			name: 'Login',
			enabled: !user,
			margin: 'left'
		}
	];
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
	<link rel="icon" type="image/png" sizes="32x32" href={bigFavicon} />
	<link rel="icon" type="image/png" sizes="16x16" href={smallFavicon} />
	<link rel="mask-icon" href={safariPinnedTabIcon} color="#a3be8c" />
	<meta charset="UTF-8" />
	<meta name="description" content="Lettuce Wordle`" />
</svelte:head>

<LetterPageContentContainer>
	<AuthNav {links} {user} />
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
</style>
