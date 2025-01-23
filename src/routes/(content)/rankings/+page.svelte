<script lang="ts">
	import FireIcon from '$lib/components/FireIcon.svelte';
	import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';
	import Spinner from '../Spinner.svelte';
	let { data } = $props();
</script>

<main class="grid gap-8">
	<h1 class="text-center text-3xl font-bold text-snow-300">LeaderBoard</h1>
	<p class="box-border px-4 text-left text-lg text-snow-300">
		Each successful game earns 1 point, plus a bonus point for the number of guesses under 6 it took
		to guess the word. 6 guesses is 1 point. 5 guesses is 2 points, etc. Score below is total of
		last 7 days.
	</p>
	{#await data.rankings}
		<Spinner />
	{:then rankings}
		<div class="table w-full text-snow-200 sm:text-xl">
			<div class="table-header-group">
				<div class="table-row gap-2 font-bold">
					<div class="table-cell rounded-tl-xl p-4 font-bold capitalize sm:bg-charade-700">
						rank
					</div>
					<div class="p-y-4 table-cell px-2 font-bold capitalize sm:bg-charade-700">user</div>
					<div
						class="table-cell rounded-tr-xl p-4 text-center font-bold capitalize sm:bg-charade-700"
					>
						score
					</div>
				</div>
			</div>
			<div class="table-row-group">
				{#each rankings as ranking, i (i)}
					{@const position = rankings.filter((s) => s.score > ranking.score).length + 1}

					<a
						class="group table-row cursor-pointer hover:bg-charade-800 hover:brightness-90 sm:bg-charade-950"
						href={`/profile/${ranking.user}`}
					>
						<div
							class="border-box mx-auto table-cell border-t border-charade-700 py-4 text-left group-last:rounded-bl-xl sm:p-2 sm:pl-4"
						>
							#{position}
						</div>
						<div class="border-box table-cell border-t border-charade-700 py-4 text-left sm:p-2">
							<div class="flex gap-2 sm:gap-4">
								<span class="box-border h-11 w-max overflow-hidden rounded-sm"
									><LettuceAvatar name={ranking.user} /></span
								>
								<span class="grid items-center">
									{ranking.user}
								</span>
								{#if position === 1}
									<div class="my-auto size-6 animate-pulse text-antique-brass-500">
										<FireIcon />
									</div>
								{/if}
							</div>
						</div>
						<div
							class="border-box mx-auto table-cell w-[2ch] border-t border-charade-700 py-4 text-right group-last:rounded-br-xl sm:p-2 sm:pr-4"
						>
							{ranking.score}
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/await}
</main>
