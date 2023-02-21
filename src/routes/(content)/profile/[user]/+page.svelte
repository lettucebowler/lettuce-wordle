<script lang="ts">
	import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	const cells = Array(30);

	// $: gameResults = data.gameResults;
</script>

<main class="grid w-full gap-8">
	<figure class="flex flex-col gap-2">
		<div class="mx-auto h-full overflow-hidden rounded-2xl">
			<LettuceAvatar name={data.profile.user} size={256} />
		</div>
		<figcaption class="text-center text-2xl font-medium text-snow-300">
			{data.profile.user}
		</figcaption>
	</figure>

	<h1 class="text-center text-3xl font-bold text-snow-300">Play History</h1>

	{#await data.profile.gameResults}
		<div class="w-full flex items-center flex-col mt-10 gap-4">
			<svg
				class="animate-spin h-20 w-20 text-white"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			<span class="text-snow-300 font-medium">Just a sec....</span>
		</div>
	{:then gameResults}
		<div class="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
			{#each gameResults.sort((a, b) => b.gamenum - a.gamenum) as gameResult (gameResult.gamenum)}
				{@const answers = gameResult.answers.split('').slice(-30).join('')}
				<div
					class="flex w-full flex-[1_1_200px] flex-col gap-2 rounded-2xl border-4 border-solid border-charade-700 p-2"
				>
					<h2 class="flex justify-between text-center text-xl font-medium text-snow-300">
						<span class="text-left">#{gameResult.gamenum}</span><span class="text-right"
							>{gameResult.attempts || 0}</span
						>
					</h2>
					<div class="grid grid-cols-5 gap-1">
						{#each cells as _, i}
							{@const answer = answers.charAt(i) || '_'}
							<div
								class="box-border grid aspect-square w-full grid-rows-3 rounded-lg text-center text-2xl font-bold text-snow-300 sm:text-3xl"
								class:border-charade-700={answer === '_'}
								class:border-2={answer === '_'}
								class:border-solid={answer === '_'}
								class:bg-charade-900={answer === '_'}
								class:bg-aurora-400={answer === 'x'}
								class:bg-aurora-300={answer === 'c'}
								class:bg-charade-700={answer === 'i'}
							/>
						{/each}
					</div>
				</div>
			{/each}
		</div>
		{#if !gameResults.length}
			<p class="rounded-xl p-2 text-center text-center text-xl text-snow-300">
				No wins in the last seven days...
			</p>
		{/if}
	{/await}
</main>
