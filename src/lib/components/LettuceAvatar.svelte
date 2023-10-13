<script>
	export let name = '';
	export let size = 40;
	const backgroundColors = ['BF616A', 'D08770', 'EBCB8B', 'A3BE8C', 'B48EAD', '88C0D0', '81A1C1'];

	const searchParams = new URLSearchParams();
	backgroundColors.forEach((bg) => {
		searchParams.append('backgroundColor', bg);
	});
</script>

<img
	style={`width:${size}px;height:${size}px`}
	class="pointer-events-none inline"
	src={`https://api.dicebear.com/7.x/bottts-neutral/svg?${searchParams}&seed=${name}`}
	alt=""
/>
