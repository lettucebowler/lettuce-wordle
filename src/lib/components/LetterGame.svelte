<script lang="ts">
	import { enhance } from '$app/forms';
	import LettuceKeyboard from '$lib/components/LettuceKeyboard.svelte';
	import LetterBox from '$lib/components/LetterBox.svelte';

	const rows = Array(6);
	const columns = Array(5);
	export let guesses: string[];
	export let answers: string[];
	export let invalid = false;

	$: current_guess = answers.length;

	let keys = {};

	const getKeyStatuses = (words: string[], statuses: string[]) => {
		const letters = Array.from(
			new Set(
				words
					.map((w, i) =>
						w.split('').map((l, j) => ({
							letter: l,
							status: statuses[i]?.[j] || '_'
						}))
					)
					.flat()
			)
		);
		const correctList = letters
			.filter((letter) => letter.status === 'x')
			.map((l) => ({ [l.letter]: l.status }));
		const correct: { [x: string]: string } = Object.assign({}, ...correctList);
		const containsList = letters
			.filter((letter) => letter.status === 'c')
			.map((l) => ({ [l.letter]: l.status }));
		const contains: { [x: string]: string } = Object.assign({}, ...containsList);
		const incorrectList = letters
			.filter((letter) => letter.status === 'i')
			.map((l) => ({ [l.letter]: l.status }));
		const incorrect: { [x: string]: string } = Object.assign({}, ...incorrectList);

		return { ...incorrect, ...contains, ...correct };
	};

	$: {
		keys = {};
		keys = getKeyStatuses(guesses, answers);
	}
</script>

<form
	method="POST"
	action="?/enter"
	id="game"
	use:enhance={({ data, cancel }) => {
		console.log('bleh');
		console.log(data.getAll('guess'));
		cancel();
	}}
	class="grid gap-2 grid-cols-5 h-full m-auto max-w-[min(700px,_55vh)] h-auto"
>
	{#each rows as _, i}
		{@const current = i === current_guess}
		{#each columns as _, j}
			{@const answer = (answers[i] || '_____')[j]}
			{@const letter = guesses?.at(i)?.at(j) || ''}
			<LetterBox
				{answer}
				{letter}
				slot={j}
				name={current ? 'guess' : ''}
				bulge={i === current_guess - 1 &&
					guesses?.at(-1)?.length === 5 &&
					!!answers?.at(guesses.length - 1)}
				wiggle={invalid && i === current_guess}
			/>
		{/each}
	{/each}
</form>
<div class="h-full max-h-[min(18rem,_30vh)]">
	<LettuceKeyboard on:key answers={keys} />
</div>
