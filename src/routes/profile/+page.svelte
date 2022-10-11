<script lang="ts">
	import { getGameResults } from '$lib/client/planetscale';

	export let data: import('./$types').PageData;

	$: gameResults = data.gameResults;
	$: console.log(gameResults);
</script>

<h1 class="w-full text-center text-3xl text-snow-300">Nothing to see here</h1>

{#each gameResults as gameResult, i (gameResult.gamenum)}
	<div>
		<h2>{gameResult.gamenum}</h2>
		<p>{gameResult.answers}</p>
	</div>
{/each}
