<script>
	export let letter;
	export let status;
</script>

<div class={status}>
	{letter}
</div>

<style>
	div {
		aspect-ratio: 1;
		justify-content: center;
		text-align: center;
		align-items: center;
		vertical-align: center;
		display: inline-flex;
		font-size: 3rem;
		border-radius: 4px;
		color: var(--nord-6);
		margin: 2px 2px;
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
