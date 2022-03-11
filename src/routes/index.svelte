<script lang="ts">
	import LetterGame from '$lib/components/LetterGame.svelte';
	import '$lib/styles/app.css';
	import { appName } from '$lib/util/store';
	import { getDailyWord } from '$lib/util/words';

	const answer = getDailyWord();
</script>

<meta charset="UTF-8" />
<meta name="description" content="Lettuce Wordle" />
<title>{$appName} Daily</title>

<LetterGame {answer} />
