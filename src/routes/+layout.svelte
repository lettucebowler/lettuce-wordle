<script lang="ts">
	import smallFavicon from '$lib/assets/favicon-16x16.png';
	import bigFavicon from '$lib/assets/favicon-32x32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import safariPinnedTabIcon from '$lib/assets/safari-pinned-tab.svg';
	import { appName } from '$lib/constants/app-constants';
	import AuthNav from './AuthNav.svelte';
	import '$lib/assets/app.css';
	import { invalidate, onNavigate } from '$app/navigation';

	let { data, children } = $props();

	onNavigate(() => {
		invalidate('data:gamenum');
	});
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
	<link rel="icon" type="image/png" sizes="32x32" href={bigFavicon} />
	<link rel="icon" type="image/png" sizes="16x16" href={smallFavicon} />
	<link rel="mask-icon" href={safariPinnedTabIcon} color="#a3be8c" />
	<meta name="description" content="Lettuce Wordle`" />
	<title>{appName} #{data.gameNum}</title>
</svelte:head>

<div
	id="lettuce-wordle-root"
	class="mx-auto flex w-full max-w-(--breakpoint-md) flex-auto flex-col gap-2 p-2 sm:gap-4 sm:p-1 sm:pt-4 sm:pb-4"
	data-sveltekit-preload-data="hover"
>
	<AuthNav links={data.nav} user={data.session?.user} />
	{@render children()}
</div>
