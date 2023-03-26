<script lang="ts">
	import AuthNav from '$lib/components/AuthNav.svelte';
	import smallFavicon from '$lib/assets/favicon-16x16.png';
	import bigFavicon from '$lib/assets/favicon-32x32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import safariPinnedTabIcon from '$lib/assets/safari-pinned-tab.svg';
	import '$lib/assets/app.css';
	import { appName } from '$lib/util/store';
	import { getGameNum } from '$lib/util/share';
	import type { UserProfile } from '$lib/types/auth';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	const user = data.session?.user as UserProfile;
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
	class="mx-auto box-border flex w-full max-w-screen-md flex-auto flex-col gap-2 p-1"
	data-sveltekit-preload-data="hover"
>
	<AuthNav links={data.nav} {user} />
	<slot />
</div>

<style>
	:global(body) {
		margin: 0px 0px;
		display: flex;
		flex-direction: column;
	}

	:global(#svelte) {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
	}

	:global(body) {
		min-height: 100%;
		overflow-y: overlay;
	}

	:global(body, html) {
		height: 100%;
	}

	:root {
		font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}
</style>
