<script lang="ts">
	export let mode = 'content';
</script>

<div class="flex flex-col items-center pt-6" class:flex-auto={mode === 'game'}>
	<slot />
</div>
