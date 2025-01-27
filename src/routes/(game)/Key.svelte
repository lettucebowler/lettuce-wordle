<script lang="ts">
	import type { LetterStatus } from '$lib/schemas/game';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type KeyProps = {
		status?: LetterStatus;
		children?: Snippet;
	} & HTMLButtonAttributes;

	const { status, children, ...rest }: KeyProps = $props();
</script>

<button
	data-status={status}
	{...rest}
	class={[
		'col-span-4 mt-(--keyboard-height) grid h-full w-full cursor-pointer place-items-center rounded-md bg-(--bg-color) text-center text-sm font-bold text-(--text-color)  active:shadow-none sm:py-2 md:text-xl',
		status && 'bg-(--bg-color) text-(--text-color)',
		['x', 'c', undefined].includes(status) &&
			'shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] active:mt-0'
	]}
>
	{@render children?.()}
</button>

<style>
	[data-status='x'] {
		--bg-color: var(--color-swamp-green-500);
		--text-color: var(--color-swamp-green-900);
		--highlight-color: var(--color-swamp-green-200);
	}

	[data-status='c'] {
		--bg-color: var(--color-putty-500);
		--text-color: var(--color-putty-900);
		--highlight-color: var(--color-putty-200);
	}

	[data-status='i'] {
		--bg-color: var(--color-charade-800);
		--text-color: var(--color-charade-300);
	}

	button {
		--highlight-color: var(--color-charade-400);
		--bg-color: var(--charade-600);
		--text-color: var(--color-charade-100);
	}
</style>
