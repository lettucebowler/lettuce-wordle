<script lang="ts">
	import LettuceKey from '$lib/components/LettuceKey.svelte';

	export let keyStatuses: {
		[x: string]: string;
	};
</script>

<div class="board">
	<div class="grow">
		<div class="row">
			{#each ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'] as key}
				<div class="key">
					<LettuceKey {key} status={keyStatuses[key]} on:letterTyped />
				</div>
			{/each}
		</div>
	</div>
	<div class="grow">
		<div class="row">
			<div />
			{#each ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'] as key}
				<div class="key">
					<LettuceKey {key} status={keyStatuses[key]} on:letterTyped />
				</div>
			{/each}
			<div />
			<div />
			<div />
		</div>
	</div>
	<div class="grow">
		<div class="row">
			<div />
			<div />
			<div />
			{#each ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter', 'delete'] as key}
				<div class="key">
					<LettuceKey {key} status={keyStatuses[key]} on:letterTyped />
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.grow {
		display: flex;
		flex: 1 1 auto;
		width: 100%;
		flex-direction: column;
		justify-content: center;
	}

	.board {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 4px;
		height: 100%;
		justify-content: flex-end;
	}

	.row {
		display: grid;
		gap: 4px;
		grid-template-columns: repeat(40, 0.25fr);
		flex: 1 1 auto;
	}

	.key {
		grid-column: span 4;
		place-items: center;
		display: grid;
	}
</style>
