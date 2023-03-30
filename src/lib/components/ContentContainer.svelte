<script lang="ts">
	export let mode = 'content';
</script>

<div
	class="flex flex-col items-center p-1"
	class:gap-2={mode === 'game'}
	class:h-screen={mode === 'game'}
	class:gap-6={mode === 'content'}
>
	<slot />
</div>
