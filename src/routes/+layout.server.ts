import type { WordLettuceSession } from '$lib/types/auth';
import { Trophy, Home } from '@steeze-ui/heroicons';
import type { IconSource } from '@steeze-ui/svelte-icon/types';
import type { ServerLoadEvent } from '@sveltejs/kit';

export const prerender = false;

export type NavLink = {
	path: string;
	name: string;
	enabled: boolean;
	prefetch: boolean;
	margin?: string;
	icon?: IconSource;
};

export const load = async (event: ServerLoadEvent) => {
	const session = (await event.locals.getSession()) as WordLettuceSession;

	const links: NavLink[] = [
		{
			path: '/',
			name: 'Home',
			enabled: true,
			prefetch: true,
			icon: Home
		},
		{
			path: '/rankings',
			name: 'Rankings',
			enabled: true,
			prefetch: true,
			icon: Trophy
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
};
