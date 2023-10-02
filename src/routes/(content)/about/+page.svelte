<script>
	import { appName } from '$lib/constants/app-constants';
	import P from '$lib/components/P.svelte';
	import A from '$lib/components/A.svelte';
</script>

<main class="grid gap-8">
	<h1 class="text-center text-3xl font-bold text-snow-300">About {appName}</h1>
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
