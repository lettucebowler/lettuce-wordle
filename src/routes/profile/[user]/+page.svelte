<script lang="ts">
	export let data: import('./$types').PageData;

	$: gameResults = data.gameResults;

	const cells = Array(30);
</script>

<h1 class="w-full text-center text-3xl text-snow-300">Nothing to see here</h1>

<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
	{#each gameResults.sort((a, b) => b.gamenum - a.gamenum) as gameResult (gameResult.gamenum)}
		<div class="grid w-full gap-2 rounded-2xl border-2 border-solid border-polar-300 p-2">
			<h2 class="flex justify-between text-center text-xl text-snow-300">
				<span class="text-left">#{gameResult.gamenum}</span><span class="text-right"
					>{gameResult.answers.length / 5}</span
				>
			</h2>
			<div class="grid grid-cols-5 gap-1 ">
				{#each cells as _, i}
					{@const answer = gameResult.answers.split('').slice(-30).join('').charAt(i) || '_'}
					<div
						class="box-border grid aspect-square w-full grid-rows-3 rounded-lg text-center text-2xl font-bold text-snow-300 sm:text-3xl"
						class:border-polar-300={answer === '_'}
						class:border-2={answer === '_'}
						class:border-solid={answer === '_'}
						class:bg-polar-100={answer === '_'}
						class:bg-aurora-400={answer === 'x'}
						class:bg-aurora-300={answer === 'c'}
						class:bg-polar-300={answer === 'i'}
					/>
				{/each}
			</div>
		</div>
	{/each}
</div>
