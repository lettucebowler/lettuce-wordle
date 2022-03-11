<script lang="ts">
	import LetterGame from '$lib/components/LetterGame.svelte';
	import { getRandomWord } from '$lib/util/words';
	const answer = getRandomWord();
	import { appName } from '$lib/util/store';
</script>

<meta charset="UTF-8" />
<meta name="description" content="Lettuce Wordle" />
<title>{$appName} Random</title>
<LetterGame {answer} />
