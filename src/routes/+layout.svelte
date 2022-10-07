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
			path: '/about',
			name: 'About'
		},
		{
			path: '/',
			name: 'Daily'
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
	<nav
		class="box-border grid h-16 grid-cols-3 flex-row justify-between gap-2 rounded-b-2xl bg-polar-400 p-2"
	>
		{#each links as link}
			<div>
				<a
					data-sveltekit-prefetch
					href={link.path}
					class="box-border flex h-12 flex-auto justify-center rounded-lg pt-1 pb-1 pl-2 pr-2 text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
					class:bg-polar-300={$page.url.pathname === link.path}
				>
					{link.name}
				</a>
			</div>
		{/each}
		<div
			class="ml-auto flex h-12 gap-1 rounded-lg transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
		>
			{#if data.props.avatar}
				<img
					src={data.props.avatar}
					class="m-1 box-border flex aspect-square rounded-md"
					alt="user avatar"
				/>
			{/if}
			<a
				href={!data.props.user ? '/login' : '/logout'}
				class="box-border h-12 rounded-lg pt-1 pb-1 pl-2 pr-2 text-center text-3xl text-snow-300 "
			>
				{!data.props.user ? 'Login' : 'Logout'}
			</a>
		</div>
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
