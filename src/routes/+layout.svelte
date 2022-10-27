<script lang="ts">
	import { Trophy, Home } from '@steeze-ui/heroicons';
	import AuthNav from '$lib/components/AuthNav.svelte';
	import LetterPageContentContainer from '$lib/components/LetterPageContentContainer.svelte';
	import smallFavicon from '$lib/assets/favicon-16x16.png';
	import bigFavicon from '$lib/assets/favicon-32x32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import safariPinnedTabIcon from '$lib/assets/safari-pinned-tab.svg';
	import '$lib/assets/app.css';

	export let data: import('./$types').LayoutData = {
		user: {
			login: '',
			avatar: ''
		}
	};

	$: user = data.user;

	let links: {
		path: string;
		name: string;
		margin?: string;
		enabled: boolean;
	}[];

	$: links = [
		{
			path: '/',
			name: 'Home',
			enabled: true,
			prefetch: true,
			icon: Home
		},
		{
			path: '/rankings',
			name: 'Rankings',
			enabled: true,
			prefetch: true,
			icon: Trophy
		},
		{
			path: '/about',
			name: 'About',
			enabled: true,
			prefetch: true
		},
		{
			path: '/login',
			name: 'Login',
			enabled: !user.login,
			margin: 'left',
			prefetch: false
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
		overflow-y: overlay;
	}

	:global(::-webkit-scrollbar) {
		width: 16px;
		height: 1em;
	}

	:global(::-webkit-scrollbar-track) {
		background: transparent;
		border-radius: 100vw;
		margin-block: 4px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: #4c566a;
		border: 0.25em solid #2e3440;
		border-radius: 100vw;
	}
</style>
