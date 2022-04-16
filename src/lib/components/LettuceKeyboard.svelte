<script lang="ts">
	import type { Status } from '$lib/types/types';
	import LettuceKey from '$lib/components/LettuceKey.svelte';

	export let keyStatuses: {
		[x: string]: Status;
	};
</script>

<div class="board">
	{#each ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'] as key}
		<div class="key">
			<LettuceKey key={key.toUpperCase()} status={keyStatuses[key]} on:keyPress />
		</div>
	{/each}
	<div />
	{#each ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'] as key}
		<div class="key">
			<LettuceKey key={key.toUpperCase()} status={keyStatuses[key]} on:keyPress />
		</div>
	{/each}
	<div />
	<div />
	<div />
	{#each [ 'share', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'ENTER', 'delete'] as key}
		<div class="key">
			<LettuceKey key={key.toUpperCase()} status={keyStatuses[key]} on:keyPress />
		</div>
	{/each}
</div>

<style>
	.board {
		display: grid;
		gap: 4px;
		grid-template-columns: repeat(40, 0.25fr);
	}

	.key {
		grid-column: span 4;
	}
</style>
