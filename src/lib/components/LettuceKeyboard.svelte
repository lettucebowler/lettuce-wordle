<script lang="ts">
	import LettuceKey from '$lib/components/LettuceKey.svelte';

	export let keyStatuses: {
		[x: string]: string;
	};
</script>

<div class="flex flex-col w-full gap-1 h-full justify-end">
	{#each [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], ['', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '', '', ''], ['', '', '', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter', 'delete']] as row}
		<div class="flex w-full flex-col justify-center flex-auto">
			<div class="grid gap-1 flex-auto grid-cols-[repeat(40,_0.25fr)]">
				{#each row as key}
					{#if key}
						<div class="col-span-4 place-items-center grid">
							<LettuceKey {key} status={keyStatuses[key]} on:letterTyped />
						</div>
					{:else}
						<div />
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</div>
