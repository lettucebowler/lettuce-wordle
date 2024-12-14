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
	class="data-[do-wiggle=false]:data-[do-wiggle-once=false]:column-delay group aspect-square rounded-xl pt-[--tile-height] data-[do-jump=true]:animate-jump data-[do-wiggle-once=true]:animate-wiggle-once data-[do-wiggle=true]:animate-wiggle data-[answer=c]:bg-putty-300 data-[answer=i]:bg-charade-500 data-[answer=x]:bg-swamp-green-300"
	data-answer={answer === '_' ? 'u' : answer}
	data-do-wiggle={doWiggle}
	data-do-wiggle-once={doWiggleOnce}
	data-do-jump={doJump}
>
	<div
		class={cx(
			'relative box-content grid aspect-square items-center rounded-xl text-center text-2xl font-bold text-charade-100 shadow-[0_var(--tile-height)_4px_0_rgb(0_0_0_/_0.2)] transition-all duration-0 group-data-[answer=c]:bg-putty-500 group-data-[answer=i]:bg-charade-700 group-data-[answer=x]:bg-swamp-green-500 group-data-[answer=c]:text-putty-800 group-data-[answer=x]:text-swamp-green-800 group-data-[answer=u]:shadow-none sm:text-3xl'
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
