<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Trophy } from '@steeze-ui/heroicons';
	import P from '$lib/components/P.svelte';

	export let data: import('./$types').PageData;
	$: scores = data.scores;
</script>

<main class="mt-8 grid gap-8">
	<h1 class="text-center text-3xl font-bold text-snow-300">LeaderBoard</h1>
	<P>
		Score for one game is calculated as 7 minus the number of guesses taken. 1 guess is 6 points. 6
		guesses is 1 point. 10 guesses is -3 points. Total score is running total for the last 7 days.
		Highest wins.
	</P>
	<div class="grid w-full gap-2 text-snow-300">
		<div class="grid grid-cols-3 rounded-2xl bg-polar-400 p-2 text-xl font-medium">
			<div class="text-left">Rank</div>
			<div class="text-left">User</div>
			<div class="text-right">score</div>
		</div>
		<div class="grid gap-2">
			{#each scores as score, i (i)}
				{@const position = scores.filter((s) => s.score > score.score).length + 1}
				<a href={`/profile/${score.user}`} data-sveltekit-prefetch>
					<div
						class="grid w-full grid-cols-3 items-center rounded-2xl p-2 text-xl font-medium"
						class:bg-polar-300={i % 2 == 1}
						class:bg-polar-200={i % 2 == 0}
					>
						<div class="grid items-center text-left text-snow-300">
							{#if position === 1}
								<Icon src={Trophy} theme="solid" class="h-8 w-8" />
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
</main>
