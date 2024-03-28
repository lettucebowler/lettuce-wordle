<script lang="ts">
	export let message: string = 'just a sec...';
</script>

<div class="flex flex-col items-center gap-2 text-snow-300">
	<svg class="h-20 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle class="text-charade-800" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
		></circle>
		<path
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path>
	</svg>
	<p class="text-sm font-medium">{message}</p>
</div>
