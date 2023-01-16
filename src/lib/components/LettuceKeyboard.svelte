<script lang="ts">
	import { enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';
	import LettuceKey from '$lib/components/LettuceKey.svelte';

	export let answers: { [x: string]: string } = {};

	const dispatch = createEventDispatcher();

	let keys: {
		[x: string]: HTMLButtonElement;
	} = {};

	const clickKey = (event: KeyboardEvent) => {
		const key = event.key.toLowerCase();
		keys[key]?.click();
	};
</script>

<svelte:window on:keydown={clickKey} />

<form
	method="POST"
	class="grid h-full grid-rows-3 gap-1"
	id="keyboard"
	use:enhance={({ action, cancel }) => {
		const url = new URL(action);
		if (url.searchParams.has('/keyboard')) {
			dispatch('key', url.searchParams.get('key'));
			cancel();
		}
	}}
>
	{#each ['q,w,e,r,t,y,u,i,o,p', ',a,s,d,f,g,h,j,k,l', ',,,z,x,c,v,b,n,m,enter,backspace'] as row, i}
		<div class="flex w-full flex-auto flex-col justify-center">
			<div class="grid flex-auto grid-cols-[repeat(40,_0.25fr)] gap-1">
				{#each row.split(',') as letter}
					{@const attributes = {
						key: letter,
						status: answers[letter] || '_',
						form: letter === 'enter' ? 'game' : undefined,
						action: letter === 'enter' ? 'enter' : 'keyboard'
					}}
					{#if letter}
						<div class="col-span-4 grid place-items-center">
							<LettuceKey {...attributes} bind:button={keys[letter]} />
						</div>
					{:else}
						<div />
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</form>
