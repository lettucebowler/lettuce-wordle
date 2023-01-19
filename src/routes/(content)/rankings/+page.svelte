<script lang="ts">
	import LettuceIcon from '$lib/components/Icon.svelte';
	import P from '$lib/components/P.svelte';

	export let data: import('./$types').PageData;
	$: scores = data.scores;
</script>

<main class="grid gap-8">
	<h1 class="text-center text-3xl font-bold text-snow-300">LeaderBoard</h1>
	<P>
		Score for one game is calculated as 7 minus the number of guesses taken. 1 guess is 6 points. 6
		guesses is 1 point. 10 guesses is -3 points. Total score is running total for the last 7 days.
		Highest wins.
	</P>
	<div class="grid w-full gap-2 text-snow-300">
		<div class="grid grid-cols-3 rounded-lg bg-charade-600 p-2 text-xl font-medium">
			<div class="text-left">Rank</div>
			<div class="text-center">User</div>
			<div class="text-right">score</div>
		</div>
		<div class="grid gap-2">
			{#each scores as score, i (i)}
				{@const position = scores.filter((s) => s.score > score.score).length + 1}
				<a href={`/profile/${score.user}`} data-sveltekit-preload-data="hover">
					<div
						class="grid w-full grid-cols-3 gap-4 rounded-lg py-1 px-2 text-xl font-medium"
						class:bg-charade-700={i % 2 == 1}
						class:bg-charade-800={i % 2 == 0}
					>
						<div class="flex flex-[0_0_2rem] items-center text-left text-snow-300">
							{#if position === 1}
								<span class="h-8"><LettuceIcon icon="trophy" /></span>
							{:else}
								#{position}
							{/if}
						</div>

						<div class="flex justify-start gap-4 text-left">
							<img
								alt="profile icon"
								src={`https://avatars.githubusercontent.com/u/${score.userId}?v=4`}
								class="aspect-square h-full h-10 rounded"
							/>
							<div class="grid items-center">
								{score.user}
							</div>
						</div>

						<div class="grid items-center text-right">
							{score.score}
						</div>
					</div></a
				>
			{/each}
		</div>
	</div>
</main>
