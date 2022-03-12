<div class="center">
	<div class="page">
		<slot />
	</div>
</div>

<style>
	.page {
		aspect-ratio: 5 / 8.5;
		margin: 0 auto;
		/* background-color: var(--nord-11); */
		min-height: 100%;
		height: 100vh;
		max-height: 100vh;
		max-width: 100vw;
	}

	.center {
		margin: 0 0;
		display: flex;
	}
</style>
