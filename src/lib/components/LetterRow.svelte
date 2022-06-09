<script>
	import { createEventDispatcher } from 'svelte';
	import LetterBox from '$lib/components/LetterBox.svelte';
	const dispatch = createEventDispatcher();

	export let value = '';
	export let ref;
	export let statuses;

	const filterInput = (event) => {
		if (!event.data) {
			return;
		}
		const condition = /^[a-zA-Z]+$/;
		if (!event.data.match(condition)) {
			event.preventDefault();
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		dispatch('letterSubmit');
	};
</script>

<div>
	<form on:submit={handleSubmit} autocomplete="off">
		<label>
			hidden input for wordle game. type your guess here
			<input
				type="text"
				maxLength="5"
				on:beforeinput={(event) => filterInput(event)}
				bind:value
				bind:this={ref}
				on:blur
			/>
		</label>
	</form>
	<div class="row">
		{#each [0, 1, 2, 3, 4] as i}
			<LetterBox letter={value.charAt(i)} status={statuses[i]} />
		{/each}
	</div>
</div>

<style>
	form {
		width: 100%;
		box-sizing: border-box;
		height: 0px;
	}

	input {
		width: 100%;
		box-sizing: border-box;
		height: 0px;
		padding: 0px;
		border: none;
		opacity: 0;
	}

	label {
		opacity: 0;
	}

	.row {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 8px;
	}
</style>
