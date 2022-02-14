<script lang ts>
	import LettuceKey from '../components/LettuceKey.svelte';

	const r1 = [
		{
			key: 'Control',
			width: 1.25,
			enabled: false
		},
		{
			key: 'Super',
			width: 1.25,
			enabled: false
		},
		{
			key: 'Alt',
			width: 1.25,
			enabled: false
		},
		{
			key: 'Space',
			width: 6.25,
			enabled: false
		},
		{
			key: 'Alt',
			width: 1.25,
			enabled: false
		},
		{
			key: 'Super',
			width: 1.25,
			enabled: false
		},
		{
			key: 'Control',
			width: 1.25,
			enabled: false
		}
	];

	const r2 = [
		{
			key: 'Shift',
			width: 2.25,
			enabled: false
		},
		{
			key: 'z',
			width: 1,
			enabled: true
		},
		{
			key: 'x',
			width: 1,
			enabled: true
		},
		{
			key: 'c',
			width: 1,
			enabled: true
		},
		{
			key: 'v',
			width: 1,
			enabled: true
		},
		{
			key: 'b',
			width: 1,
			enabled: true
		},
		{
			key: 'n',
			width: 1,
			enabled: true
		},
		{
			key: 'm',
			width: 1,
			enabled: true
		},
		{
			key: ',',
			width: 1,
			enabled: false
		},
		{
			key: '.',
			width: 1,
			enabled: false
		},
		{
			key: '/',
			width: 1,
			enabled: false
		},
		{
			key: 'Shift',
			width: 2.75,
			enabled: false
		}
	];

	const r3 = [
		{
			key: 'Caps',
			width: 1.75,
			enabled: false
		},
		{
			key: 'a',
			width: 1,
			enabled: true
		},
		{
			key: 's',
			width: 1,
			enabled: true
		},
		{
			key: 'd',
			width: 1,
			enabled: true
		},
		{
			key: 'f',
			width: 1,
			enabled: true
		},
		{
			key: 'g',
			width: 1,
			enabled: true
		},
		{
			key: 'h',
			width: 1,
			enabled: true
		},
		{
			key: 'j',
			width: 1,
			enabled: true
		},
		{
			key: 'k',
			width: 1,
			enabled: true
		},
		{
			key: 'l',
			width: 1,
			enabled: true
		},
		{
			key: ';',
			width: 1,
			enabled: false
		},
		{
			key: "'",
			width: 1,
			enabled: false
		},
		{
			key: 'Enter',
			width: 2.25,
			enabled: true
		}
	];

	const r4 = [
		{
			key: 'Tab',
			width: 1.5,
			enabled: false
		},
		{
			key: 'q',
			width: 1,
			enabled: true
		},
		{
			key: 'w',
			width: 1,
			enabled: true
		},
		{
			key: 'e',
			width: 1,
			enabled: true
		},
		{
			key: 'r',
			width: 1,
			enabled: true
		},
		{
			key: 't',
			width: 1,
			enabled: true
		},
		{
			key: 'y',
			width: 1,
			enabled: true
		},
		{
			key: 'u',
			width: 1,
			enabled: true
		},
		{
			key: 'i',
			width: 1,
			enabled: true
		},
		{
			key: 'o',
			width: 1,
			enabled: true
		},
		{
			key: 'p',
			width: 1,
			enabled: true
		},
		{
			key: '[',
			width: 1,
			enabled: false
		},
		{
			key: ']',
			width: 1,
			enabled: false
		},
		{
			key: '\\',
			width: 1.5,
			enabled: false
		}
	];
</script>

<div class="border">
	<div class="board">
		<div class="r4">
			{#each r4 as key}
				<LettuceKey key={key.key} width={key.width} enabled={key.enabled} on:keyPress />
			{/each}
		</div>

		<div class="r3">
			{#each r3 as key}
				<LettuceKey key={key.key} width={key.width} enabled={key.enabled} on:keyPress />
			{/each}
		</div>

		<div class="r2">
			{#each r2 as key}
				<LettuceKey key={key.key} width={key.width} enabled={key.enabled} on:keyPress />
			{/each}
		</div>

		<div class="r1">
			{#each r1 as key}
				<LettuceKey key={key.key} width={key.width} enabled={key.enabled} on:keyPress />
			{/each}
		</div>
	</div>
</div>

<style>
	.board {
		display: grid;
		row-gap: 0px;

		grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
	}

	.r1 {
		aspect-ratio: 16;
		width: 100%;
		display: grid;

		grid-template-columns: 1.25fr 1.25fr 1.25fr 6.25fr 1.25fr 1.25fr 1.25fr;
		grid-template-rows: 1fr;
	}

	.r2 {
		width: 100%;
		aspect-ratio: 16;
		display: grid;
		grid-template-columns: 9fr 4fr 4fr 4fr 4fr 4fr 4fr 4fr 4fr 4fr 4fr 11fr;
	}

	.r3 {
		width: 100%;
		aspect-ratio: 16;
		display: grid;
		grid-template-columns: 1.75fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2.25fr;
	}

	.r4 {
		display: grid;
		grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.5fr;
	}
</style>
