<script lang="ts">
	import LettuceIcon from '$lib/components/Icon.svelte';

	export let key: string;
	export let status = 'none';
	export let form = 'keyboard';
	export let action = 'keyboard';
	export let button: HTMLButtonElement;

	const icons = new Map([
		[
			'enter',
			{
				icon: 'arrow-uturn-right',
				flip: true
			}
		],
		[
			'backspace',
			{
				icon: 'backspace',
				flip: false
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
	class="grid h-full w-full cursor-pointer place-items-center rounded-md border-solid border-transparent text-center text-sm font-bold text-snow-300 shadow hover:brightness-[90%] active:brightness-[75%] xl:text-base"
	class:bg-charade-600={status === '_'}
	class:bg-aurora-300={status === 'c'}
	class:bg-aurora-400={status === 'x'}
	class:bg-charade-700={status === 'i'}
>
	{#if icon}
		<span class="h-5"><LettuceIcon {...icon} /></span>
	{:else}
		{key.toUpperCase()}
	{/if}
</button>
