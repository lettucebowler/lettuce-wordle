<script>
	import LetterBox from '../components/LetterBox.svelte';
	export let data;
</script>

<div>
	{#each data as word}
		{#each word.word as letter}
			<LetterBox letter={letter?.letter || ''} status={letter?.status || 'none'} />
		{/each}
	{/each}
</div>

<style>
	div {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
		margin: 0 auto;
		/* max-width: min(600px, 100%); */
		/* max-height: 60vh; */
		/* height: 100%; */
		aspect-ratio: 5 / 6;
	}
</style>
