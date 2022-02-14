<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let key: string;
    export let width = 1;
    export let enabled = true;

    const dispatch = createEventDispatcher();

    const typeKey = (key: string) => {
        dispatch('keyPress', {
            key
        });
    };
</script>

<div>
        <button
            on:click={() => typeKey(key)}
            style="aspect-ratio: {width}"
            disabled={!enabled}
        >{key.toLowerCase()}</button>
</div> 

<style>

    button {
        width: 100%;
        height: 41.25px;
        display: inline-block;
        margin: 0 0;
        border: solid;
        border-color: var(--nord-3);
        background-color: var(--nord-2);

        color: var(--nord-6);
        border-radius: 4px;
    }

    button:hover{
        background-color: var(--nord-1);
    }

    button:active {
        background-color: var(--nord-0);
    }
</style>