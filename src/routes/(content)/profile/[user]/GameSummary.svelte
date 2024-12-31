<script lang="ts">
	type GameSummaryProps = {
		answers: string;
	};
	let { answers }: GameSummaryProps = $props();
</script>

<div class="grid grid-cols-5 gap-1">
	{#each [...Array(30).keys()] as i}
		{@const answer = answers.charAt(i) || '_'}
		<div
			data-answer={answer}
			class={{
				'tile aspect-square w-full rounded-lg bg-[--bg-color]': true,
				'border-t-[1px] border-[--highlight-color] shadow-[0_var(--depth)_4px_0_rgb(0_0_0_/_0.2)]':
					answer !== '_'
			}}
		></div>
	{/each}
</div>

<style>
	.tile {
		--depth: 1px;
		--bg-color: theme(colors.charade.950);
		--highlight-color: theme(colors.charade.700);
	}

	[data-answer='c'] {
		--bg-color: theme('colors.putty.500');
		--highlight-color: theme('colors.putty.200');
		--text-color: theme('colors.putty.800');
	}

	[data-answer='x'] {
		--bg-color: theme('colors.swamp-green.500');
		--highlight-color: theme('colors.swamp-green.200');
		--text-color: theme('colors.swamp-green.800');
	}

	[data-answer='i'] {
		--bg-color: theme('colors.charade.800');
		--highlight-color: theme('colors.charade.500');
		--text-color: theme('colors.charade.100');
	}
</style>
