<script lang="ts">
	type TileProps = {
		letter: string;
		answer: string | undefined;
		doJump?: boolean;
		doWiggle?: boolean;
		doWiggleOnce?: boolean;
		current: boolean;
	};

	let {
		letter = '',
		answer,
		doJump = false,
		doWiggle = false,
		doWiggleOnce = false,
		current = false
	}: TileProps = $props();
</script>

<div
	class={{
		'data-[answer=x]:bg-swamp-green-300 data-[answer=c]:bg-putty-300 data-[answer=i]:bg-charade-500 data-wiggle:animate-wiggle data-wiggle-once:animate-wiggle-once datacron-jump:animate-jump aspect-square rounded-xl pt-(--tile-height)': true,
		'column-delay': !doWiggle && !doWiggleOnce
	}}
	data-answer={answer}
	data-wiggle={doWiggle || undefined}
	data-wiggle-once={doWiggleOnce || undefined}
	data-jump={doJump || undefined}
	style="--tile-column: var(--column, 0); --tile-delay-scale: var(--delay-scale, 0.03); --tile-duration: var(--duration, 0.15);"
>
	<div
		class={[
			'in-data-[answer=c]:bg-putty-500 in-data-[answer=c]:text-putty-800 in-data-[answer=x]:bg-swamp-green-500 in-data-[answer=x]:text-swamp-green-800 in-data-[answer=i]:bg-charade-700 text-charade-100 relative box-content grid aspect-square items-center rounded-xl text-center text-2xl font-bold transition-all duration-0 in-data-answer:shadow-[0_var(--tile-height)_4px_0_rgb(0_0_0_/_0.2)] sm:text-3xl'
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

<style>
	.column-delay,
	.column-delay * {
		animation-delay: calc(1s * (var(--tile-column) * var(--tile-delay-scale)));
		transition-delay: calc(
			(var(--tile-column) * var(--tile-delay-scale) + var(--tile-duration)) * 1s
		);
	}
</style>
