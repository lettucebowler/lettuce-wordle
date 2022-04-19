<script>
	import LetterBox from '../components/LetterBox.svelte';
	export let data;
</script>

<div class="words">
	{#each data as word}
		<div class="word">
			{#each word.word as letter}
				<div class="letter">
					<LetterBox letter={letter?.letter || ''} status={letter?.status || 'none'} />
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.words {
		display: flex;
		width: 100%;
		max-width: min(600px, 60vh);
		flex-direction: column;
		justify-content: center;
		gap: 8px;
		margin: auto auto;
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
