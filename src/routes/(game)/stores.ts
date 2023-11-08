import { derived, readable, writable } from 'svelte/store';

const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		const now = new Date();
		set(now);
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

export const timeUntilNextGame = derived(time, ($time) => {
	const tomorrow = new Date();
	tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
	tomorrow.setUTCHours(0, 0, 0, 0);
	return Math.round((tomorrow.getTime() - $time.getTime()) / 1000);
});

// Midnight on some day in February 2022, can't remember the exact date. You can look it up if you care.
const initial = new Date(1643673600000);
const msInADay = 1000 * 60 * 60 * 24;
export const gameNum = derived(time, ($time) =>
	Math.floor(($time.getTime() - initial.getTime()) / msInADay)
);

export function createExpiringBoolean() {
	let id: number | undefined;
	const store = writable(false);
	const period = 150;
	let startTime = 0;
	let remaining = 0;
	function setTrue() {
		if (id) {
			remaining = 150 - (performance.now() - startTime);
			clearTimeout(id);
		} else {
			remaining = 0;
		}
		store.set(true);
		startTime = performance.now();
		id = setTimeout(() => {
			store.set(false);
			id = undefined;
		}, remaining + period);
	}

	return {
		value: { subscribe: store.subscribe },
		setTrue
	};
}
