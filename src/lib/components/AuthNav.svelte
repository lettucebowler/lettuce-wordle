<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { slide } from 'svelte/transition';

	import white from '$lib/assets/white.png';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	export let user: {
		login?: string;
		avatar?: string;
	} = {};
	export let links: {
		path: string;
		name: string;
		margin?: string;
		prefetch?: boolean;
		enabled: boolean;
		type?: string;
	}[] = [];

	let showDropdown = true;

	let dropdownVisible = false;

	let jsEnabled = false;

	$: {
		if (browser) {
			showDropdown = dropdownVisible;
		}
	}

	const eventuallyCloseDropdown = () => {
		setTimeout(() => {
			dropdownVisible = false;
		}, 1500);
	};

	onMount(() => {
		jsEnabled = true;
		eventuallyCloseDropdown();
	});

	afterNavigate(() => {
		eventuallyCloseDropdown();
	});
</script>

<div>
	<nav
		class="box-border flex flex-wrap justify-between gap-x-1 rounded-b-2xl bg-polar-400 p-1"
		id="primary-nav"
	>
		{#each links.filter((link) => link.enabled) as link}
			<a
				class="flex h-12 cursor-pointer overflow-hidden rounded-xl border-transparent bg-polar-400 p-0 text-3xl font-medium text-snow-300 active:brightness-90"
				class:ml-auto={link.margin === 'left'}
				class:brightness-90={link.path === $page.url.pathname}
				href={link.path}
				data-sveltekit-prefetch={link.prefetch ? '' : null}
				><span
					class="grid h-full w-full place-items-center pr-2 pl-2 text-center duration-500 hover:backdrop-brightness-90 hover:backdrop-filter"
				>
					{link.name}
				</span></a
			>
		{/each}
		{#if user.login}
			<input
				type="checkbox"
				class="hidden"
				name="subnav"
				id="subnav"
				bind:checked={dropdownVisible}
			/>
			<label
				for="subnav"
				class="ml-auto box-border flex h-12 select-none items-center justify-center gap-1 rounded-xl p-1 text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
			>
				{#if user.avatar}
					<img
						src={user.avatar || white}
						class="max-x-full box-border flex aspect-square h-full rounded-lg object-contain"
						alt="user avatar"
					/>
				{/if}
				<span class="m-1 hidden md:inline">{user.login}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
					class:transition-transform={jsEnabled}
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
				</svg>
			</label>
		{/if}
		{#if showDropdown}
			<nav
				transition:slide={{ duration: 150 }}
				id="subnav-content"
				class="mt-1 flex w-full justify-evenly rounded-xl bg-polar-300 p-1 transition transition-all duration-150"
				class:hidden={!dropdownVisible && !jsEnabled}
			>
				<a
					href={user?.login ? `/profile/${user.login}` : '/profile'}
					data-sveltekit-prefetch
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
	</nav>
</div>

<style>
	input[type='checkbox'][name^='subnav']:checked ~ nav {
		display: flex;
	}

	input[type='checkbox'][name^='subnav']:checked ~ label svg {
		--tw-rotate: 180deg;
		transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
			skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
			scaleY(var(--tw-scale-y));
	}
</style>
