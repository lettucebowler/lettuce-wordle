<script lang="ts">
	import LettuceIcon from '$lib/components/Icon.svelte';
	import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';
	import Spinner from '../Spinner.svelte';
	export let data;
</script>

<main class="grid gap-8">
	<h1 class="text-center text-3xl font-bold text-snow-300">LeaderBoard</h1>
	<p class="box-border px-4 text-left text-lg text-snow-300">
		Each successful game earns 1 point, plus a bonus point for the number of guesses under 6 it took
		to guess the word. 6 guesses is 1 point. 5 guesses is 2 points, etc.
	</p>
	{#await data.leaderboard.scores}
		<Spinner />
	{:then scores}
		<div class="grid w-full gap-2 text-snow-300">
			<div
				class="grid w-full grid-cols-[1fr,_50px] gap-4 rounded-lg bg-charade-700 p-2 text-xl font-medium sm:grid-cols-[1fr,_50px,_50px] sm:gap-8"
			>
				<div class="text-left">User</div>
				<div class="hidden text-center sm:grid">Score</div>
				<div class="text-right">Rank</div>
			</div>
			<div class="grid w-full gap-2">
				{#each scores.rankings as score, i (i)}
					{@const position = scores.rankings.filter((s) => s.score > score.score).length + 1}
					<a href={`/profile/${score.user}`}>
						<div
							class="box-border grid w-full grid-cols-[1fr,_50px] gap-2 rounded-xl p-2 pr-4 text-xl font-medium sm:grid-cols-[1fr,_50px,_50px] sm:gap-8"
							class:bg-charade-800={i % 2 == 1}
							class:bg-charade-950={i % 2 == 0}
						>
							<div class="flex w-max justify-start gap-2 text-left sm:gap-4">
								<span class="box-border w-max overflow-hidden rounded"
									><LettuceAvatar name={score.user} size={44} /></span
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
		</div>
	{/await}
</main>
