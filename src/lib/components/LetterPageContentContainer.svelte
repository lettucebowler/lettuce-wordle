<div class="center">
	<div class="page">
		<slot />
	</div>
</div>

<style>
	.page {
		width: min(100%, 800px);
		flex-direction: column;
		height: 100%;
		max-height: 100vh;
		margin: 0 auto;
	}

	.center {
		margin: 0 0;
		display: flex;
	}
</style>
