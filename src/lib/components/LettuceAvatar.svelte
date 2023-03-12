<script>
	export let name = '';
	export let size = 40;
	// export let square = true;

	// export let colors = ['D08770', 'EBCB8B', 'A3BE8C', '8FBCBB', '4C566A'];
	const backgroundColors = ['BF616A', 'D08770', 'EBCB8B', 'A3BE8C', 'B48EAD', '88C0D0', '81A1C1'];

	// import { AvatarBeam } from 'svelte-boring-avatars';
	// import { PUBLIC_AVATAR_HOST } from '$env/static/public';

	// const host = PUBLIC_AVATAR_HOST ? PUBLIC_AVATAR_HOST : 'https://source.boringavatars.com';

	const searchParams = new URLSearchParams({
		seed: name,
		backgroundColor: backgroundColors.join(',')
	});
</script>

<!-- <img
	style={`width:${size}px;height:${size}px`}
	loading="lazy"
	class="pointer-events-none inline"
	src={`${host}/beam/${size}/${name}?${new URLSearchParams({
		square: square.toString(),
		colors: colors.join(',')
	}).toString()}`}
	alt=""
/> -->

<img
	style={`width:${size}px;height:${size}px`}
	loading="lazy"
	class="pointer-events-none inline"
	src={`https://api.dicebear.com/5.x/bottts-neutral/svg?${searchParams}`}
	alt=""
/>

<!-- <AvatarBeam {name} {size} {square} colors={colors.map((color) => `#${color}`)} /> -->
