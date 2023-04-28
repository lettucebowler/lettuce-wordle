<script lang="ts">
	import { infiniteScrollAction } from 'svelte-legos';
	import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';
	import type { PageData } from './$types';
	import { fetcher } from 'itty-fetcher';
	import type { GameResult } from '$lib/types/gameresult';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	export let data: PageData;

	let fetchMore = true;
	async function getNextBatch() {
		if (!fetchMore) {
			return;
		}
		const searchParams = new URLSearchParams({
			count: '30',
			offset: `${gameResults.length + Number($page.url.searchParams.get('offset') || 0)}`
		});
		if ($page.url.searchParams.get('dbProvider')) {
			searchParams.set('dbProvider', $page.url.searchParams.get('dbProvider') || '');
		}
		const oldLength = gameResults.length;
		const fetchResult = (await fetcher().get(
			`/api/users/${data.profile.user}/game-results`,
			searchParams
		)) as { totalCount: number; results: GameResult[] };
		if (fetchResult?.results) {
			gameResults = gameResults.concat(fetchResult.results);
		}
		const newLength = gameResults.length;
		if (newLength - oldLength < 30) {
			fetchMore = false;
		}
	}
	$: gameResults = data.profile.gameResults;
</script>

<svelte:body
	use:infiniteScrollAction={{
		distance: 100,
		cb: getNextBatch,
		immediate: false,
		disabled: !fetchMore
	}}
/>
<main class="grid w-full gap-8">
	<figure class="flex flex-col gap-2">
		{#each [data.profile.user] as user (user)}
			<div class="mx-auto h-full overflow-hidden rounded-2xl">
				<LettuceAvatar name={user} size={256} />
			</div>
		{/each}
		<figcaption class="text-center text-2xl font-medium text-snow-300">
			{data.profile.user}
		</figcaption>
	</figure>

	<h1 class="text-center text-3xl font-bold text-snow-300">Play History</h1>

	<div class="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
		{#each gameResults.sort((a, b) => b.gamenum - a.gamenum) as gameResult (gameResult.gamenum)}
			{@const answers = gameResult.answers.split('').slice(-30).join('')}
			<div
				class="flex w-full flex-[1_1_200px] flex-col gap-2 rounded-2xl border-4 border-solid border-charade-700 p-2"
			>
				<h2 class="flex justify-between text-center text-xl font-medium text-snow-300">
					<span class="text-left">#{gameResult.gamenum}</span><span class="text-right"
						>{1 + 6 - gameResult.answers.length / 5} pts</span
					>
				</h2>
				<div class="grid grid-cols-5 gap-1">
					{#each [...Array(30).keys()] as i}
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
	{#if !data.profile.gameResults.length}
		<p class="rounded-xl p-2 text-center text-center text-xl text-snow-300">
			No wins in the last seven days...
		</p>
	{/if}
	{#if browser && fetchMore}
		<p class="rounded-xl p-2 text-center text-center text-xl text-snow-300">Loading...</p>
	{:else}
		<nav class="mx-4 flex justify-between gap-2">
			{#each [{ offset: data.prevOffset, title: 'Previous', enabled: data.currentOffset - 30 >= 0 }, { offset: data.nextOffset, title: 'Next', enabled: data.currentOffset + gameResults.length < data.profile.gameCount }] as offset}
				<a
					href="?offset={offset.offset}{data.dbProvider ? `&dbProvider=${data.dbProvider}` : ''}"
					title={offset.title}
					class="text-lg font-medium text-snow-300"
					class:invisible={!offset.enabled}>{offset.title}</a
				>
			{/each}
		</nav>
	{/if}

	<div class="h-5" />
</main>
