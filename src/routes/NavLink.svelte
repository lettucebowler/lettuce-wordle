<script lang="ts">
	import { page } from '$app/stores';
	import type { NavLinkProps } from '$lib/types';
	import { navigationSend, navigationRecieve } from './transitions';

	let { link, enableTransition = true }: { enableTransition?: boolean; link: NavLinkProps } =
		$props();

	let current = $state($page.url.pathname === link.path);

	$effect(() => {
		current = $page.url.pathname === link.path;
	});
</script>

<a
	class="grid h-full cursor-pointer items-center rounded-xl border-transparent text-3xl font-medium text-snow-300 hover:underline"
	class:ml-auto={link.margin === 'left'}
	class:text-snow-100={current}
	class:after:bg-charade-800={current}
	aria-current={current}
	href={link.path}
>
	<div class="col-[1] row-[1] box-border grid hidden h-14 h-full w-full sm:block">
		{#if enableTransition}
			{#if current}
				<div
					in:navigationRecieve={{ key: 'current-link' }}
					out:navigationSend={{ key: 'current-link' }}
					class="grid h-full rounded-xl"
					class:bg-charade-800={current}
				></div>
			{/if}
		{:else if current}
			<div class="grid h-full rounded-xl" class:bg-charade-800={current}></div>
		{/if}
	</div>
	<span class="z-10 col-[1] row-[1] my-auto grid items-center sm:h-14 sm:px-4 sm:py-2"
		>{link.name}</span
	>
</a>
