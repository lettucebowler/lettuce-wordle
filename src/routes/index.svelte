<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import LetterGame from '$lib/components/LetterGame.svelte';
	import '$lib/styles/app.css';
	import { appName } from '$lib/util/store';
	import { getDailyWord } from '$lib/util/words';
	import { onMount } from 'svelte';

	// const answer = getDailyWord();
	let answer;

	onMount(async () => {
		answer = getDailyWord();
	});
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Lettuce Wordle" />
	<title>{$appName} Daily</title>
</svelte:head>

<LetterGame {answer} />
