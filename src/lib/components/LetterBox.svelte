<script lang="ts">
	export let letter: string;
	export let status: string;
	export let slot = 0;

	const delay = 0.03;
	const delayTime = `${slot * delay}s`;
</script>

<div
	class="grid place-items-center flex aspect-square font-bold text-3xl text-snow-300 rounded-xl"
	class:border-polar-300={status === 'none'}
	class:border-4={status === 'none'}
	class:border-solid={status === 'none'}
	class:bg-aurora-400={status === 'correct'}
	class:bg-aurora-300={status === 'contains'}
	class:bg-polar-300={status === 'incorrect'}
	class:animate-bulge={status !== 'none'}
	style:animation-delay={delayTime}
	style:transition-delay={delayTime}
>
	{letter.toUpperCase()}
</div>
