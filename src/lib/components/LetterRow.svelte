<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import LetterBox from '$lib/components/LetterBox.svelte';
	const dispatch = createEventDispatcher();

	export let value = '';
	export let ref;
	export let statuses: string[];
	export let row: number;

	const filterInput = (event: any) => {
		if (!event.data) {
			return;
		}
		const condition = /^[a-zA-Z]+$/;
		if (!event.data.match(condition)) {
			event.preventDefault();
		}
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		dispatch('letterSubmit');
	};
</script>

<div>
	<form on:submit={handleSubmit} autocomplete="off" class="w-full box-border h-0">
		<label class="opacity-0">
			hidden input for wordle game. type your guess here
			<input
				type="text"
				maxLength="5"
				autocorrect="off"
				autocapitalize="off"
				spellcheck="false"
				on:beforeinput={(event) => filterInput(event)}
				bind:value
				bind:this={ref}
				on:blur
				class="w-full box-border h-0 p-0 border-none opacity-0"
			/>
		</label>
	</form>
	<div class="grid grid-cols-5 gap-2">
		{#each [0, 1, 2, 3, 4] as i (`${row}-${i}`)}
			<LetterBox letter={value.charAt(i)} status={statuses[i] || 'none'} slot={i} />
		{/each}
	</div>
</div>
