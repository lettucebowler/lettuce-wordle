<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ChevronDown } from '@steeze-ui/heroicons';
	import type { IconSource } from '@steeze-ui/svelte-icon/types';

	import white from '$lib/assets/white.png';

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
		icon?: IconSource;
	}[] = [];

	let showDropdown = true;

	let dropdownVisible = false;

	let jsEnabled = false;

	$: {
		if (browser) {
			showDropdown = dropdownVisible;
		}
	}

	$: subnavItems = [
		{
			path: user ? `/profile/${user.login}` : '/profile',
			name: 'Profile',
			prefetch: true
		},
		{
			path: '/logout',
			name: 'Logout',
			prefetch: false
		}
	];

	let timeout = setTimeout(() => null);

	const eventuallyCloseDropdown = () => {
		timeout = setTimeout(() => {
			dropdownVisible = false;
		}, 2500);
	};

	onMount(() => {
		jsEnabled = true;
		dropdownVisible = false;
	});

	beforeNavigate(() => {
		if (timeout) {
			clearTimeout(timeout);
		}
	});

	afterNavigate(() => {
		if (dropdownVisible) eventuallyCloseDropdown();
	});
</script>

<div id="big-papa-nav">
	<nav
		class="box-border flex justify-between gap-x-1 rounded-2xl bg-polar-400 p-1"
		id="primary-nav"
	>
		{#each links.filter((link) => link.enabled) as link}
			<a
				class="flex h-14 flex-[1_0_auto] cursor-pointer overflow-hidden rounded-xl border-transparent p-0 text-3xl font-medium text-snow-300 active:backdrop-brightness-90"
				class:ml-auto={link.margin === 'left'}
				class:backdrop-brightness-90={link.path === $page.url.pathname}
				href={link.path}
				data-sveltekit-preload-data={link.prefetch ? 'hover' : null}
				><span
					class="grid h-full w-full place-items-center p-2 text-center duration-150 hover:backdrop-brightness-90 hover:backdrop-filter"
				>
					<span class="flex items-center gap-2">
						{#if link.icon}
							<span><Icon src={link.icon} theme="solid" class="h-10" /></span>
						{/if}
						<span class:hidden={link.icon} class:sm:inline={link.icon}>{link.name}</span>
					</span>
				</span></a
			>
		{/each}
		{#if user.login}
			<label
				for="subnav"
				class="ml-auto box-border flex h-14 flex-[0_0_auto] select-none items-center justify-center gap-1 rounded-xl p-2 text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
			>
				{#if user.avatar}
					<img
						src={white}
						srcset={user.avatar}
						class="box-border aspect-square h-full rounded-lg object-contain"
						alt=""
					/>
				{/if}
				<span class="m-1 hidden md:inline">{user.login}</span>
				<Icon
					src={ChevronDown}
					theme="solid"
					class={`h-6 w-6 transition-transform ${dropdownVisible ? 'rotate-180' : ''}`}
				/>
			</label>
		{/if}
	</nav>
	<input type="checkbox" class="hidden" name="subnav" id="subnav" bind:checked={dropdownVisible} />
	{#if showDropdown}
		<nav
			transition:slide={{ duration: 150 }}
			id="subnav-content"
			class="mt-2 ml-4 mr-4 flex justify-evenly rounded-xl bg-polar-300 p-1 font-medium transition transition-all duration-150"
			class:hidden={!dropdownVisible && !jsEnabled}
		>
			{#each subnavItems as subnavItem}
				<a
					href={subnavItem.path}
					data-sveltekit-preload-data={subnavItem.prefetch ? 'hover' : null}
					class="flex cursor-pointer overflow-hidden rounded-xl border-transparent p-0 text-lg font-medium text-snow-300 active:backdrop-brightness-90"
					><span
						class="grid h-full w-full place-items-center p-2 text-center duration-150 hover:backdrop-brightness-90 hover:backdrop-filter"
						>{subnavItem.name}</span
					></a
				>
			{/each}
		</nav>
	{/if}
</div>

<style>
	input[type='checkbox'][name^='subnav']:checked ~ nav {
		display: flex;
	}
</style>
