<script>
	import { appName } from '$lib/constants/app-constants';
</script>

<main class="grid gap-8">
	<h1 class="text-snow-300 text-center text-3xl font-bold">About {appName}</h1>
	<p class="text-snow-300 box-border px-4 text-left text-lg">
		I wrote this app because the real wordle got blocked on my work network and I wanted to keep
		playing and sharing scores with my coworkers.
	</p>
	<p class="text-snow-300 box-border px-4 text-left text-lg">
		This app was created using <a
			class="text-swamp-green-500"
			href="https://kit.svelte.dev"
			target="_blank">svelte-kit</a
		>. Code for this project can be found
		<a
			class="text-swamp-green-500"
			target="_blank"
			href="https://github.com/lettucebowler/lettuce-wordle">here</a
		>.
	</p>
</main>
