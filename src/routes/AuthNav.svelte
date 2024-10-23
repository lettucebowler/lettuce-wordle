<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';
	import NavLink from './NavLink.svelte';
	import { navigationSend, navigationRecieve } from './transitions';

	import type { NavLinkProps } from '$lib/types';
	import type { User } from '@auth/sveltekit';
	import { page } from '$app/stores';

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

	let current = $derived(user ? $page.url.pathname === '/profile/' + user.login : false);

	afterNavigate(() => {
		if (dropdownVisible) dropdownVisible = false;
	});
</script>

<div class="w-full">
	<div id="big-papa-nav" class="flex justify-end">
		<nav
			class="h-18 z-10 ml-0 ml-auto box-content max-h-[72px] w-full justify-end gap-x-4 border-t-charade-500"
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
							</span>
						</label>
					</div>
					<div class="hidden h-full sm:block">
						{#if user}
							<div class="grid h-14 w-14">
								<div class="col-[1] row-[1] h-14">
									{#if current}
										<div
											in:navigationRecieve={{ key: 'current-link' }}
											out:navigationSend={{ key: 'current-link' }}
											class="grid h-14 rounded-2xl bg-charade-800"
										></div>
									{/if}
								</div>
								<a
									class="z-10 col-[1] row-[1] m-1 box-border grid aspect-square overflow-hidden rounded-xl border-snow-300 transition transition-all duration-150 hover:m-0"
									href="/profile/{user.login}"
								>
									<LettuceAvatar name={user.login} />
								</a>
							</div>
						{:else}
							<AuthForm mode="login" />
						{/if}
					</div>
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
								<span class="box-border h-[44px] w-[44px] w-max overflow-hidden rounded"
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
</div>
