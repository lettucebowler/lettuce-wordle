<script lang="ts">
	export let mode = 'content';
</script>

<div class="flex flex-col items-center" class:flex-auto={mode === 'game'}>
	<slot />
</div>
