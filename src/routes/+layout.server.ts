export const prerender = false;

export type NavLink = {
	path: string;
	name: string;
	enabled: boolean;
	prefetch: boolean;
	margin?: string;
	icon?: string;
};

import type { WordLettuceSession } from '$lib/types/auth';
export async function load(event) {
	const session = (await event.locals.getSession()) as WordLettuceSession;
	const links: NavLink[] = [
		{
			path: '/',
			name: 'Home',
			enabled: true,
			prefetch: true
		},
		{
			path: '/rankings',
			name: 'Rankings',
			enabled: true,
			prefetch: true
		},
		{
			path: '/about',
			name: 'About',
			enabled: true,
			prefetch: true
		}
	];
	return {
		nav: links,
		session
	};
}
