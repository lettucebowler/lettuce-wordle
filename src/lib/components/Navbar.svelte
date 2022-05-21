<script lang="ts">
	import { page } from '$app/stores';
	export let links: { path: string; name: string }[] = [];
</script>

<nav>
	{#each links as link}
		<a
			sveltekit:prefetch
			href={link.path}
			class={$page.url.pathname === `${link.path}` ? 'current' : ''}>{link.name}</a
		>
	{/each}
</nav>

<style>
	a {
		color: var(--nord-6);
		text-align: center;
		font-size: 1.5rem;
		padding: 0.25rem 0.5rem;
		box-sizing: border-box;
		display: grid;
		place-items: center;
		height: 3rem;
		text-decoration: none;
		border-radius: 6px;
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
		gap: 0.5rem;
		justify-content: center;
		background-color: var(--nord-2);
		padding: 0.5rem;
		height: 4rem;
		box-sizing: border-box;
		border-radius: 0px 0px 12px 12px;
	}
</style>
