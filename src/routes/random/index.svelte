<script lang="ts">
	import LetterPageContentContainer from '$lib/components/LetterPageContentContainer.svelte';
	import LetterGame from '$lib/components/LetterGame.svelte';
	import '$lib/styles/app.css';

	export let answer: string;
</script>

<meta charset="UTF-8" />
<meta name="description" content="Lettuce Wordle" />
<title>Lettuce Wordle</title>

<body>
	<LetterPageContentContainer>
		<LetterGame {answer} />
	</LetterPageContentContainer>
</body>

<style>
	body {
		background-color: var(--nord-0);
	}
</style>
