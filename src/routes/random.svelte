<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import LetterGame from '$lib/components/LetterGame.svelte';
	import { getRandomWord } from '$lib/util/words';
	import { appName } from '$lib/util/store';
	import { onMount } from 'svelte';

	let answer;

	onMount(async () => {
		answer = getRandomWord();
	});
</script>

<meta charset="UTF-8" />
<meta name="description" content="Lettuce Wordle" />
<title>{$appName} Random</title>
<LetterGame {answer} />
