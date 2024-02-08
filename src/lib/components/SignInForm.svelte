<script lang="ts">
	export let provider: string = 'github';
</script>

<form method="POST" action="/signin">
	<input type="hidden" name="providerId" value={provider} />
	<slot>
		<button
			class="grid h-full items-center rounded-xl px-6 py-2 text-center font-medium capitalize text-snow-100 hover:underline"
			>Sign in</button
		>
	</slot>
</form>
