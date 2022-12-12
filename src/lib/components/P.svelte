<script lang="ts">
	export let className = '';
</script>

<p
	class:mx-4={true}
	class:text-left={true}
	class:text-lg={true}
	class:text-snow-300={true}
	class={className}
>
	<slot />
</p>
