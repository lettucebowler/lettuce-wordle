<script lang="ts">
	import smallFavicon from '$lib/assets/favicon-16x16.png';
	import bigFavicon from '$lib/assets/favicon-32x32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import safariPinnedTabIcon from '$lib/assets/safari-pinned-tab.svg';
	import { appName } from '$lib/constants/app-constants';
	import { getGameNum } from '$lib/util/words';
	import AuthNav from './AuthNav.svelte';
	import '$lib/assets/app.css';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
	<link rel="icon" type="image/png" sizes="32x32" href={bigFavicon} />
	<link rel="icon" type="image/png" sizes="16x16" href={smallFavicon} />
	<link rel="mask-icon" href={safariPinnedTabIcon} color="#a3be8c" />
	<meta name="description" content="Lettuce Wordle`" />
	<title>{appName} #{getGameNum()}</title>
</svelte:head>

<div
	id="lettuce-wordle-root"
	class="mx-auto flex w-full max-w-screen-md flex-auto flex-col p-2 sm:p-1 sm:pb-4 sm:pt-4"
	data-sveltekit-preload-data="hover"
>
	<AuthNav links={data.nav} user={data.session?.user} />
	{@render children()}
</div>

<style>
	:global(body) {
		margin-left: calc(100vw - 100%);
	}
</style>
