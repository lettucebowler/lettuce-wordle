<script lang="ts">
    export let icon = '';

    import iconTrophy from '$lib/assets/icon-trophy.svg';
    import iconHome from '$lib/assets/icon-home.svg';
    import iconUser from '$lib/assets/icon-user.svg';
    import iconExternalWindow from '$lib/assets/icon-external-window.svg';
    import iconChevronDown from '$lib/assets/icon-chevron-down.svg';

    const icons = new Map([
        ['home', iconHome],
        ['trophy', iconTrophy]
    ])
</script>

<img alt={icon} src={icons.get(icon)} class="inline h-10 w-10 flex justify-center m-0"/>

