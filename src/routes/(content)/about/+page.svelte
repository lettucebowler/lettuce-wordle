<script>
	import { appName } from '$lib/constants/app-constants';
</script>

<main class="grid gap-8">
	<h1 class="text-center text-3xl font-bold text-snow-300">About {appName}</h1>
	<p class="box-border px-4 text-left text-lg text-snow-300">
		I wrote this app because the real wordle got blocked on my work network and I wanted to keep
		playing and sharing scores with my coworkers.
	</p>
	<p class="box-border px-4 text-left text-lg text-snow-300">
		This app was created using <a
			class="text-aurora-400"
			href="https://kit.svelte.dev"
			target="_blank">svelte-kit</a
		>. Code for this project can be found
		<a
			class="text-aurora-400"
			target="_blank"
			href="https://github.com/lettucebowler/lettuce-wordle">here</a
		>.
	</p>
</main>
