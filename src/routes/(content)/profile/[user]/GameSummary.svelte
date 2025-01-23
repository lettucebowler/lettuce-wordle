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
				'tile aspect-square w-full rounded-lg bg-(--bg-color)': true,
				'border-t-[1px] border-(--highlight-color) shadow-[0_var(--depth)_4px_0_rgb(0_0_0_/_0.2)]':
					answer !== '_'
			}}
		></div>
	{/each}
</div>

<style>
	.tile {
		--depth: 1px;
		--bg-color: var(--color-charade-950);
		--highlight-color: var(--color-charade-700);
	}

	[data-answer='c'] {
		--bg-color: var(--color-putty-500);
		--highlight-color: var(--color-putty-200);
		--text-color: var(--colors-putty-800);
	}

	[data-answer='x'] {
		--bg-color: var(--color-swamp-green-500);
		--highlight-color: var(--color-swamp-green-200);
		--text-color: var(--color-swamp-green-800);
	}

	[data-answer='i'] {
		--bg-color: var(--color-charade-800);
		--highlight-color: var(--color-charade-500);
		--text-color: var(--color-charade-100);
	}
</style>
