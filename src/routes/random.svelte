<script>
	import LetterPageContentContainer from '../components/LetterPageContentContainer.svelte';
	import LetterGame from '../components/LetterGame.svelte';
	import { getRandomWord } from '../util/getDaillyWord';
	import '../app.css';
</script>

<body>
	<LetterPageContentContainer>
		<LetterGame answer={getRandomWord()} />
	</LetterPageContentContainer>
</body>

<style>
	body {
		background-color: var(--nord-0);
	}
</style>
