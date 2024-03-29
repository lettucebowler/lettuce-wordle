<script lang="ts">
	import { infiniteScrollAction } from './actions.js';
	import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';
	import { fetcher } from 'itty-fetcher';
	import { browser } from '$app/environment';
	import type { GameResult } from '$lib/types/gameresult.js';

	export let data;

	let items = data.results;
	let fetchMore = data.more;

	async function getNextPage() {
		const newItems = await fetcher({ base: window.location.origin }).get<{
			results: GameResult[];
			more: boolean;
		}>('/api/v1/game-results', { user: data.user, page: data.page + items.length / 30 });
		if (!newItems.more) {
			fetchMore = false;
		}
		items = [...items, ...newItems.results];
	}
	import { cx } from 'classix';
</script>

<svelte:body
	use:infiniteScrollAction={{
		distance: 100,
		cb: getNextPage,
		delay: 100,
		immediate: false,
		disabled: !fetchMore
	}}
/>
<main class="grid w-full gap-8">
	<figure class="flex flex-col gap-2">
		{#each [data.user] as user (user)}
			<div class="mx-auto h-full max-h-[10rem] sm:h-full">
				<LettuceAvatar name={user} size={256} />
			</div>
		{/each}
		<figcaption class="text-center text-xl font-medium text-snow-300">
			{data.user}
		</figcaption>
	</figure>

	<h1 class="text-center text-3xl font-bold text-snow-300">Play History</h1>

	<div class="grid w-full grid-cols-2 gap-2 px-1 sm:grid-cols-3 sm:gap-3">
		{#each items as gameResult (gameResult.gameNum)}
			{@const answers = gameResult.answers}
			<div class="flex w-full flex-[1_1_200px] flex-col gap-2 rounded-2xl">
				<h2 class="flex justify-between text-center text-xl font-medium text-snow-300">
					<span class="text-left">#{gameResult.gameNum}</span><span class="text-right"
						>{1 + 6 - gameResult.answers.length / 5} pts</span
					>
				</h2>
				<div class="grid grid-cols-5 gap-1">
					{#each [...Array(30).keys()] as i}
						{@const answer = answers.charAt(i) || '_'}
						<div
							class={cx(
								'aspect-square w-full rounded-lg',
								answer === '_' &&
									'bg-charade-950 shadow-[inset_0_1px_4px_0_rgb(0_0_0_/_0.2),_inset_0_-1px_0_0_theme(colors.charade.800)]',
								answer !== '_' && 'shadow-[0_4px_4px_0_rgb(0_0_0_/_0.2)]',
								answer === 'x' && 'border-t-[1px] border-t-swamp-green-300 bg-swamp-green-500',
								answer === 'c' && 'border-t-[1px] border-t-putty-300 bg-putty-500',
								answer === 'i' && 'border-t-[1px] border-t-charade-600 bg-charade-800'
							)}
							class:bg-charade-800={answer === 'i'}
						/>
					{/each}
				</div>
			</div>
		{:else}
			<p class="rounded-xl p-2 text-center text-center text-xl text-snow-300 col-span-3">
				No wins in the last seven days...
			</p>
		{/each}
	</div>
	{#if browser && fetchMore}
		<div class="flex flex-col items-center gap-2">
			<svg
				class="h-8 animate-spin text-snow-100"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="text-charade-800"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			<p class="text-center text-xl font-medium text-snow-100">loading...</p>
		</div>
	{:else if !browser && (data.page > 1 || data.more)}
		<nav class="mx-4 flex justify-between gap-2">
			{#if data.page > 1}
				<a href="?page={data.page - 1}" title="Previous" class="text-lg font-medium text-snow-300"
					>Previous</a
				>
			{/if}
			{#if data.more}
				<a
					href="?page={data.page + 1}"
					title="Next"
					class="ml-auto text-lg font-medium text-snow-300">Next</a
				>
			{/if}
		</nav>
	{/if}
	<div class="h-5" />
</main>
