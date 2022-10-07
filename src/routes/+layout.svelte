<script lang="ts">
	import { slide } from 'svelte/transition';
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

	let showDropdown = false;

	const toggleDropDown = () => {
		showDropdown = !showDropdown;
	};
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
	<nav class="box-border flex flex-col justify-between gap-1 rounded-b-2xl bg-polar-400 p-1">
		<div class="flex h-16">
			{#each links as link}
				<a
					data-sveltekit-prefetch
					href={link.path}
					class="box-border flex h-full items-center justify-center rounded-xl pr-2 pl-2 text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
				>
					{link.name}
				</a>
			{/each}
			{#if data.user}
				<div
					class="z-10 ml-auto box-border h-full items-center justify-center gap-2 rounded-xl text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
				>
					<button
						on:click={toggleDropDown}
						class="box-border flex h-full items-center justify-center gap-2 rounded-xl p-1 text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
					>
						{#if data.user.avatar}
							<img
								src={data.user.avatar}
								class="box-border flex aspect-square h-full rounded-lg"
								alt="user avatar"
							/>
						{/if}
						<span class="m-1 hidden sm:inline">{data.user.login}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6 transition-transform"
							class:rotate-180={showDropdown}
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 8.25l-7.5 7.5-7.5-7.5"
							/>
						</svg>
					</button>
				</div>
			{:else}
				<a
					href={!data.user ? '/login' : '/logout'}
					class="ml-auto box-border flex h-full items-center justify-center gap-2 rounded-xl p-1 text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
				>
					<span class="m-1 hidden sm:inline">{data.user || 'Login'}</span>
				</a>
			{/if}
		</div>
		{#if showDropdown}
			<div transition:slide={{ duration: 150 }} class="flex h-full justify-evenly">
				<a
					href="/profile"
					class="box-border items-center justify-center rounded-xl p-2 text-center text-2xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
					>Profile</a
				>
				<a
					href="/logout"
					class="box-border items-center justify-center rounded-xl p-2 text-center text-2xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
					>Log out</a
				>
			</div>
		{/if}
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
