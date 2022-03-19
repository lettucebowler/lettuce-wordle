<script lang="ts">
	import { Status } from '$lib/types/types';
	import LettuceKey from '$lib/components/LettuceKey.svelte';

	export let keyStatuses: {
		[x: string]: Status;
	};

	const r1 = [
		{
			enabled: false,
			width: 1.25
		},
		{
			key: 'Enter',
			width: 2,
			enabled: true
		},
		{
			key: 'Backspace',
			width: 3,
			enabled: true
		}
	];

	$: r2 = [
		{
			width: 0.75,
			enabled: false
		},
		{
			key: 'z',
			width: 1,
			enabled: true,
			status: keyStatuses['z']
		},
		{
			key: 'x',
			width: 1,
			enabled: true,
			status: keyStatuses['x']
		},
		{
			key: 'c',
			width: 1,
			enabled: true,
			status: keyStatuses['c']
		},
		{
			key: 'v',
			width: 1,
			enabled: true,
			status: keyStatuses['v']
		},
		{
			key: 'b',
			width: 1,
			enabled: true,
			status: keyStatuses['b']
		},
		{
			key: 'n',
			width: 1,
			enabled: true,
			status: keyStatuses['n']
		},
		{
			key: 'm',
			width: 1,
			enabled: true,
			status: keyStatuses['m']
		}
	];

	$: r3 = [
		{
			key: '',
			width: 0.25,
			enabled: false,
			status: Status.NONE
		},
		{
			key: 'a',
			width: 1,
			enabled: true,
			status: keyStatuses['a']
		},
		{
			key: 's',
			width: 1,
			enabled: true,
			status: keyStatuses['s']
		},
		{
			key: 'd',
			width: 1,
			enabled: true,
			status: keyStatuses['d']
		},
		{
			key: 'f',
			width: 1,
			enabled: true,
			status: keyStatuses['f']
		},
		{
			key: 'g',
			width: 1,
			enabled: true,
			status: keyStatuses['g']
		},
		{
			key: 'h',
			width: 1,
			enabled: true,
			status: keyStatuses['h']
		},
		{
			key: 'j',
			width: 1,
			enabled: true,
			status: keyStatuses['j']
		},
		{
			key: 'k',
			width: 1,
			enabled: true,
			status: keyStatuses['k']
		},
		{
			key: 'l',
			width: 1,
			enabled: true,
			status: keyStatuses['l']
		}
	];

	$: r4 = [
		{
			key: 'q',
			width: 1,
			enabled: true,
			status: keyStatuses['q']
		},
		{
			key: 'w',
			width: 1,
			enabled: true,
			status: keyStatuses['w']
		},
		{
			key: 'e',
			width: 1,
			enabled: true,
			status: keyStatuses['e']
		},
		{
			key: 'r',
			width: 1,
			enabled: true,
			status: keyStatuses['r']
		},
		{
			key: 't',
			width: 1,
			enabled: true,
			status: keyStatuses['t']
		},
		{
			key: 'y',
			width: 1,
			enabled: true,
			status: keyStatuses['y']
		},
		{
			key: 'u',
			width: 1,
			enabled: true,
			status: keyStatuses['u']
		},
		{
			key: 'i',
			width: 1,
			enabled: true,
			status: keyStatuses['i']
		},
		{
			key: 'o',
			width: 1,
			enabled: true,
			status: keyStatuses['o']
		},
		{
			key: 'p',
			width: 1,
			enabled: true,
			status: keyStatuses['p']
		}
	];
</script>

<div class="board">
	<div class="r4">
		{#each r4 as key}
			<LettuceKey
				key={key.key}
				width={key.width}
				enabled={key.enabled}
				status={key.status}
				on:keyPress
			/>
		{/each}
	</div>

	<div class="r3">
		{#each r3 as key}
			<LettuceKey
				key={key.key}
				width={key.width}
				enabled={key.enabled}
				status={key.status}
				on:keyPress
			/>
		{/each}
	</div>

	<div class="r2">
		{#each r2 as key}
			<LettuceKey
				key={key.key}
				width={key.width}
				enabled={key.enabled}
				status={key.status}
				on:keyPress
			/>
		{/each}
	</div>

	<div class="r1">
		{#each r1 as key}
			<LettuceKey key={key.key} width={key.width} enabled={key.enabled} on:keyPress />
		{/each}
		<LettuceKey key="Share" width={2} enabled={true} on:keyPress />
	</div>
</div>

<style>
	.board {
		display: grid;
		row-gap: 0px;
		grid-template-rows: 1fr 1fr 1fr 1fr;
		aspect-ratio: 5 / 2;
		width: 100%;
	}

	.r1 {
		width: 100%;
		display: grid;
		grid-template-columns: 1.25fr 2fr 3fr 2fr 1.75fr;
	}

	.r2 {
		width: 100%;
		display: grid;
		grid-template-columns: 0.75fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2.25fr;
	}

	.r3 {
		width: 100%;
		display: grid;
		grid-template-columns: 0.25fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.75fr;
	}

	.r4 {
		display: grid;
		width: 100%;
		height: 100%;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
	}
</style>
