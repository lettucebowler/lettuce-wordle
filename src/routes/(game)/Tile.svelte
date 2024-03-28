<script lang="ts">
	export let letter = '';
	export let answer = '_';
	export let doJump = false;
	export let doWiggle = false;
	export let doWiggleOnce = false;
	export let wordIsInvalid = false;
	export let column = 0;
	export let current = false;

	const delayScale = 0.03;
	const duration = 0.15;

	import { cx } from 'classix';

	const b =
		'box-border grid aspect-square items-center rounded-xl border-charade-950 text-center text-2xl font-bold text-snow-300 transition-all sm:text-3xl';
</script>

<div
	class={cx(
		'box-border grid aspect-square items-center rounded-xl text-center text-2xl font-bold transition-all sm:text-3xl',
		answer && 'offset border-t-4',
		!answer &&
			'inset border-b-4 border-t-0 border-b-charade-800 bg-charade-950 text-charade-100 shadow-inner',
		answer === 'x' && 'etched-x border-t-swamp-green-400 bg-swamp-green-500 text-swamp-green-800',
		answer === 'i' && 'etched-i border-t-charade-600 bg-charade-700 text-charade-100',
		answer === 'c' && 'etched-c border-t-putty-400 bg-putty-500 text-putty-800',
		answer === '_' && 'border-b-4 border-t-0 border-b-charade-600 text-charade-100',
		doWiggle && 'animate-wiggle',
		doWiggleOnce && 'animate-wiggle-once',
		doJump && 'animate-jump'
	)}
	style:transition-delay={`${column * delayScale + duration}s`}
	style:animation-delay={wordIsInvalid ? '0s' : `${column * delayScale}s`}
	style:transition-duration={`${duration}ms`}
>
	<input type="hidden" readonly value={letter.toUpperCase()} name={current ? 'guess' : undefined} />
	{letter.toUpperCase()}
</div>

<style>
	.etched-x {
		text-shadow: 0 2px theme(colors.swamp-green.400);
	}

	.etched-c {
		text-shadow: 0 2px theme(colors.putty.400);
	}

	.etched-i {
		text-shadow: 0 2px theme(colors.charade.600);
	}

	.inset {
		box-shadow:
			var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000),
			inset 0 4px 4px 0 rgb(0 0 0 / 0.2);
	}

	.offset {
		box-shadow:
			var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000),
			0 4px 4px 0 rgb(0 0 0 / 0.2);
	}
</style>
