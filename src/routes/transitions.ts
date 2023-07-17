import { crossfade } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';

const [send, recieve] = crossfade({
	duration: 250,
	easing: cubicOut
});

export const navigationSend = send;
export const navigationRecieve = recieve;
