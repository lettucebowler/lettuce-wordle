<script>
	export let letter;
	export let status;
</script>

<div class={status}>
	{letter.toUpperCase()}
</div>

<style>
	div {
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		flex-direction: column;
		font-size: 2rem;
		text-align: center;
		vertical-align: center;
		/* min-height: 4rem; */
		border-radius: 12px;
		color: var(--nord-6);
		font-weight: 700;
	}

	.none {
		background-color: var(--none);
		border-color: var(--incorrect);
		border-style: solid;
		border-width: medium;
	}

	.correct {
		background-color: var(--correct);
	}

	.contains {
		background-color: var(--contains);
	}

	.incorrect {
		background-color: var(--incorrect);
	}
</style>
