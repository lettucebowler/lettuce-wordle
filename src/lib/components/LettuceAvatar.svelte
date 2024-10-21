<script lang="ts">
	type LettuceAvatarProps = {
		name: string;
	};
	let { name }: LettuceAvatarProps = $props();

	function getQueryParams(name: string) {
		const backgroundColors = ['BF616A', 'D08770', 'EBCB8B', 'A3BE8C', 'B48EAD', '88C0D0', '81A1C1'];
		const searchParams = new URLSearchParams();
		backgroundColors.forEach((bg) => {
			searchParams.append('backgroundColor', bg);
		});
		searchParams.set('seed', name);
		return searchParams.toString();
	}
</script>

<img
	class="pointer-events-none inline aspect-square h-full w-full rounded-xl"
	src="https://api.dicebear.com/7.x/bottts-neutral/svg?{getQueryParams(name)}"
	alt="{name} avatar image"
/>
