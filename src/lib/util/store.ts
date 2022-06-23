import { readable, writable } from 'svelte/store';

// import { browser } from '$app/env';
// import { getDailyWord } from './words';

// // Get value from localStorage if in browser and the value is stored, otherwise fallback
// function fromLocalStorage(storageKey: string, fallbackValue: any) {
// 	if (browser) {
// 		const storedValue = window.localStorage.getItem(storageKey)

// 		if (storedValue !== 'undefined' && storedValue !== null) {
// 			return (typeof fallbackValue === 'object')
// 				? JSON.parse(storedValue)
// 				: storedValue
// 		}
// 	}

// 	return fallbackValue
// }

// function toLocalStorage(store, storageKey: string) {
// 	if (browser) {
// 		store.subscribe(value => {
// 			let storageValue = (typeof value === 'object')
// 				? JSON.stringify(value)
// 				: value

// 			window.localStorage.setItem(storageKey, storageValue)
// 		})
// 	}
// }

export const appName = readable('WordLettuce');

// export const state = writable(fromLocalStorage('state', {
//     answer: getDailyWord(),
//     words: [],
//     attempt: 0,
//     success: 0,
// }));
// toLocalStorage(state, 'tripId')
