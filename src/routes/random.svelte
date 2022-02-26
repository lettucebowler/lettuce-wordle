<script lang="ts">
	import LetterPageContentContainer from '../../components/LetterPageContentContainer.svelte';
	import LetterGame from '../../components/LetterGame.svelte';
	import '../../app.css';

	export let answer: string;
</script>

<meta charset="UTF-8">
<meta name="description" content="Lettuce Wordle">
<title>Lettuce Wordle</title>

<body>
	<LetterPageContentContainer>
		<LetterGame answer={answer} />
	</LetterPageContentContainer>
</body>

<style>
	body {
		background-color: var(--nord-0);
	}
</style>
