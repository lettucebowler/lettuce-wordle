<script lang="ts">
	import LetterPageContentContainer from '$lib/components/LetterPageContentContainer.svelte';
	import { page } from '$app/stores';
	import smallFavicon from '$lib/assets/favicon-16x16.png';
	import bigFavicon from '$lib/assets/favicon-32x32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import safariPinnedTabIcon from '$lib/assets/safari-pinned-tab.svg';
	import '$lib/assets/app.css';

	export let data: import('./$types').LayoutData;

	const links = [
		{
			path: '/',
			name: 'Home'
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
	<meta charset="UTF-8" />
	<meta name="description" content="Lettuce Wordle`" />
</svelte:head>

<LetterPageContentContainer>
	<nav class="box-border flex h-16 justify-between gap-1 rounded-b-2xl bg-polar-400 p-1">
		{#each links as link}
			<a
				data-sveltekit-prefetch
				href={link.path}
				class="box-border flex h-full items-center justify-center rounded-xl pr-2 pl-2 text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
				class:bg-polar-300={$page.url.pathname === link.path}
			>
				{link.name}
			</a>
		{/each}
		<a
			href={!data.props.user ? '/login' : '/logout'}
			class="ml-auto box-border flex h-full items-center justify-center gap-2 rounded-xl p-1 text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
		>
			{#if data.props.avatar}
				<img
					src={data.props.avatar}
					class="box-border flex aspect-square h-full rounded-md"
					alt="user avatar"
				/>
			{/if}
			<span class="m-1 hidden sm:inline">{data.props.user || 'Login'}</span>
		</a>
	</nav>
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
