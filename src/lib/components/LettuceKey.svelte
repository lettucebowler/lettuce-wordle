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

	const icons = {
		enter: 'icon-keyboard_return',
		delete: 'icon-backspace'
	};
</script>

{#if key in icons}
	<button aria-label={key} title={key} on:click={() => typeKey(key)} class={status}
		><span class={icons[key]} /></button
	>
{:else}
	<button aria-label={key} title={key} on:click={() => typeKey(key)} class={status}
		>{key.toUpperCase()}</button
	>
{/if}

<style>
	button {
		width: 100%;
		border: solid;
		border-color: transparent;
		background-color: var(--nord-3);
		font-size: 1rem;
		font-weight: 900;
		color: var(--nord-6);
		border-radius: 6px;
		text-align: center;
		height: 100%;
		padding: 0;
		display: grid;
		place-items: center;
		cursor: pointer;
	}

	button:hover {
		filter: brightness(90%);
	}

	button:active {
		filter: brightness(80%);
	}

	.icon {
		font-size: 1rem;
	}

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
		background-color: var(--nord-1);
	}
</style>
