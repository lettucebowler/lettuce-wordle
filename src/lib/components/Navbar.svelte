<script lang="ts">
	import { page } from '$app/stores';
	import classnames from 'classnames';
	export let links: { path: string; name: string }[] = [];

	const linkStyle =
		'text-snow-300 text-3xl text-center pt-1 pb-1 pl-2 pr-2 box-border grid place-items-center h-12 rounded-md hover:bg-polar-300 active:bg-polar-200 transition ease-in-out duration-150';
</script>

<nav class="flex flex-row gap-2 p-2 h-16 box-border bg-polar-400 justify-center rounded-b-2xl">
	{#each links as link}
		<a
			sveltekit:prefetch
			href={link.path}
			class={classnames(linkStyle, { 'bg-polar-300': $page.url.pathname === link.path })}
		>
			{link.name}
		</a>
	{/each}
</nav>
