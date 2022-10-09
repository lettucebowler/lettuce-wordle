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

<input
	readonly
	class="grid aspect-square w-full grid-rows-3 rounded-xl text-center text-3xl font-bold text-snow-300"
	class:border-polar-300={answer === '_'}
	class:border-4={answer === '_'}
	class:border-solid={answer === '_'}
	class:bg-aurora-400={answer === 'x'}
	class:bg-aurora-300={answer === 'c'}
	class:bg-polar-300={answer === 'i'}
	class:bg-transparent={answer === '_'}
	class:animate-bulge={doBulge}
	class:animate-wiggle={wiggle}
	style:animation-delay={delayTime}
	style:transition-delay={delayTime}
	value={letter.toUpperCase()}
	{name}
/>
