<script lang="ts">
	export let mode: 'login' | 'logout' = 'login';
	export let callback = '/?saveGame=true';
</script>

<form
	method="POST"
	action={mode === 'login' ? '/auth/signin/github' : '/auth/signout'}
	class="h-full"
>
	<input type="hidden" name="callbackUrl" value={callback} />
	<slot>
		<button
			class="grid h-full items-center rounded-xl py-2 px-6 text-center font-medium text-snow-100 active:bg-charade-900"
			class:text-lg={mode === 'logout'}
			class:text-3xl={mode === 'login'}
			class:hover:bg-charade-800={mode === 'logout'}
			class:active:bg-charade-900={mode === 'logout'}
			class:hover:bg-charade-700={mode === 'login'}
			class:active:bg-charade-800={mode === 'login'}>{mode === 'login' ? 'Login' : 'Logout'}</button
		>
	</slot>
</form>
