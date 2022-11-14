<script lang="ts">
	export let mode = 'content';
</script>

<div class="flex flex-col items-center gap-8 pt-6" class:flex-auto={mode === 'game'}>
	<slot />
</div>
