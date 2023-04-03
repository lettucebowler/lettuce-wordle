<script lang="ts">
	import smallFavicon from '$lib/assets/favicon-16x16.png';
	import bigFavicon from '$lib/assets/favicon-32x32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import safariPinnedTabIcon from '$lib/assets/safari-pinned-tab.svg';
	import '$lib/assets/app.css';
	import { appName } from '$lib/util/store';
	import { getGameNum } from '$lib/util/share';
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
	<link rel="icon" type="image/png" sizes="32x32" href={bigFavicon} />
	<link rel="icon" type="image/png" sizes="16x16" href={smallFavicon} />
	<link rel="mask-icon" href={safariPinnedTabIcon} color="#a3be8c" />
	<meta name="description" content="Lettuce Wordle`" />
	<title>{$appName} #{getGameNum()}</title>
</svelte:head>

<div
	id="lettuce-wordle-root"
	class="mx-auto w-full max-w-screen-md"
	data-sveltekit-preload-data="hover"
>
	<slot />
</div>
