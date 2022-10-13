<script>
	import { appName } from '$lib/util/store';
	import P from '$lib/components/P.svelte';
	import A from '$lib/components/A.svelte';
</script>

<svelte:head>
	<title>About {$appName}</title>
</svelte:head>

<main class="text-md ml-4 mr-4 text-snow-300">
	<h1 class="m-0 text-center text-3xl font-bold">Hello, I'm Grant!</h1>
	<P>
		I wrote this app because the real wordle got blocked on my work network and I wanted to keep
		playing and sharing scores with my coworkers.
	</P>
	<P>
		This app was created using <A href="https://kit.svelte.dev" target="_blank">svelte-kit</A>. Code
		for this project can be found
		<A target="_blank" href="https://github.com/lettucebowler/lettuce-wordle">here</A>.
	</P>
</main>
