<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import LettuceIcon from '$lib/components/Icon.svelte';

	import white from '$lib/assets/white.png';
	import type { UserProfile } from '$lib/types/auth';
	import AuthForm from './AuthForm.svelte';

	export let user: UserProfile | null | undefined;
	export let links: {
		path: string;
		name: string;
		margin?: string;
		prefetch?: boolean;
		enabled: boolean;
		icon?: string;
	}[] = [];
	export let csrf = '';

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
		}
	];

	onMount(() => {
		jsEnabled = true;
		dropdownVisible = false;
	});

	afterNavigate(() => {
		if (dropdownVisible) dropdownVisible = false;
	});
</script>

<div>
	<div id="big-papa-nav" class="flex justify-end">
		<nav
			class="ml-auto box-border flex justify-end gap-x-1 rounded-2xl sm:ml-0 sm:w-full sm:bg-charade-600 sm:p-1"
			id="primary-nav"
		>
			<div class="hidden gap-1 sm:flex">
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
									<!-- <span><Icon src={link.icon} theme="solid" class="h-10" /></span> -->
									<span class="mr-auto h-10 text-snow-300"><LettuceIcon icon={link.icon} /></span>
								{/if}
								<span class:hidden={link.icon} class:sm:inline={link.icon}>{link.name}</span>
							</span>
						</span></a
					>
				{/each}
			</div>
			{#if user}
				<label
					for="subnav"
					class="box-border flex h-12 flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-1 rounded-xl text-center text-3xl text-snow-300 transition ease-in-out sm:ml-auto sm:h-14 sm:p-2 sm:hover:bg-charade-700 sm:active:bg-charade-800"
				>
					<span class="h-8">
						<LettuceIcon flip={dropdownVisible} icon="chevron-down" />
					</span>

					{#if user.image}
						<img
							src={white}
							srcset={user.image}
							class="box-border aspect-square h-full rounded object-contain"
							alt=""
						/>
					{/if}
				</label>
			{:else}
				<AuthForm {csrf} mode="login" />
			{/if}
		</nav>
	</div>

	<input type="checkbox" class="hidden" name="subnav" id="subnav" bind:checked={dropdownVisible} />
	{#if showDropdown}
		<nav
			transition:slide={{ duration: 150 }}
			id="subnav-content"
			class="absolute z-40 mr-4 box-border flex hidden h-0 w-full justify-evenly rounded-xl bg-charade-900 font-medium sm:static sm:z-0 sm:mt-2 sm:ml-4 sm:h-auto sm:w-auto sm:bg-charade-700 sm:p-1 sm:transition sm:transition-all sm:duration-150"
			class:hidden={!dropdownVisible && !jsEnabled}
		>
			<div
				class="box-border h-screen w-full divide-y bg-charade-900 px-3 py-4 sm:h-max sm:divide-y-0 sm:bg-charade-700 sm:p-0"
			>
				<div class="flex flex-col items-end gap-4 border-charade-600 pb-4 sm:hidden sm:p-0">
					{#each links.filter((link) => link.enabled) as link}
						<a
							class="ml-auto w-max cursor-pointer rounded-xl border-transparent p-0 text-right text-right text-3xl font-medium text-snow-300"
							class:ml-auto={link.margin === 'left'}
							href={link.path}
							data-sveltekit-preload-data={link.prefetch ? 'hover' : null}>{link.name}</a
						>
					{/each}
				</div>
				<div class="flex justify-center gap-2 border-charade-600 py-4 sm:p-0">
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
					<AuthForm mode="logout" {csrf} />
				</div>
			</div>
		</nav>
	{/if}
</div>

<style>
	input[type='checkbox'][name^='subnav']:checked ~ nav {
		display: flex;
	}
</style>
