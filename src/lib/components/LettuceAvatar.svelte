<script lang="ts">
	type LettuceAvatarProps = {
		name: string;
		size: number;
	};
	let { name, size } = $props<LettuceAvatarProps>();

	const backgroundColors = ['BF616A', 'D08770', 'EBCB8B', 'A3BE8C', 'B48EAD', '88C0D0', '81A1C1'];
	function getBgQueryString() {
		const searchParams = new URLSearchParams();
		backgroundColors.forEach((bg) => {
			searchParams.append('backgroundColor', bg);
		});
		return searchParams.toString();
	}
</script>

<img
	style={`width:${size}px;height:${size}px`}
	class="pointer-events-none inline"
	src="https://api.dicebear.com/7.x/bottts-neutral/svg?{getBgQueryString()}&seed={name}"
	alt=""
/>
