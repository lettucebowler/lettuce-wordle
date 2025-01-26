<script lang="ts">
	type TileProps = {
		letter: string;
		answer: string | undefined;
		doJump?: boolean;
		doWiggle?: boolean;
		doWiggleOnce?: boolean;
		current: boolean;
		column?: number;
	};

	let {
		letter = '',
		answer,
		doJump = false,
		doWiggle = false,
		doWiggleOnce = false,
		current = false,
		column = 0
	}: TileProps = $props();

	const delayScale = 0.03;
	const duration = delayScale * 5;
</script>

<div
	style="--tile-column: var({column}, 0); --animation-delay:{column *
		0.03}s; --transition-delay:{column * delayScale + duration}s"
	class={[
		'aspect-square rounded-xl pt-(--tile-height) transition delay-(--transition-delay)',
		!doWiggle && !doWiggleOnce && '[animation-delay:var(--animation-delay)]',
		answer === 'c' && 'bg-putty-300',
		answer === 'x' && 'bg-swamp-green-300',
		answer === 'i' && 'bg-charade-500',
		doWiggle && 'animate-wiggle',
		doWiggleOnce && 'animate-wiggle-once',
		doJump && 'animate-jump'
	]}
>
	<div
		class={[
			'text-charade-100 relative box-content grid aspect-square items-center rounded-xl text-center text-2xl font-bold transition transition-all delay-(--transition-delay) duration-0 sm:text-3xl',
			answer === 'x' && 'bg-swamp-green-500 text-swamp-green-800',
			answer === 'c' && 'bg-putty-500 text-putty-800',
			answer === 'i' && 'bg-charade-700',
			answer && 'shadow-[0_var(--tile-height)_4px_0_rgb(0_0_0_/_0.2)]'
		]}
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
