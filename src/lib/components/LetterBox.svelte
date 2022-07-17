<script lang="ts">
	export let letter: string;
	export let status: string;
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
		animation: identifier 0.3s 1;
	}

	.contains {
		background-color: var(--contains);
		animation: identifier 0.3s 1;
	}

	.incorrect {
		background-color: var(--incorrect);
		animation: identifier 0.3s 1;
	}

	@keyframes identifier {
		0% {
			transform: scale(1.05);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1.05);
		}
	}
</style>
