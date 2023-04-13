import { readable, derived } from 'svelte/store';

const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

const tomorrow = derived(time, ($time) => {
	const tomorrow = new Date();
	tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
	tomorrow.setUTCHours(0, 0, 0, 0);
});

export const timeUntilNextGame = derived(time, ($time) => {
	const tomorrow = new Date();
	tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
	tomorrow.setUTCHours(0, 0, 0, 0);
	return Math.round((tomorrow.getTime() - $time.getTime()) / 1000);
});
