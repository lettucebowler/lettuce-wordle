<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowUturnRight, Backspace } from '@steeze-ui/heroicons';
	import type { IconSource } from '@steeze-ui/svelte-icon/types';

	export let key: string;
	export let status = 'none';
	export let form = 'keyboard';
	export let action = 'keyboard';
	export let button: HTMLButtonElement;

	const icons: Map<string, { src: IconSource; theme: string; class: string }> = new Map([
		[
			'enter',
			{
				src: ArrowUturnRight,
				theme: 'mini',
				class: 'h-5 w-5 rotate-180'
			}
		],
		[
			'backspace',
			{
				src: Backspace,
				theme: 'mini',
				class: 'h-5 w-5'
			}
		]
	]);

	$: icon = icons.get(key);
</script>

<button
	aria-label={key}
	title={key}
	formaction={`?/${action}&key=${key}`}
	{form}
	bind:this={button}
	class="grid h-full w-full cursor-pointer place-items-center rounded-md border-solid border-transparent text-center text-sm font-bold text-snow-300 hover:brightness-[90%] active:brightness-[75%] xl:text-base"
	class:bg-charade-500={status === '_'}
	class:bg-aurora-300={status === 'c'}
	class:bg-aurora-400={status === 'x'}
	class:bg-charade-700={status === 'i'}
>
	{#if icon}
		<Icon {...icon} />
	{:else}
		{key.toUpperCase()}
	{/if}
</button>
