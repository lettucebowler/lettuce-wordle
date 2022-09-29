<script lang="ts">
	import { browser } from '$app/environment';

	export let letter: string;
	export let answer: string;
	export let name: string;
	export let slot = 0;
	export let bulge = false;
	export let wiggle = false;
	export let loading = false;

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
>
	<input
		readonly
		class="row-start-2 w-full bg-transparent text-center"
		style:animation-delay={delayTime}
		value={letter.toUpperCase()}
		{name}
	/>
	<svg
		class="relative bottom-1 row-start-3 m-auto w-4 animate-spin"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		class:invisible={!loading}
	>
		<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
		<path
			class="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		/>
	</svg>
</div>
