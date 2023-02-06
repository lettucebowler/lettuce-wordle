<script>
	export let name = '';
	export let size = 40;
	export let square = true;

	export let colors = ['D08770', 'EBCB8B', 'A3BE8C', '8FBCBB', '4C566A'];

	import { PUBLIC_AVATAR_HOST } from '$env/static/public';

	const host = PUBLIC_AVATAR_HOST ? PUBLIC_AVATAR_HOST : 'https://source.boringavatars.com';
</script>

<!-- <AvatarBeam {size} {square} {name} {colors} /> -->

<img
	style={`width:${size}px;height:${size}px`}
	loading="lazy"
	src={`${host}/beam/${size}/${name}?${new URLSearchParams({
		square: square.toString(),
		colors: colors.join(',')
	}).toString()}`}
	alt=""
/>
