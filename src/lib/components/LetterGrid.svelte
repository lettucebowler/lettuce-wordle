<script lang="ts">
	import LetterRow from './LetterRow.svelte';
	import { isValidWord } from '$lib/util/words';
	import { createEventDispatcher, onMount } from 'svelte';
	import { toastError } from '$lib/util/toastActions';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

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

<div class="flex flex-col justify-center max-w-[min(700px,_55vh)] h-auto gap-2 w-full m-auto">
	{#each words
		.map((word, i) => ({ word, i }))
		.filter((word) => word.i >= words.length - 6) as word (`${word.i}`)}
		<div
			animate:flip={{ duration: 150, delay: 150 }}
			in:fly={{ y: 100, duration: 150, delay: 150 }}
			out:fly={{ x: 100, duration: 150 }}
		>
			<LetterRow
				bind:value={words[word.i]}
				bind:ref={inputs[word.i - words.length + 6]}
				on:letterSubmit={() => handleSubmit()}
				on:blur={() => focusInput(currentInput)}
				statuses={statuses[word.i]}
				row={word.i}
			/>
		</div>
	{/each}
</div>
