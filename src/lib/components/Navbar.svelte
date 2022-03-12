<script lang="ts">
	import '$lib/styles/app.css';
	import { page } from '$app/stores';
    export let links: {path: string, name: string}[] = [];
</script>

<nav>
    {#each links as link}
        <a sveltekit:prefetch href="{link.path}" class={$page.url.pathname === `${link.path}` ? 'current' : ''}>{link.name}</a>
    {/each}
</nav>

<style>
	a {
		color: var(--nord-6);
		text-align: center;
		font-size: 1.5rem;
		padding: 8px 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		margin: 4px 4px;
		border-radius: 9px;
	}

	a:hover {
		color: var(--nord-4);
		background-color: var(--nord-1);
	}

	.current {
		background-color: var(--nord-0);
	}

	.current:hover {
		background-color: var(--nord-0);
	}

	a:active {
		background-color: var(--nord-0);
	}

	nav {
		display: flex;
		justify-content: center;
		background-color: var(--nord-2);
		height: calc((100 / 8.5)vh - 8px);
		aspect-ratio: 11;
		border-radius: 4px;
		margin: 2px 2px;
	}
</style>
