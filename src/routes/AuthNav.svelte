<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import type { UserProfile } from '$lib/types/auth';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';
	import NavLink from './NavLink.svelte';

	import type { NavLinkProps } from '$lib/types/navigation';

	export let user: UserProfile | null | undefined;
	export let links: NavLinkProps[] = [];

	let dropdownVisible = false;

	$: subnavItems = [
		{
			path: user ? `/profile/${user.login}` : '/profile',
			name: 'Profile',
			prefetch: true
		}
	];

	afterNavigate(() => {
		if (dropdownVisible) dropdownVisible = false;
	});
</script>

<div class="w-full">
	<div id="big-papa-nav" class="flex justify-end">
		<nav
			class="h-18 ml-0 ml-auto box-border max-h-[72px] w-full justify-end gap-x-4 rounded-2xl bg-charade-600 p-1 shadow"
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
							class="box-border flex h-full flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-xl text-center text-3xl text-snow-100 transition ease-in-out hover:bg-charade-700 active:bg-charade-800 sm:hidden"
						>
							<span
								class="box-border aspect-square h-full overflow-hidden rounded-xl border-snow-300 transition-transform"
								class:rotate-180={dropdownVisible}
							>
								{#if user}
									<LettuceAvatar name={user.login} size={56} />
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
						class="box-border hidden h-full flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-xl text-center text-3xl text-snow-100 transition ease-in-out hover:bg-charade-700 active:bg-charade-800 sm:flex"
					>
						{#if user}
							<span
								class="box-border aspect-square overflow-hidden rounded-xl border-snow-300 transition-transform"
								class:rotate-180={dropdownVisible}
							>
								<LettuceAvatar name={user.login} size={56} />
							</span>
						{:else}
							<AuthForm mode="login" />
						{/if}
					</label>
				</div>
			</div>
			<div class="sm:hidden">
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
							<NavLink {link} />
						{/each}
					</div>
					<div class="flex flex-col gap-2 border-charade-700 p-4">
						{#if user?.login}
							<div class="mb-2 flex items-center justify-start gap-4">
								<span class="box-border w-max overflow-hidden rounded"
									><LettuceAvatar name={user.login} size={44} /></span
								>
								<span class="text-xl font-medium text-snow-300">{user.login}</span>
							</div>
							{#each subnavItems as subnavItem}
								<a
									href={subnavItem.path}
									class="cursor-pointer p-0 text-2xl font-medium text-snow-300 hover:text-snow-300"
									>{subnavItem.name}</a
								>
							{/each}
						{/if}
						<AuthForm mode={user?.login ? 'logout' : 'login'}
							><button class="text-2xl font-medium text-snow-300 hover:text-snow-300"
								>{user?.login ? 'logout' : 'login'}</button
							>
						</AuthForm>
					</div>
				</nav>
			</div>
		</nav>
	</div>
	<div class="hidden sm:block">
		<input
			type="checkbox"
			class="peer hidden"
			name="subnav"
			id="subnav-toggle-big"
			bind:checked={dropdownVisible}
		/>
		<div class="grid grid-rows-[0fr] transition transition-all peer-checked:grid-rows-[1fr]">
			<nav id="subnav-content" class="overflow-hidden">
				<div class="mx-4 mt-2 flex justify-evenly gap-4 rounded-xl bg-charade-700 p-1 font-medium">
					{#each subnavItems as subnavItem}
						<a
							href={subnavItem.path}
							class="flex cursor-pointer rounded-lg border-transparent p-0 text-lg font-medium text-snow-100 hover:bg-charade-800"
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
