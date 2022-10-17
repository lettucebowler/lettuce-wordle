<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import P from '$lib/components/P.svelte';

	export let data: import('./$types').PageData;
	$: scores = data.scores;
</script>

<div class="flex flex-col items-center justify-start">
	<div class="h-8" />
	<h1 class="text-center text-3xl font-bold text-snow-300">LeaderBoard</h1>
	<div class="h-8" />
	<div class="ml-4 mr-4">
		<P>
			Score for one game is calculated as 7 minus the number of guesses taken. 1 guess is 6 points.
			6 guesses is 1 point. 10 guesses is -3 points. Total score is running total for the last 7
			days. Highest wins.
		</P>
	</div>
	<div class="h-8" />
	<div class="grid w-full max-w-2xl gap-2 text-snow-300">
		<thead>
			<div class="grid w-full grid-cols-3 rounded-2xl bg-polar-400 p-2 text-xl font-medium">
				<div class="text-left">Rank</div>
				<div class="text-left">User</div>
				<div class="text-right">score</div>
			</div>
		</thead>
		<div class="grid gap-2">
			{#each scores as score, i (i)}
				{@const position = scores.filter((s) => s.score > score.score).length + 1}
				<a href={`/profile/${score.user}`}>
					<div
						class="grid w-full grid-cols-3 items-center rounded-2xl p-2 text-xl font-medium"
						class:bg-polar-300={i % 2 == 1}
						class:bg-polar-200={i % 2 == 0}
					>
						<div class="grid items-center text-left text-snow-300">
							{#if position === 1}
								<Icon name="trophy" size={8} />
							{:else}
								#{position}
							{/if}
						</div>
						<div class="text-left">{score.user}</div>
						<div class="text-right">{score.score}</div>
					</div></a
				>
			{/each}
		</div>
	</div>
</div>
