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
	import { cx } from 'classix';
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
							class={cx(
								'col-span-4 grid h-full w-full cursor-pointer place-items-center rounded-md border-t-2 border-solid border-transparent text-center text-sm font-bold text-snow-300 shadow-[0_2px_4px_0_rgb(0_0_0_/_0.2)] hover:brightness-[90%] active:brightness-[75%] xl:text-base',
								status === '_' && 'border-t-charade-500 bg-charade-700',
								status === 'c' && 'border-t-putty-300 bg-putty-500',
								status === 'x' && 'border-t-swamp-green-300 bg-swamp-green-500',
								// status === 'i' && 'border-t-contessa-300 bg-contessa-500'
								status === 'i' && 'border-t-charade-700 bg-charade-800 brightness-90'
							)}
							class:bg-charade-700={status === '_'}
							class:bg-aurora-300={status === 'c'}
							class:bg-aurora-400={status === 'x'}
							class:bg-charade-800={status === 'i'}
						>
							{#if icons.get(letter)}
								<span class="h-5"><LettuceIcon {...icons.get(letter)} /></span>
							{:else}
								{letter.toUpperCase()}
							{/if}
						</button>
					{:else}
						<div />
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</form>
