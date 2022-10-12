<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	export let data: import('./$types').PageData;
	$: scores = data.scores;
</script>

<div class="flex flex-col items-center justify-start">
	<div class="h-8" />
	<h1 class="text-center text-3xl font-bold text-snow-300">LeaderBoard</h1>
	<div class="h-8" />
	<p class="pr-4 pl-4 text-center font-medium text-snow-300">
		Score for one game is calculated as 7 - guesses taken. 1 guess => 6 points. 6 guesses - 1 point.
		10 guesses => -3 points. Total score is running total for the last 7 days. Highest wins.
	</p>
	<div class="h-8" />
	<table class="grid w-full max-w-2xl gap-2 text-snow-300">
		<thead>
			<tr class="grid w-full grid-cols-3 rounded-2xl bg-polar-400 p-2 text-xl font-medium">
				<td class="text-left">Rank</td>
				<td class="text-left">User</td>
				<td class="text-right">score</td>
			</tr>
		</thead>
		<tbody class="grid gap-2">
			{#each scores as score, i (i)}
				{@const position = i + 1}
				<a href={`/profile/${score.user}`}>
					<tr
						class="grid w-full grid-cols-3 items-center rounded-2xl p-2 text-xl font-medium"
						class:bg-polar-300={i % 2 == 1}
						class:bg-polar-200={i % 2 == 0}
					>
						<td class="grid items-center text-left text-snow-300"
							>{#if position === 1}
								<Icon name="trophy" size={8} />
							{:else}
								#{position}
							{/if}</td
						>
						<td class="text-left">{score.user}</td>
						<td class="text-right">{score.sum}</td>
					</tr></a
				>
			{/each}
		</tbody>
	</table>
</div>
