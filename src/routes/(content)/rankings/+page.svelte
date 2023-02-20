<script lang="ts">
	import LettuceIcon from '$lib/components/Icon.svelte';
	import P from '$lib/components/P.svelte';
	import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';

	export let data: import('./$types').PageData;
	$: value = data.leaderboard.scores;
</script>

<main class="grid gap-8">
	<h1 class="text-center text-3xl font-bold text-snow-300">LeaderBoard</h1>
	<P>
		Score for one game is calculated as 7 minus the number of guesses taken. 1 guess is 6 points. 6
		guesses is 1 point. 10 guesses is -3 points. Total score is running total for the last 7 days.
		Highest wins.
	</P>
	<div class="grid w-full gap-2 text-snow-300">
		<div
			class="grid w-full grid-cols-[1fr,_50px] gap-4 rounded-lg bg-charade-600 p-2 text-xl font-medium sm:grid-cols-[1fr,_50px,_50px] sm:gap-8"
		>
			<div class="text-left">User</div>
			<div class="hidden text-center sm:grid">Score</div>
			<div class="text-right">Rank</div>
		</div>
		<!-- {#await data.leaderboard.scores}
			<div class="w-full flex items-center flex-col mt-10 gap-4">
				<svg
					class="animate-spin h-20 w-20 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
				<span class="text-snow-300 font-medium">Just a sec....</span>
			</div>
		{:then value} -->
			<div class="grid w-full gap-2">
				{#each value as score, i (i)}
					{@const position = value.filter((s) => s.score > score.score).length + 1}
					<a href={`/profile/${score.user}`} data-sveltekit-preload-data="hover">
						<div
							class="box-border grid w-full grid-cols-[1fr,_50px] gap-2 rounded-xl p-2 text-xl font-medium sm:grid-cols-[1fr,_50px,_50px] sm:gap-8"
							class:bg-charade-700={i % 2 == 1}
							class:bg-charade-800={i % 2 == 0}
						>
							<div class="flex w-max justify-start gap-2 text-left sm:gap-4">
								<span class="box-border w-max overflow-hidden rounded border-2"
									><LettuceAvatar name={score.user} /></span
								>
								<span class="grid items-center">
									{score.user}
								</span>
							</div>
							<div class="hidden items-center text-right sm:grid">
								{score.score}
							</div>
							<div class="flex flex-[0_0_2rem] items-center justify-end text-right text-snow-300">
								{#if position === 1}
									<span class="h-8"><LettuceIcon icon="trophy" /></span>
								{:else}
									#{position}
								{/if}
							</div>
						</div></a
					>
				{/each}
			</div>
		<!-- {/await} -->
	</div>
</main>
