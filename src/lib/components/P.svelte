<script lang="ts">
	export let className = '';
</script>

<p
	class:px-4={true}
	class:text-left={true}
	class:text-lg={true}
	class:text-snow-300={true}
	class:w-full={true}
	class:box-border={true}
	class={className}
>
	<slot />
</p>
