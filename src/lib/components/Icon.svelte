<script lang="ts">
	export let icon = '';
	export let size: 8 | 10 | 12 = 10;

	import iconTrophy from '$lib/assets/icon-trophy.svg';
	import iconHome from '$lib/assets/icon-home.svg';
	import iconUser from '$lib/assets/icon-user.svg';
	import iconExternalWindow from '$lib/assets/icon-external-window.svg';
	import iconChevronDown from '$lib/assets/icon-chevron-down.svg';

	const icons = new Map([
		['home', iconHome],
		['trophy', iconTrophy],
		['user', iconUser],
		['external-window', iconExternalWindow],
		['chevron-down', iconChevronDown],
	]);

	const paths = new Map([
		[
			'home',
			{
				primary:
					'M9 22H5a1 1 0 0 1-1-1V11l8-8 8 8v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1zm3-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
				secondary:
					'M12.01 4.42l-8.3 8.3a1 1 0 1 1-1.42-1.41l9.02-9.02a1 1 0 0 1 1.41 0l8.99 9.02a1 1 0 0 1-1.42 1.41l-8.28-8.3z'
			}
		],
        [
            'trophy',
            {
                secondary: 'M8 2h8a2 2 0 0 1 2 2v7a6 6 0 1 1-12 0V4c0-1.1.9-2 2-2z',
                primary: 'M7 4v2H4v4c0 1.1.9 2 2 2h1v2H6a4 4 0 0 1-4-4V6c0-1.1.9-2 2-2h3zm10 2V4h3a2 2 0 0 1 2 2v4a4 4 0 0 1-4 4h-1v-2h1a2 2 0 0 0 2-2V6h-3zm-3 14h2a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2h2a1 1 0 0 0 1-1v-3h2v3a1 1 0 0 0 1 1z'
            }
        ],
        ['arrow-uturn-right', {
            primary: 'M14.47 2.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06l4.72-4.72H9a5.25 5.25 0 100 10.5h3a.75.75 0 010 1.5H9a6.75 6.75 0 010-13.5h10.19l-4.72-4.72a.75.75 0 010-1.06z'
        }]
	]);

	console.log(paths.get(icon));
</script>

<!-- <img
	alt={icon}
	src={icons.get(icon)}
	class="m-0 inline flex justify-center"
	class:w-8={size === 8}
	class:h-8={size === 8}
	class:w-10={size === 10}
	class:h-10={size === 10}
	class:w-12={size === 12}
	class:h-12={size === 12}
/> -->

<!-- {#if paths.get(icon)} -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class={`w-${size} h-${size}`}>
	<path d={paths.get(icon)?.primary} class="fill-snow-100" />
	{#if paths.get(icon)?.secondary}
		<path d={paths.get(icon)?.secondary} class="fill-snow-300" />
	{/if}
</svg>
<!-- {/if} -->
