<script lang="ts">
	import LetterRow from './LetterRow.svelte';
	import { isValidWord } from '$lib/util/words';
	import { createEventDispatcher } from 'svelte';
	import { toastError } from '$lib/util/toastActions';

	const dispatch = createEventDispatcher();

	export let statuses = [
		['none', 'none', 'none', 'none', 'none'],
		['none', 'none', 'none', 'none', 'none'],
		['none', 'none', 'none', 'none', 'none'],
		['none', 'none', 'none', 'none', 'none'],
		['none', 'none', 'none', 'none', 'none'],
		['none', 'none', 'none', 'none', 'none']
	];

	export let words = ['', '', '', '', '', ''];

	let inputs = [null, null, null, null, null, null];

	export let currentInput = 0;

	const handleSubmit = (i: number) => {
		if (i > 5 || i !== currentInput) {
			return;
		}

		if (!isValidWord(words[i])) {
			toastError('Not a valid word.');
			return;
		}

		if (words[i].length !== 5) {
			toastError('Word too short.');
			return;
		}

		dispatch('wordSubmit', {
			attempt: currentInput
		});

		if (i >= 5) {
			return;
		}

		inputs[i + 1].focus();
		currentInput++;
	};

	$: inputs[currentInput] && inputs[currentInput].focus();
</script>

<div class="grid">
	{#each [0, 1, 2, 3, 4, 5] as i}
		<LetterRow
			bind:value={words[i]}
			bind:ref={inputs[i]}
			on:letterSubmit={() => handleSubmit(i)}
			on:blur={() => inputs[currentInput].focus()}
			statuses={statuses[i]}
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
