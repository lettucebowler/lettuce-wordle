<script lang="ts">
	export let mode: 'login' | 'logout' = 'login';
	export let provider: string = 'github';
</script>

<form method="POST" action={mode === 'login' ? '/signin' : '/signout'} class="h-full">
	<input type="hidden" name="providerId" value={provider} />
	<slot>
		<button
			class="grid h-full items-center rounded-xl px-6 py-2 text-center font-medium capitalize text-snow-100 hover:underline"
			class:text-lg={mode === 'logout'}
			class:text-3xl={mode === 'login'}>{mode}</button
		>
	</slot>
</form>
