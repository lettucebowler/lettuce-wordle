<script>
	import { AvatarBeam } from 'svelte-boring-avatars';

	export let name = '';
	export let size = 40;
	export let square = true;

	export let colors = ['#D08770', '#EBCB8B', '#A3BE8C', '#5E81AC', '#485164'];
</script>

<AvatarBeam {size} {square} {name} {colors} />
