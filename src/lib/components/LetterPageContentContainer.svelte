<div class="center">
	<div class="page">
		<slot />
	</div>
</div>

<style>
	.page {
		width: 50vh;
		flex-direction: column;
		height: 100%;
		text-align: center;
		margin: auto;
		padding: 4px 4px;
	}

	.center {
		margin: 0 0;
		display: flex;
	}
</style>
