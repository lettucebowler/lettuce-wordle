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
		column-gap: 4px;
		row-gap: 4px;
	}
</style>
