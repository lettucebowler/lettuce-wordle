<script lang="ts">
	import classnames from 'classnames';

	export let letter: string;
	export let status: string;
	export let slot = 0;

	const delay = 0.05;
</script>

<div
	style={`animation-delay: ${slot * delay}s;transition-delay: ${slot * delay}s;`}
	class={classnames(
		`grid place-items-center flex aspect-square font-bold text-3xl text-snow-300 rounded-xl`,
		{
			'border-polar-300 border-4 border-solid': status === 'none',
			'bg-aurora-400': status === 'correct',
			'bg-aurora-300': status === 'contains',
			'bg-polar-300': status === 'incorrect',
			'animate-bulge': status !== 'none'
		}
	)}
>
	{letter.toUpperCase()}
</div>
