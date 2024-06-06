<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';
	import NavLink from './NavLink.svelte';

	import type { NavLinkProps } from '$lib/types';
	import type { User } from '@auth/sveltekit';

	let { user, links }: { user: User | undefined; links: NavLinkProps[] } = $props();

	let dropdownVisible = $state(false);

	function getSubnavItems() {
		return [
			{
				path: user ? `/profile/${user.login}` : '/profile',
				name: 'Profile',
				prefetch: true
			}
		];
	}
	let subnavItems = $state(getSubnavItems());

	$effect(() => {
		subnavItems = getSubnavItems();
	});

	afterNavigate(() => {
		if (dropdownVisible) dropdownVisible = false;
	});
</script>

<div class="mb-1 min-h-[66px] w-full">
	<div id="big-papa-nav" class="flex justify-end">
		<nav
			class="h-18 z-10 ml-0 ml-auto box-content max-h-[72px] w-full justify-end gap-x-4 rounded-2xl border-t-[2px] border-t-charade-500 bg-charade-700 p-1 shadow-[0_2px_4px_0_rgb(0_0_0_/_0.2)]"
			id="primary-nav"
		>
			<div class="flex">
				<div class="hidden gap-4 sm:flex">
					{#each links.filter((link) => link.enabled) as link}
						<NavLink {link} />
					{/each}
				</div>
				<div class="ml-auto h-14">
					<div class="flex h-full flex-col sm:hidden">
						<label
							for="subnav-toggle-small"
							class="box-border flex h-full flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-xl text-center text-3xl text-snow-100 transition ease-in-out hover:bg-charade-800 active:bg-charade-900 sm:hidden"
						>
							<span
								class="box-border aspect-square h-full overflow-hidden rounded-xl border-snow-300 transition-transform"
								class:rotate-180={dropdownVisible}
							>
								{#if user}
									<LettuceAvatar name={user.login} />
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="aspect-square h-full w-full"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
										/>
									</svg>
								{/if}
							</span>
						</label>
					</div>
					<label
						for="subnav-toggle-big"
						class="box-border hidden h-full flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-xl text-center text-3xl text-snow-100 transition ease-in-out sm:flex"
					>
						{#if user}
							<span
								class="box-border aspect-square h-14 overflow-hidden rounded-xl border-snow-300 transition-transform"
								class:rotate-180={dropdownVisible}
							>
								<LettuceAvatar name={user.login} />
							</span>
						{:else}
							<AuthForm mode="login" />
						{/if}
					</label>
				</div>
			</div>
			<div id="mobile-nav" class="sm:hidden">
				<input
					type="checkbox"
					class="peer hidden"
					name="subnav"
					id="subnav-toggle-small"
					bind:checked={dropdownVisible}
				/>
				<nav
					id="subnav-content"
					class="absolute bottom-0 left-0 right-0 top-[72px] z-10 hidden flex-col divide-y bg-charade-900 peer-checked:block"
					class:hidden={!dropdownVisible}
				>
					<div class="space-y-4 p-4">
						{#each links.filter((link) => link.enabled) as link}
							<NavLink {link} enableTransition={false} />
						{/each}
					</div>
					<div class="flex flex-col gap-2 border-charade-800 p-4">
						{#if user?.login}
							<div class="mb-2 flex items-center justify-start gap-4">
								<span class="box-border h-11 h-[44px] w-[44px] w-max overflow-hidden rounded"
									><LettuceAvatar name={user.login} /></span
								>
								<span class="text-xl font-medium text-snow-300">{user.login}</span>
							</div>
							{#each subnavItems as subnavItem}
								<a
									href={subnavItem.path}
									class="cursor-pointer p-0 text-2xl font-medium text-snow-300 hover:underline"
									>{subnavItem.name}</a
								>
							{/each}
						{/if}
						<AuthForm mode={user?.login ? 'logout' : 'login'}
							><button class="text-2xl font-medium text-snow-300 hover:underline"
								>{user?.login ? 'Logout' : 'Login'}</button
							>
						</AuthForm>
					</div>
				</nav>
			</div>
		</nav>
	</div>
	<div id="desktop-nav" class="hidden sm:block">
		<input
			type="checkbox"
			class="peer hidden"
			name="subnav"
			id="subnav-toggle-big"
			bind:checked={dropdownVisible}
		/>
		<div
			class="-mt-4 ml-auto mr-6 grid w-max grid-rows-[0fr] shadow-[0_1px_4px_0_rgb(0_0_0_/_0.2)] transition transition-all peer-checked:grid-rows-[1fr]"
		>
			<nav id="subnav-content" class="overflow-hidden">
				<div
					class="z-0 mx-auto flex justify-evenly gap-4 rounded-b-xl bg-charade-800 p-1 pt-4 font-medium"
				>
					{#each subnavItems as subnavItem}
						<a
							href={subnavItem.path}
							class="flex cursor-pointer rounded-lg border-transparent p-0 text-lg font-medium text-snow-100 hover:underline"
							><span class="grid h-full w-full place-items-center px-6 py-2 text-center"
								>{subnavItem.name}</span
							></a
						>
					{/each}
					<AuthForm mode="logout" />
				</div>
			</nav>
		</div>
	</div>
</div>
