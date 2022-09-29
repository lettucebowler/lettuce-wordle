<script lang="ts">
	import { page } from '$app/stores';
	export let links: { path: string; name: string }[] = [];
</script>

<nav class="box-border flex h-16 flex-row justify-center gap-2 rounded-b-2xl bg-polar-400 p-2">
	{#each links as link}
		<a
			data-sveltekit-prefetch
			href={link.path}
			class="box-border grid h-12 place-items-center rounded-md pt-1 pb-1 pl-2 pr-2 text-center text-3xl text-snow-300 transition duration-150 ease-in-out hover:bg-polar-300 active:bg-polar-200"
			class:bg-polar-300={$page.url.pathname === link.path}
		>
			{link.name}
		</a>
	{/each}
</nav>
