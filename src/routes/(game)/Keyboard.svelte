<script lang="ts">
	import { enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';
	import LettuceIcon from '$lib/components/Icon.svelte';

	export let answers: { [x: string]: string } = {};

	const dispatch = createEventDispatcher();

	let keys: {
		[x: string]: HTMLButtonElement;
	} = {};

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
</script>

<svelte:window on:keydown={(e) => keys[e.key.toLowerCase()]?.click()} />

<form
	method="POST"
	class="grid h-full flex-auto grid-rows-3 gap-1"
	id="keyboard"
	use:enhance={({ cancel, formData }) => {
		const key = formData.get('key');
		dispatch('key', key);
		cancel();
	}}
>
	{#each ['q,w,e,r,t,y,u,i,o,p', ',a,s,d,f,g,h,j,k,l', ',,,z,x,c,v,b,n,m,enter,backspace'] as row}
		<div class="flex w-full flex-auto flex-col justify-center">
			<div class="grid flex-auto grid-cols-[repeat(40,_0.25fr)] gap-1">
				{#each row.split(',') as letter}
					{@const status = answers[letter] || '_'}
					{#if letter}
						<button
							aria-label={letter}
							title={letter}
							formaction="?/{letter === 'enter' ? 'enter' : 'keyboard'}"
							form={letter === 'enter' ? 'game' : undefined}
							name="key"
							value={letter}
							bind:this={keys[letter]}
							data-answer={status}
							class="col-span-4 mt-[--keyboard-height] box-content grid h-full w-full cursor-pointer place-items-center rounded-md bg-[--bg-color] text-center text-sm font-bold text-[--text-color] shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] active:mt-0 active:shadow-none xl:text-base"
						>
							{#if icons.get(letter)}
								<span class="h-5"><LettuceIcon {...icons.get(letter)} /></span>
							{:else}
								{letter.toUpperCase()}
							{/if}
						</button>
					{:else}
						<div></div>
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</form>

<style>
	[data-answer='c'] {
		--bg-color: theme('colors.putty.500');
		--highlight-color: theme('colors.putty.200');
		--text-color: theme('colors.putty.900');
	}

	[data-answer='x'] {
		--bg-color: theme('colors.swamp-green.500');
		--highlight-color: theme('colors.swamp-green.200');
		--text-color: theme('colors.swamp-green.900');
	}

	[data-answer='_'] {
		--bg-color: theme('colors.charade.800');
		--highlight-color: theme('colors.charade.600');
	}

	button {
		--keyboard-height: var(--height, 2px);
		--bg-color: theme('colors.charade.700');
		--highlight-color: theme('colors.charade.500');
		--text-color: theme('colors.charade.100');
	}
</style>
