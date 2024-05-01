<script lang="ts">
	let { icon = '', flip = false, dark = false } = $props();

	type Path = {
		path: string;
		fillRule?: 'evenodd' | 'inherit';
		clipRule?: 'evenodd' | 'inherit';
	};

	const pathMap: Map<string, Path[]> = new Map([
		[
			'home',
			[
				{
					path: 'M9 22H5a1 1 0 0 1-1-1V11l8-8 8 8v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1zm3-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M12.01 4.42l-8.3 8.3a1 1 0 1 1-1.42-1.41l9.02-9.02a1 1 0 0 1 1.41 0l8.99 9.02a1 1 0 0 1-1.42 1.41l-8.28-8.3z'
				},
				{
					path: 'M12.01 4.42l-8.3 8.3a1 1 0 1 1-1.42-1.41l9.02-9.02a1 1 0 0 1 1.41 0l8.99 9.02a1 1 0 0 1-1.42 1.41l-8.28-8.3z'
				}
			]
		],
		[
			'chevron-down',
			[
				{
					path: 'M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z',
					fillRule: 'evenodd',
					clipRule: 'evenodd'
				}
			]
		],
		[
			'trophy',
			[
				{
					path: 'M8 2h8a2 2 0 0 1 2 2v7a6 6 0 1 1-12 0V4c0-1.1.9-2 2-2z'
				},
				{
					path: 'M7 4v2H4v4c0 1.1.9 2 2 2h1v2H6a4 4 0 0 1-4-4V6c0-1.1.9-2 2-2h3zm10 2V4h3a2 2 0 0 1 2 2v4a4 4 0 0 1-4 4h-1v-2h1a2 2 0 0 0 2-2V6h-3zm-3 14h2a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2h2a1 1 0 0 0 1-1v-3h2v3a1 1 0 0 0 1 1z'
				}
			]
		],
		[
			'arrow-uturn-right',
			[
				{
					fillRule: 'evenodd',
					clipRule: 'evenodd',
					path: 'M14.47 2.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06l4.72-4.72H9a5.25 5.25 0 100 10.5h3a.75.75 0 010 1.5H9a6.75 6.75 0 010-13.5h10.19l-4.72-4.72a.75.75 0 010-1.06z'
				}
			]
		],
		[
			'backspace',
			[
				{
					fillRule: 'evenodd',
					clipRule: 'evenodd',
					path: 'M2.515 10.674a1.875 1.875 0 000 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 003-3V6.75a3 3 0 00-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374zM12.53 9.22a.75.75 0 10-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L15.31 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z'
				}
			]
		],
		[
			'menu',
			[
				{
					fillRul: 'evenodd',
					clipRule: 'evenodd',
					path: 'M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z'
				}
			]
		]
	]);
</script>

{#if pathMap.get(icon)?.length}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		class="aspect-square h-full w-full transition-transform"
		class:rotate-180={flip}
	>
		{#each pathMap.get(icon) || [] as path}
			<path
				d={path.path}
				fill-rule={path.fillRule || 'inherit'}
				clip-rule={path.clipRule || 'inherit'}
				class:fill-snow-100={!dark}
				class:fill-charade-50={dark}
			/>
		{/each}
	</svg>
{/if}
