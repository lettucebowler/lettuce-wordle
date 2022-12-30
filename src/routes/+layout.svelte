<script lang="ts">
	import AuthNav from '$lib/components/AuthNav.svelte';
	import smallFavicon from '$lib/assets/favicon-16x16.png';
	import bigFavicon from '$lib/assets/favicon-32x32.png';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import safariPinnedTabIcon from '$lib/assets/safari-pinned-tab.svg';
	import '$lib/assets/app.css';

	export let data: import('./$types').LayoutData = {
		session: null,
		nav: []
	};
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
	<link rel="icon" type="image/png" sizes="32x32" href={bigFavicon} />
	<link rel="icon" type="image/png" sizes="16x16" href={smallFavicon} />
	<link rel="mask-icon" href={safariPinnedTabIcon} color="#a3be8c" />
	<meta name="description" content="Lettuce Wordle`" />
</svelte:head>

<div class="mx-auto box-border flex flex w-full max-w-screen-md flex-auto flex-col gap-2 p-1">
	<AuthNav links={data.nav} user={data?.session?.user} />
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

	:global(body, html) {
		height: 100%;
		min-height: 100%;
		overflow-y: overlay;
	}

	:global(::-webkit-scrollbar) {
		width: 16px;
		height: 1em;
	}

	:global(::-webkit-scrollbar-track) {
		background: transparent;
		border-radius: 100vw;
		margin-block: 4px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: #4c566a;
		border: 0.25em solid #2e3440;
		border-radius: 100vw;
	}
</style>
