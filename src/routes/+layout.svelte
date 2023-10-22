<script lang="ts">
	import smallFavicon from '$lib/assets/favicon-16x16.png';
	import bigFavicon from '$lib/assets/favicon-32x32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import safariPinnedTabIcon from '$lib/assets/safari-pinned-tab.svg';
	import '$lib/assets/app.css';
	import { appName } from '$lib/constants/app-constants';
	import { getGameNum } from '$lib/util/share';
	import AuthNav from './AuthNav.svelte';
	export let data;
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
	class="mx-auto flex w-full max-w-screen-md flex-auto flex-col p-1"
	data-sveltekit-preload-data="hover"
>
	<AuthNav links={data.nav} user={data?.session?.user} />
	<slot />
</div>
