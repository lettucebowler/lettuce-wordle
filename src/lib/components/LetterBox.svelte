<script lang="ts">
	import { browser } from '$app/environment';

	export let letter: string;
	export let answer: string;
	export let name: string;
	export let slot = 0;
	export let bulge = false;
	export let wiggle = false;

	const delay = 0.03;

	let doBulge = false;

	$: {
		if (browser) {
			doBulge = bulge;
		}
	}
	$: delayTime = wiggle ? '0s' : `${slot * delay}s`;
</script>

<div
	class="box-border grid aspect-square items-center rounded-xl text-center text-2xl font-bold text-snow-300 sm:text-3xl"
	class:border-charade-700={answer === '_'}
	class:border-4={answer === '_'}
	class:border-solid={answer === '_'}
	class:bg-aurora-400={answer === 'x'}
	class:bg-aurora-300={answer === 'c'}
	class:bg-charade-700={answer === 'i'}
	class:bg-transparent={answer === '_'}
	class:animate-bulge={doBulge}
	class:animate-wiggle={wiggle}
	style:animation-delay={delayTime}
	style:transition-delay={delayTime}
>
	<input type="hidden" readonly value={letter.toUpperCase()} {name} />
	{letter.toLocaleUpperCase()}
</div>
