<script>
	import LetterPageContentContainer from '../components/LetterPageContentContainer.svelte';
	import LetterGame from '../components/LetterGame.svelte';
	import { getRandomWord } from '../util/getDaillyWord';
	import '../app.css';
</script>

<LetterPageContentContainer>
	<LetterGame answer={getRandomWord()} />
</LetterPageContentContainer>
