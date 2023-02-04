<script>
	import { AvatarBeam } from 'svelte-boring-avatars';

	export let name = '';
	export let size = 40;
	export let square = true;

	export let colors = ['#BF616A', '#D08770', '#EBCB8B', '#A3BE8C', '#B48EAD', '#5E81AC', '#485164'];
</script>

<AvatarBeam {size} {square} {name} {colors} />
