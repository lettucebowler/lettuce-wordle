<script lang="ts">
	import { enhance } from '$app/forms';

	export let csrf: string;
	export let callback: string;
	export let mode: 'login' | 'logout' = 'login';
</script>

<form method="POST" action={mode === 'login' ? '/auth/signin/github' : '/auth/signout'}>
	<input type="hidden" name="csrfToken" value={csrf} />
	<input type="hidden" name="callbackUrl" value={callback} />
	<button
		class="grid h-full items-center rounded-xl  p-2 text-center font-medium text-snow-300 active:bg-charade-900"
		class:text-lg={mode === 'logout'}
		class:text-3xl={mode === 'login'}
		class:hover:bg-charade-800={mode === 'logout'}
		class:active:bg-charade-900={mode === 'logout'}
		class:hover:bg-charade-700={mode === 'login'}
		class:active:bg-charade-800={mode === 'login'}>{mode === 'login' ? 'Login' : 'Logout'}</button
	>
</form>
