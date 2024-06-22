<script lang="ts">
	import type { Snippet } from 'svelte';
	let { provider = 'github', children = defaultChildren }: { provider: string; children: Snippet } =
		$props();
</script>

{#snippet defaultChildren()}
	<button
		class="grid h-full items-center rounded-xl px-6 py-2 text-center font-medium capitalize text-snow-100 hover:underline"
		>Sign in</button
	>
{/snippet}

<form method="POST" action="/signin">
	<input type="hidden" name="providerId" value={provider} />
	{@render children()}
</form>
