<script lang="ts">
	import LetterRow from './LetterRow.svelte';
	import { isValidWord } from '$lib/util/words';
	import { createEventDispatcher } from 'svelte';
	import { toastError } from '$lib/util/toastActions';

	const dispatch = createEventDispatcher();

	export let statuses: string[][];

	export let words: string[];

	export let attempt: number;

	let inputs = [null, null, null, null, null, null];

	const handleSubmit = () => {
		const i = words.filter(Boolean).length - 1;

		if (!isValidWord(words[i])) {
			toastError('Not a valid word.');
			return;
		}

		if (words[i].length !== 5) {
			toastError('Word too short.');
			return;
		}

		dispatch('wordSubmit', {
			attempt: i
		});

		if (i >= 5) {
			return;
		}
		currentInput++;
	};

	const getCurrentInput = (statuses: string[][]) => {
		const i = statuses.filter((l: string[]) => !l.some((s) => s === 'none')).length;
		return i > 5 ? 5 : i;
	};

	$: currentInput = getCurrentInput(statuses);

	$: inputs[currentInput] && inputs[currentInput].focus();
</script>

<div class="grid">
	{#each words as word, i}
		{#if i >= words.length - 6}
			<LetterRow
				bind:value={words[i]}
				bind:ref={inputs[i - words.length + 6]}
				on:letterSubmit={() => handleSubmit()}
				on:blur={() => inputs[currentInput].focus()}
				statuses={statuses[i]}
				row={i}
			/>
		{/if}
	{/each}
</div>

<style>
	.grid {
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: min(700px, 55vh);
		height: auto;
		gap: 8px;
		width: 100%;
		margin: auto auto;
	}
</style>
