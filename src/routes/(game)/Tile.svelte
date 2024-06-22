<script lang="ts">
	type TileProps = {
		letter: string;
		answer: string;
		doJump?: boolean;
		doWiggle?: boolean;
		doWiggleOnce?: boolean;
		current: boolean;
	};

	let {
		letter = '',
		answer = '',
		doJump = false,
		doWiggle = false,
		doWiggleOnce = false,
		current = false
	}: TileProps = $props();

	import { cx } from 'classix';
</script>

<div
	class={cx(
		'aspect-square rounded-xl pt-[--tile-height]',
		answer === 'c' && 'bg-putty-300',
		answer === 'x' && 'bg-swamp-green-300',
		answer === 'i' && 'bg-charade-500',
		doWiggle && 'animate-wiggle',
		doWiggleOnce && 'animate-wiggle-once',
		doJump && 'animate-jump',
		doWiggle || doWiggleOnce ? null : 'column-delay'
	)}
	data-answer={answer}
>
	<div
		class={cx(
			'relative box-content grid aspect-square items-center rounded-xl text-center text-2xl font-bold transition-all duration-0 sm:text-3xl',
			answer === 'c' && 'bg-putty-500 text-putty-800',
			answer === 'x' && 'bg-swamp-green-500 text-swamp-green-800',
			answer === 'i' && 'bg-charade-700 text-charade-100',
			['c', 'x', 'i'].includes(answer)
				? 'shadow-[0_var(--tile-height)_4px_0_rgb(0_0_0_/_0.2)]'
				: 'text-charade-100'
		)}
	>
		<input
			type="hidden"
			readonly
			value={letter.toUpperCase()}
			name={current ? 'guess' : undefined}
		/>
		{letter.toUpperCase()}
	</div>
</div>

<style>
	.column-delay,
	.column-delay * {
		--tile-column: var(--column, 0);
		--tile-delay-scale: var(--delay-scale, 0.03);
		--tile-duration: var(--duration, 0.15);
		animation-delay: calc(1s * (var(--tile-column) * var(--tile-delay-scale)));
		transition-delay: calc(
			(var(--tile-column) * var(--tile-delay-scale) + var(--tile-duration)) * 1s
		);
	}
</style>
