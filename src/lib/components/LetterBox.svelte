<script lang="ts">
	export let letter: string;
	export let status: string;
	export let slot = 0;

	const delay = 0.05;
	$: style =
		status !== 'none' ? `animation-delay: ${slot * delay}s;transition-delay: ${slot * delay}s` : '';
</script>

<div class={`${status} ${status !== 'none' ? 'animate' : ''}`} {style}>
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
	}

	.contains {
		background-color: var(--contains);
	}

	.incorrect {
		background-color: var(--incorrect);
	}

	:not(.none) {
		transition: all 0.15s;
		border-width: 0px;
		border-color: transparent;
		border-style: solid;
	}

	.animate {
		animation: bulge 0.3s 1;
	}

	@keyframes bulge {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05) translateY(-5%);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
