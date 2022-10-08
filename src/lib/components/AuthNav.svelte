<script lang="ts">
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';

	import white from '$lib/assets/white.png';
	import { onMount } from 'svelte';

	export let user: {
		login?: string;
		avatar?: string;
	} = {};
	export let links: {
		path: string;
		name: string;
		margin?: string;
		enabled: string;
	}[] = [];

	let showDropdown = false;
	let avatarHref = white;

	onMount(() => {
		console.log('mount');
		if (user?.avatar) {
			avatarHref = user.avatar;
			console.log('bleh');
		}
	});

	const toggleDropDown = () => {
		showDropdown = !showDropdown;
	};
</script>

<nav class="box-border flex h-14 justify-between gap-1 rounded-b-2xl bg-polar-400 p-1">
	{#each links.filter((link) => link.enabled) as link}
		<a
			data-sveltekit-prefetch
			href={link.path}
			class="box-border flex h-12 items-center justify-center rounded-xl pr-2 pl-2 text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
			class:ml-auto={link.margin === 'left'}
			class:bg-polar-200={$page.url.pathname === link.path}
		>
			{link.name}
		</a>
	{/each}
	{#if user}
		<button
			on:click={toggleDropDown}
			class="ml-auto box-border flex h-full items-center justify-center gap-1 rounded-xl p-1 text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
		>
			{#if user.avatar}
				<img
					src={avatarHref}
					class="max-x-full box-border flex aspect-square h-full rounded-lg object-contain"
					alt="user avatar"
				/>
			{/if}
			<span class="m-1 hidden sm:inline">{user.login}</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6 transition-transform"
				class:rotate-180={showDropdown}
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
			</svg>
		</button>
	{/if}
</nav>
{#if showDropdown}
	<nav
		transition:slide={{ duration: 150 }}
		class="ml-4 mr-4 flex justify-evenly rounded-xl bg-polar-300 p-1"
	>
		<a
			href="/profile"
			class="box-border items-center justify-center rounded-xl p-1 pr-2 pl-2 text-center text-lg font-medium text-snow-300 transition duration-150 ease-in-out hover:bg-polar-200 active:bg-polar-100"
			>Profile</a
		>
		<a
			href="/logout"
			class="box-border items-center justify-center rounded-xl p-1 pr-2 pl-2 text-center text-lg font-medium text-snow-300 transition duration-150 ease-in-out hover:bg-polar-200 active:bg-polar-100"
			>Log out</a
		>
	</nav>
{/if}
