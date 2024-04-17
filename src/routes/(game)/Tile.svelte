<script lang="ts">
	export let letter = '';
	export let answer: string;
	export let doJump = false;
	export let doWiggle = false;
	export let doWiggleOnce = false;
	export let current = false;

	import { cx } from 'classix';
</script>

<div
	class={cx(
		'aspect-square rounded-xl bg-[--highlight-color] pt-[--tile-height]',
		doWiggle && 'animate-wiggle',
		doWiggleOnce && 'animate-wiggle-once',
		doJump && 'animate-jump',
		doWiggle || doWiggleOnce ? null : 'column-delay'
	)}
	data-answer={answer}
>
	<div
		class={cx(
			'relative box-content grid aspect-square items-center rounded-xl text-center text-2xl font-bold text-[--text-color] transition-all duration-0 sm:text-3xl',
			answer
				? 'bg-[--bg-color] shadow-[0_var(--tile-height)_4px_0_rgb(0_0_0_/_0.2)]'
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
	[data-answer='c'] {
		--bg-color: theme('colors.putty.500');
		--highlight-color: theme('colors.putty.300');
		--text-color: theme('colors.putty.800');
	}

	[data-answer='x'] {
		--bg-color: theme('colors.swamp-green.500');
		--highlight-color: theme('colors.swamp-green.300');
		--text-color: theme('colors.swamp-green.800');
	}

	[data-answer='i'] {
		--bg-color: theme('colors.charade.700');
		--highlight-color: theme('colors.charade.500');
		--text-color: theme('colors.charade.100');
	}

	div {
		--tile-height: var(--height, 3px);
		--tile_column: var(--column, 0);
		--tile_delay-scale: var(--delay-scale, 0.03);
		--tile_duration: var(--duration, 0.15);
		--text-color: theme('colors.snow.300');
		--tile-row: var(--row, 0);
	}

	.column-delay {
		animation-delay: calc(1s * (var(--tile_column) * var(--tile_delay-scale)));
		transition-delay: calc(
			(var(--tile_column) * var(--tile_delay-scale) + var(--tile_duration)) * 1s
		);
	}
</style>
