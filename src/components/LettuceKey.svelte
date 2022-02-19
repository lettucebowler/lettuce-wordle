<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import '../app.css';

	export let key: string;
	export let width = 1;
	export let enabled = true;

	const dispatch = createEventDispatcher();

	const typeKey = (key: string) => {
		dispatch('keyPress', {
			key
		});
	};
</script>

{#if enabled}
	<div>
		<button
			on:click={() => typeKey(key)}
			style="aspect-ratio: {width}"
			disabled={!enabled}
		>{key.toLowerCase()}</button
		>
	</div>
{/if}

{#if !enabled}
	<div />
{/if}

<style>
	.none {
		background-color: var(--incorrect);
	}

	.correct {
		background-color: var(--correct);
	}

	.contains {
		background-color: var(--contains);
	}

	.incorrect {
		background-color: var(--none);
	}

	button {
		width: 100%;
		display: inline-block;
		margin: 0 0;
		border: solid;
		border-color: var(--nord-0);
		background-color: var(--nord-3);
		font-size: 1.5rem;
		color: var(--nord-6);
		border-radius: 4px;
	}

	button:hover {
		background-color: var(--nord-2);
	}

	button:active {
		background-color: var(--nord-1);
	}
</style>
