<script>
	export let name = '';
	const backgroundColors = ['BF616A', 'D08770', 'EBCB8B', 'A3BE8C', 'B48EAD', '88C0D0', '81A1C1'];

	const searchParams = new URLSearchParams();
	backgroundColors.forEach((bg) => {
		searchParams.append('backgroundColor', bg);
	});
</script>

<img
	class="pointer-events-none inline aspect-square h-full w-full rounded-xl"
	src={`https://api.dicebear.com/7.x/bottts-neutral/svg?${searchParams}&seed=${name}`}
	alt=""
/>
