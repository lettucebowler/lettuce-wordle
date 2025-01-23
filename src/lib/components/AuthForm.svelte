<script lang="ts">
	import type { Snippet } from 'svelte';
	type AuthFormProps = {
		mode?: 'login' | 'logout';
		provider?: string;
		children?: Snippet;
	};

	let { mode = 'login', provider = 'github', children = defaultButton }: AuthFormProps = $props();
</script>

{#snippet defaultButton()}
	<button
		class="text-snow-100 grid h-full items-center rounded-xl px-6 py-2 text-center font-medium capitalize hover:underline"
		class:text-lg={mode === 'logout'}
		class:text-3xl={mode === 'login'}>{mode}</button
	>
{/snippet}

<form method="POST" action={mode === 'login' ? '/signin' : '/signout'} class="h-full">
	<input type="hidden" name="providerId" value={provider} />
	{@render children()}
</form>
