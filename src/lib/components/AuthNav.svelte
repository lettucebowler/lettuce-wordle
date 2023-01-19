<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { slide, fly } from 'svelte/transition';
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
			class="h-18 ml-auto ml-0 box-border max-h-[72px] w-full justify-end gap-x-4 rounded-2xl bg-charade-600 p-1"
			id="primary-nav"
		>
			<div class="flex">
				<div class="hidden gap-4 sm:flex">
					{#each links.filter((link) => link.enabled) as link}
						<a
							class="flex h-14 cursor-pointer overflow-hidden rounded-xl border-transparent py-2 px-6 text-3xl font-medium text-snow-300 hover:bg-charade-700 active:bg-charade-800"
							class:ml-auto={link.margin === 'left'}
							class:bg-charade-700={link.path === $page.url.pathname}
							class:text-snow-100={link.path !== $page.url.pathname}
							href={link.path}
							data-sveltekit-preload-data={link.prefetch ? 'hover' : null}
						>
							{link.name}</a
						>
					{/each}
				</div>
				{#if user}
					<label
						for="subnav"
						class="ml-auto box-border flex h-14 flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-xl text-center text-3xl text-snow-100 transition ease-in-out hover:bg-charade-700 active:bg-charade-800"
					>
						<span class="hidden h-8 pl-2 sm:inline">
							<LettuceIcon icon="chevron-down" flip={dropdownVisible} />
						</span>
						<span class="h-8 px-3 sm:hidden">
							<LettuceIcon icon="menu" flip={dropdownVisible} />
						</span>
						{#if user.image}
							<img
								src={white}
								srcset={user.image}
								class="box-border hidden aspect-square h-full rounded-xl object-contain sm:block"
								alt=""
							/>
						{/if}
					</label>
				{:else}
					<AuthForm {csrf} mode="login" />
				{/if}
			</div>
			<div class="sm:hidden">
				<input
					type="checkbox"
					class="hidden"
					name="subnav"
					id="subnav"
					bind:checked={dropdownVisible}
				/>
				{#if showDropdown}
					<nav
						id="subnav-content"
						class="absolute top-[72px] right-0 left-0 bottom-0 z-10 flex-col divide-y bg-charade-900"
						class:hidden={!dropdownVisible && !jsEnabled}
					>
						<div class="space-y-4 p-4">
							{#each links.filter((link) => link.enabled) as link}
								<a
									class="block cursor-pointer border-charade-700 text-3xl font-medium text-snow-100 hover:text-snow-300"
									href={link.path}
									data-sveltekit-preload-data={link.prefetch ? 'hover' : null}
								>
									{link.name}</a
								>
							{/each}
						</div>
						<div class="flex flex-col justify-start gap-4 border-charade-700 p-4">
							{#if user && user.image && user.login}
								<div class="flex items-center justify-start gap-4">
									<img
										src={white}
										srcset={user.image}
										class="box-border aspect-square h-10 rounded object-contain sm:hidden"
										alt=""
									/>
									<span class="text-xl font-medium text-snow-300">{user.login}</span>
								</div>
							{/if}
							<div class="flex flex-col gap-2">
								{#each subnavItems as subnavItem}
									<a
										href={subnavItem.path}
										data-sveltekit-preload-data={subnavItem.prefetch ? 'hover' : null}
										class="cursor-pointer p-0 text-2xl font-medium text-snow-100 hover:text-snow-300"
										>{subnavItem.name}</a
									>
								{/each}
								<AuthForm mode="logout" {csrf} useBuiltinButton={false}
									><button class="text-2xl font-medium text-snow-100 hover:text-snow-300"
										>logout</button
									></AuthForm
								>
							</div>
						</div>
					</nav>
				{/if}
			</div>
		</nav>
	</div>
	<div class="hidden sm:block">
		<input
			type="checkbox"
			class="hidden"
			name="subnav"
			id="subnav"
			bind:checked={dropdownVisible}
		/>
		{#if showDropdown}
			<nav
				transition:slide|local={{ duration: 150 }}
				id="subnav-content"
				class="mx-4 mt-2 flex flex-row justify-center gap-4 rounded-xl bg-charade-700 p-1 font-medium transition transition-all duration-150"
				class:hidden={!dropdownVisible && !jsEnabled}
			>
				{#each subnavItems as subnavItem}
					<a
						href={subnavItem.path}
						data-sveltekit-preload-data={subnavItem.prefetch ? 'hover' : null}
						class="flex cursor-pointer overflow-hidden rounded-lg border-transparent p-0 text-lg font-medium text-snow-100 hover:bg-charade-800"
						><span class="grid h-full w-full place-items-center py-2 px-6 text-center"
							>{subnavItem.name}</span
						></a
					>
				{/each}
				<AuthForm mode="logout" {csrf} />
			</nav>
		{/if}
	</div>
</div>

<style>
	input[type='checkbox'][name^='subnav']:checked ~ nav {
		display: flex;
	}
</style>
