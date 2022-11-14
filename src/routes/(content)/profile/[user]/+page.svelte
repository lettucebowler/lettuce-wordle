<script lang="ts">
	import P from '$lib/components/P.svelte';
	import type { WordLettuceUser } from '$lib/client/oauth';
	export let data: import('./$types').PageData;

	let userProfile: WordLettuceUser;
	const cells = Array(30);

	$: gameResults = data.gameResults;
	$: userProfile = data.userProfile;
</script>

<main class="grid w-full gap-8">
	<figure class="flex flex-col gap-2">
		<img
			class="mx-auto aspect-square h-[360px] rounded-xl object-contain"
			src={userProfile.avatar}
			alt={userProfile.login}
		/>
		<figcaption class="text-center text-2xl font-medium text-snow-300">
			{userProfile.login}
		</figcaption>
	</figure>
	{#if userProfile.bio}
		<P>
			{userProfile.bio}
		</P>
	{/if}

	<h1 class="text-center text-3xl font-bold text-snow-300">Play History</h1>

	<div class="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
		{#each gameResults.sort((a, b) => b.gamenum - a.gamenum) as gameResult (gameResult.gamenum)}
			{@const answers = gameResult.answers.split('').slice(-30).join('')}
			<div
				class="flex w-full flex-[1_1_200px] flex-col gap-2 rounded-2xl border-4 border-solid border-polar-300 p-2"
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
	{#if !gameResults.length}
		<p class="rounded-xl p-2 text-center text-center text-xl text-snow-300">
			No wins in the last seven days...
		</p>
	{/if}
</main>
