<script lang="ts">
	import { page } from '$app/stores';
	import type { NavLinkProps } from '$lib/types/navigation';
	import { navigationSend, navigationRecieve } from './transitions';
	export let link: NavLinkProps;
	export let enableTransition = true;

	$: current = $page.url.pathname === link.path;
</script>

<a
	class="grid cursor-pointer items-center rounded-xl border-transparent text-3xl font-medium text-snow-300 hover:underline sm:h-14"
	class:ml-auto={link.margin === 'left'}
	class:text-snow-100={current}
	class:after:bg-charade-800={current}
	aria-current={current}
	href={link.path}
>
	{#if enableTransition}
		<div class="col-[1] row-[1] grid hidden w-full sm:block sm:h-14">
			{#if current}
				<div
					in:navigationRecieve={{ key: 'current-link' }}
					out:navigationSend={{ key: 'current-link' }}
					class="grid h-full rounded-xl"
					class:bg-charade-800={current}
				/>
			{/if}
		</div>
	{/if}
	<span class="z-10 col-[1] row-[1] my-auto grid items-center sm:h-14 sm:px-6 sm:py-2"
		>{link.name}</span
	>
</a>
