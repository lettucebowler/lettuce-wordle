<script lang="ts">
	export let mode: 'login' | 'logout' = 'login';
	export let callback = '/?saveGame=true';
</script>

<form
	method="POST"
	action={mode === 'login' ? '/auth/signin/github' : '/auth/signout'}
	class="h-full"
>
	<input type="hidden" name="callbackUrl" value={mode === 'login' ? callback : ''} />
	<slot>
		<button
			class="grid h-full items-center rounded-xl px-6 py-2 text-center font-medium text-snow-100 hover:underline capitalize"
			class:text-lg={mode === 'logout'}
			class:text-3xl={mode === 'login'}>{mode}</button
		>
	</slot>
</form>
