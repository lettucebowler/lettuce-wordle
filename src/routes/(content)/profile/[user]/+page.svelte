<script lang="ts">
	import { infiniteScrollAction } from './actions.js';
	import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';
	import { fetcher } from 'itty-fetcher';
	import GameSummary from './GameSummary.svelte';
	import { browser } from '$app/environment';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import AuthForm from '$lib/components/AuthForm.svelte';

	let { data } = $props();

	async function getResults({ start }: { start: number }) {
		const api = fetcher({ base: window.location.origin });
		return api.get<{
			results: Array<{ gameNum: number; attempts: number; answers: string; userId: number }>;
			more: boolean;
			start: number;
			next: number;
		}>('/api/v1/game-results', { user: data.user, start });
		// return getNextPageAfter({ username: data.user, start });
	}

	let query = createInfiniteQuery(() => ({
		queryKey: ['game-results', data.user, data.start],
		initialPageParam: data.start,
		getNextPageParam(lastPage) {
			return lastPage.next ? lastPage.next : undefined;
		},
		queryFn: ({ pageParam }) => getResults({ start: pageParam }),
		initialData: {
			pageParams: [data.start],
			pages: [{ results: data.results, start: data.start, next: data.next }]
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false
	}));
</script>

<svelte:body
	use:infiniteScrollAction={{
		distance: 400,
		cb: query?.fetchNextPage,
		delay: 250,
		immediate: true,
		disabled: !data.next || data.start !== data.gameNum || !query.hasNextPage
	}}
/>
<main class="grid w-full gap-8">
	<div>
		<figure class="flex flex-col gap-2">
			{#each [data.user] as user (user)}
				<div class="mx-auto h-40 w-40">
					<LettuceAvatar name={user} />
				</div>
			{/each}
			<figcaption class="text-snow-300 text-center text-xl font-medium">
				{data.user}
			</figcaption>
		</figure>

		{#if data.session?.user?.login === data.user}
			<div class="flex justify-center">
				<AuthForm mode="logout"></AuthForm>
			</div>
		{/if}
	</div>

	<h1 class="text-snow-300 text-center text-3xl font-bold">Play History</h1>

	<div class="grid w-full grid-cols-2 gap-2 px-1 sm:grid-cols-3 sm:gap-3">
		{#if query.data}
			{#each query.data.pages ?? [] as page (page)}
				{#each page.results as gameResult (gameResult)}
					<div class="flex w-full flex-[1_1_200px] flex-col gap-2 rounded-2xl">
						<h2 class="text-snow-300 flex justify-between text-center text-xl font-medium">
							<span class="text-left">#{gameResult.gameNum}</span><span class="text-right"
								>{1 + 6 - gameResult.answers.length / 5} pts</span
							>
						</h2>
						<GameSummary answers={gameResult.answers} />
					</div>
				{:else}
					<div class="text-lg font-medium text-snow-300 text-center col-span-3">
						This user has no play history
					</div>
				{/each}
			{/each}
		{/if}
	</div>
	{#if browser && query.hasNextPage && data.start === data.gameNum}
		<div class="flex flex-col items-center gap-2">
			<svg
				class="text-snow-100 h-8 animate-spin"
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
			<p class="text-snow-100 text-center text-xl font-medium">loading...</p>
		</div>
	{:else if data.start < data.gameNum || !browser}
		<nav class="mx-4 flex justify-end gap-2">
			{#if data.start < data.gameNum}
				<a
					href="?start={data.gameNum}"
					title="Back to start"
					class="text-snow-300 text-lg font-medium">Back to start</a
				>
			{/if}
			{#if data.next}
				<a href="?start={data.next}" title="Next" class="text-snow-300 ml-auto text-lg font-medium"
					>Next</a
				>
			{/if}
		</nav>
	{/if}
</main>
<div class="h-2"></div>
