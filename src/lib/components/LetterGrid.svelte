<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';

	import LetterRow from './LetterRow.svelte';
	import { isValidWord } from '$lib/util/words';
	import { createEventDispatcher, onMount } from 'svelte';
	import { toastError } from '$lib/util/toastActions';

	const dispatch = createEventDispatcher();

	export let statuses: string[][];

	export let words: string[];

	let inputs: HTMLInputElement[] = [];

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

		if (i < 5) {
			currentInput++;
		}
		focusInput(currentInput);
	};

	const getCurrentInput = (statuses: string[][]) => {
		const i = statuses.filter((l: string[]) => !l.some((s) => s === 'none')).length;
		return i > 5 ? 5 : i;
	};

	const focusInput = (i: number) => {
		setTimeout(() => inputs[currentInput] && inputs[currentInput]?.focus(), 1);
	};

	$: currentInput = getCurrentInput(statuses);

	$: focusInput(currentInput);

	onMount(() => {
		focusInput(currentInput);
	});
</script>

<div
	class="flex flex-col justify-center max-w-[min(700px,_55vh)] h-auto gap-2 w-full m-auto"
	use:autoAnimate
>
	{#each words as word, i}
		{#if i >= words.length - 6}
			<LetterRow
				bind:value={words[i]}
				bind:ref={inputs[i - words.length + 6]}
				on:letterSubmit={() => handleSubmit()}
				on:blur={() => focusInput(currentInput)}
				statuses={statuses[i]}
				row={i}
			/>
		{/if}
	{/each}
</div>
