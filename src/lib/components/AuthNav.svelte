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
	import type { UserProfile } from '$lib/types/auth';

	export let user: UserProfile | null | undefined;
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
		class="box-border flex justify-between gap-x-1 rounded-2xl bg-charade-600 p-1"
		id="primary-nav"
	>
		{#each links.filter((link) => link.enabled) as link}
			<a
				class="flex h-14 flex-[1_0_auto] cursor-pointer overflow-hidden rounded-xl border-transparent p-0 text-3xl font-medium text-snow-300 hover:bg-charade-700 active:bg-charade-800"
				class:ml-auto={link.margin === 'left'}
				class:backdrop-brightness-90={link.path === $page.url.pathname}
				href={link.path}
				data-sveltekit-preload-data={link.prefetch ? 'hover' : null}
				><span class="grid h-full w-full place-items-center p-2 text-center duration-150">
					<span class="flex items-center gap-2">
						{#if link.icon}
							<span><Icon src={link.icon} theme="solid" class="h-10" /></span>
						{/if}
						<span class:hidden={link.icon} class:sm:inline={link.icon}>{link.name}</span>
					</span>
				</span></a
			>
		{/each}
		{#if user}
			<label
				for="subnav"
				class="ml-auto box-border flex h-14 flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-1 rounded-xl p-2 text-center text-3xl text-snow-300 transition ease-in-out hover:bg-charade-700 active:bg-charade-800"
			>
				{#if user.image}
					<img
						src={white}
						srcset={user.image}
						class="box-border aspect-square h-full rounded object-contain"
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
			class="mt-2 ml-4 mr-4 flex justify-evenly rounded-xl bg-charade-700 p-1 font-medium transition transition-all duration-150"
			class:hidden={!dropdownVisible && !jsEnabled}
		>
			{#each subnavItems as subnavItem}
				<a
					href={subnavItem.path}
					data-sveltekit-preload-data={subnavItem.prefetch ? 'hover' : null}
					class="flex cursor-pointer overflow-hidden rounded-xl border-transparent p-0 text-lg font-medium text-snow-300 hover:bg-charade-800 active:bg-charade-900"
					><span class="grid h-full w-full place-items-center p-2 text-center"
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
