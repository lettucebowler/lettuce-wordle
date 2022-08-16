<script lang="ts">
	import LetterGame from '$lib/components/LetterGame.svelte';
	import { appName } from '$lib/util/store';

	/** @type {import('./$types').PageData} */
	export let data;

	$: state = data.state;
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Lettuce Wordle" />
	<title>{$appName} Daily</title>
</svelte:head>

<main>
	<LetterGame
		answer={state.answer}
		words={state.words}
		success={state.success}
		attempt={state.attempt}
	/>
</main>

<style>
	main {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		flex: 1 1 auto;
		gap: 8px;
	}
</style>
