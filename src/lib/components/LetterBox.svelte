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
		justify-content: center;
		text-align: center;
		align-items: center;
		display: inline-flex;
		font-size: 3rem;
		border-radius: 12px;
		color: var(--nord-6);
		font-weight: 700;
		min-width: 50px;
		min-height: 50px;
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
