<div class="center">
	<main>
		<slot />
	</main>
</div>

<style>
	main {
		position: relative;
		bottom: 8px;
		top: 0px;
		width: 100%;
		max-width: 800px;
		padding: 0 4px 4px 4px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.center {
		position: absolute;
		top: 0px;
		bottom: 0px;
		right: 0px;
		left: 0px;
		display: flex;
		justify-content: center;
	}
</style>
