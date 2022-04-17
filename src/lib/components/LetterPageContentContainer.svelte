<div class="center">
	<main>
		<slot />
	</main>
</div>

<style>
	main {
		margin: 0 auto;
		max-width: 800px;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		gap: 8px;
		padding: 0px 8px 8px 8px;
		flex-direction: column;
		height: 100%;
		flex: 1 1 auto;
		margin: 0 auto;
	}

	.center {
		margin: 0 0;
		height: 100vh;
	}
</style>
