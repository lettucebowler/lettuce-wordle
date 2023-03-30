<script lang="ts">
	import AuthNav from '$lib/components/AuthNav.svelte';
	import ContentContainer from '$lib/components/ContentContainer.svelte';

	export let data;
</script>

<ContentContainer mode="game">
	<AuthNav links={data.nav} user={data?.session?.user} />
	<slot />
</ContentContainer>
