<script>
    export let letter;
    export let status;
</script>

<div class={status}>
    {letter}
</div>

<style>
    div {
        aspect-ratio: 1;
        justify-content: center;
        text-align: center;
        align-items: center;
        vertical-align: center;
        display: inline-flex;
        font-size: 2rem;
        color: white;
    }

    .none {
        background-color: black;
    }

    .correct {
        background-color: green;
    }

    .contains {
        background-color: yellow;
    }

    .incorrect {
        background-color: grey;
    }
</style>