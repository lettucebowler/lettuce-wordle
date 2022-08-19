<script lang="ts">
	import LetterGame from '$lib/components/LetterGame.svelte';
	import { appName } from '$lib/util/store';

	export let data: import('./$types').PageData = {
		state: {
			answer: '',
			words: ['', '', '', '', '', ''],
			success: true,
			attempt: 0
		}
	};
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Lettuce Wordle`" />
	<title>{$appName} Daily</title>
</svelte:head>

<main class="flex justify-between flex-col flex-auto gap-2">
	<LetterGame
		answer={data?.state?.answer}
		words={data?.state?.words}
		success={data?.state.success}
		attempt={data?.state.attempt}
	/>
</main>
