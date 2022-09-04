<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let key: string;
	export let status = 'none';

	const dispatch = createEventDispatcher();

	const typeKey = (key: string) => {
		dispatch(
			'letterTyped',
			{
				key
			},
			{
				cancelable: false
			}
		);
	};

	const icons: Map<string, string> = new Map([
		[
			'enter',
			'M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
		],
		[
			'delete',
			'M6.707 4.879A3 3 0 018.828 4H15a3 3 0 013 3v6a3 3 0 01-3 3H8.828a3 3 0 01-2.12-.879l-4.415-4.414a1 1 0 010-1.414l4.414-4.414zm4 2.414a1 1 0 00-1.414 1.414L10.586 10l-1.293 1.293a1 1 0 101.414 1.414L12 11.414l1.293 1.293a1 1 0 001.414-1.414L13.414 10l1.293-1.293a1 1 0 00-1.414-1.414L12 8.586l-1.293-1.293z'
		]
	]);
</script>

<button
	aria-label={key}
	title={key}
	on:click={() => typeKey(key)}
	class="w-full border-solid border-transparent font-bold text-snow-300 rounded-md text-center h-full grid place-items-center cursor-pointer hover:brightness-90 active:brightness-50"
	class:bg-polar-400={status === 'none'}
	class:bg-aurora-300={status === 'contains'}
	class:bg-aurora-400={status === 'correct'}
	class:bg-polar-200={status === 'incorrect'}
>
	{#if icons.get(key)}
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d={icons.get(key.toLowerCase())} clip-rule="evenodd" />
		</svg>
	{:else}
		{key.toUpperCase()}
	{/if}
</button>
