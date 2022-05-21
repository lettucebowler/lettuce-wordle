<script lang="ts">
	import LetterRow from './LetterRow.svelte';
	import { isValidWord } from '$lib/util/words';
	import { createEventDispatcher } from 'svelte';
	import { toastError } from '$lib/util/toastActions';

	const dispatch = createEventDispatcher();

	export let statuses;

	export let words;

	let inputs = [null, null, null, null, null, null];

	export let currentInput = 0;

	const handleSubmit = (i: number) => {
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

		inputs[i < 5 ? i + 1 : 5].focus();

		if (i >= 5) {
			return;
		}
		currentInput++;
	};

	$: inputs[currentInput] && inputs[currentInput].focus();
</script>

<div class="grid">
	{#each words.slice(words.length > 6 ? -6 : 0) as word, i}
		<LetterRow
			bind:value={words[words.length - 6 + i]}
			bind:ref={inputs[i]}
			on:letterSubmit={() => handleSubmit(words.length - 6 + i)}
			on:blur={() => inputs[currentInput].focus()}
			statuses={statuses[words.length - 6 + i]}
		/>
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
