<script lang="ts">
	import { enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';
	import LettuceKey from '$lib/components/LettuceKey.svelte';

	export let answers: { [x: string]: string } = {};

	const dispatch = createEventDispatcher();
</script>

<svelte:window
	on:keydown={(event) => {
		// @ts-ignore
		document.querySelector(`[data-key="${event.key.toLowerCase()}"]`)?.click();
	}}
/>

<form
	method="POST"
	class="h-full"
	id="keyboard"
	use:enhance={({ action, cancel }) => {
		const url = new URL(action);
		if (url.searchParams.has('/keyboard')) {
			dispatch('key', url.searchParams.get('key'));
			cancel();
		}
	}}
>
	<div class="flex h-full w-full flex-col justify-end gap-1">
		{#each ['q,w,e,r,t,y,u,i,o,p', ',a,s,d,f,g,h,j,k,l', ',,,z,x,c,v,b,n,m'] as row, i}
			<div class="flex w-full flex-auto flex-col justify-center">
				<div class="grid flex-auto grid-cols-[repeat(40,_0.25fr)] gap-1">
					{#each row.split(',') as letter}
						{#if letter}
							<div class="col-span-4 grid place-items-center">
								<LettuceKey key={letter} status={answers[letter] || '_'} />
							</div>
						{:else}
							<div />
						{/if}
					{/each}
					{#if i == 2}
						<div class="col-span-4 grid place-items-center">
							<LettuceKey key="enter" status="_" form="game" action="enter" />
						</div>
						<div class="col-span-4 grid place-items-center">
							<LettuceKey key="backspace" status="_" />
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</form>
