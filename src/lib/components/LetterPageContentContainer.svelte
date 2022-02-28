<div class="center">
	<div class="page">
		<slot />
	</div>
</div>

<style>
	.page {
		max-width: 100vw;
		width: 50vh;
		flex-direction: column;
		height: 100vh;
		text-align: center;
		margin: auto;
		padding: 0px 0px;
	}

	.center {
		margin: 0 0;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		position: absolute;
	}
</style>
