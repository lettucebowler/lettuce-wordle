<script>
	import LetterBox from '../components/LetterBox.svelte';
	export let data;
</script>

<!-- <div class="words"> -->
<div class="grid">
	{#each data as word}
		<!-- <div class="word"> -->
		{#each word.word as letter}
			<!-- <div class="letter"> -->
			<LetterBox letter={letter?.letter || ''} status={letter?.status || 'none'} />
			<!-- </div> -->
		{/each}
		<!-- </div> -->
	{/each}
</div>

<!-- </div> -->
<style>
	.words {
		display: grid;
		/* width: 100%; */
		justify-content: center;
		margin: auto auto;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		max-width: min(600px, 60vh);
		gap: 8px;
		width: 100%;
		margin: auto auto;
		/* height: 100%; */
	}

	.word {
		display: flex;
		flex: 0 1 auto;
		flex-direction: row;
		justify-content: center;
		gap: 8px;
		height: 100%;
	}

	.letter {
		display: flex;
		flex: 1 1 auto;
		justify-content: center;
		flex-direction: column;
	}
</style>
