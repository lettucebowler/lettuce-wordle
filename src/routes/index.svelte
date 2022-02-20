<script>
	import LetterPageContentContainer from '../components/LetterPageContentContainer.svelte';
	import LetterGame from '../components/LetterGame.svelte';
	import '../app.css';
</script>

<meta charset="UTF-8">

<body>
	<LetterPageContentContainer>
		<LetterGame />
	</LetterPageContentContainer>
</body>

<style>
	body {
		background-color: var(--nord-0);
	}
</style>
