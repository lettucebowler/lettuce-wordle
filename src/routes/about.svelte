<script>
	import { appName } from '$lib/util/store';
</script>

<svelte:head>
	<title>About {$appName}</title>
</svelte:head>

<main>
	<div class="card">
		<h1>Hello, I'm Grant!</h1>
		<p>
			I wrote this app because the real wordle got blocked on my work network and I wanted to keep
			playing and sharing scores with my coworkers.
		</p>
		<p>
			This app was created using <a href="https://kit.svelte.dev" target="_blank">svelte-kit</a>.
			Code for this project can be found
			<a target="_blank" href="https://github.com/lettucebowler/lettuce-wordle">here</a>.
		</p>
	</div>
</main>

<style>
	.card {
		justify-content: start;
		flex-direction: column;
		padding: 8px 32px;
		border-radius: 12px;
		color: var(--nord-4);
		background-color: var(--nord-1);
	}

	h1 {
		font-size: 3.75rem;
		text-align: center;
	}

	p {
		font-size: 1.5rem;
	}

	a {
		text-decoration: none;
		color: var(--nord-14);
	}
</style>
