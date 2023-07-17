<script lang="ts">
	import { page } from '$app/stores';
	import type { NavLinkProps } from '$lib/types/navigation';
	import { navigationSend, navigationRecieve } from './transitions';
	export let link: NavLinkProps;

	$: current = $page.url.pathname === link.path;
</script>

<a
	class="grid h-14 cursor-pointer items-center rounded-xl border-transparent text-3xl font-medium text-snow-300 hover:underline"
	class:ml-auto={link.margin === 'left'}
	class:text-snow-100={current}
	class:after:bg-charade-700={current}
	aria-current={current}
	href={link.path}
>
	{#if current}
		<div
			in:navigationRecieve={{ key: 'current-link' }}
			out:navigationSend={{ key: 'current-link' }}
			class="col-[1] row-[1] grid h-14 w-full rounded-xl"
			class:bg-charade-700={current}
		/>
	{/if}
	<span class="z-10 col-[1] row-[1] my-auto grid h-14 items-center px-6 py-2">{link.name}</span>
</a>
