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
</script>

<div
	class={cx(
		'box-border grid aspect-square items-center rounded-xl text-center text-2xl font-bold transition-all sm:text-3xl',
		answer && 'border-t-[3px] shadow-[0_4px_4px_0_rgb(0_0_0_/_0.2)]',
		!answer && 'text-charade-100',
		answer === 'x' && 'border-t-swamp-green-300 bg-swamp-green-500 text-swamp-green-800',
		answer === 'i' && 'border-t-charade-500 bg-charade-700 text-charade-100',
		answer === 'c' && 'border-t-putty-300 bg-putty-500 text-putty-800',
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
