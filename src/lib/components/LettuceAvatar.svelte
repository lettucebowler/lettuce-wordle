<script lang="ts">
	type LettuceAvatarProps = {
		name: string;
	};
	let { name }: LettuceAvatarProps = $props();
</script>

<img
	class="pointer-events-none inline aspect-square h-full w-full rounded-xl"
	src="/api/v1/user-icons?username={encodeURIComponent(name)}"
	alt="{name} avatar image"
/>
