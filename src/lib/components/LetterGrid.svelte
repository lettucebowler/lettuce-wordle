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
		grid-gap: 8px;
		width: 100%;
		max-width: 600px;
		margin: auto auto;
	}
</style>
