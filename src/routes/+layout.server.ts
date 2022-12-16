import type { WordLettuceSession } from '$lib/types/auth';
import { Trophy, Home } from '@steeze-ui/heroicons';

export const prerender = false;

import type { IconSource } from '@steeze-ui/svelte-icon/types';

type NavLink = {
	path: string;
	name: string;
	enabled: boolean;
	prefetch: boolean;
	margin?: string;
	icon?: IconSource;
};

// @ts-ignore
export const load: import('./$types').LayoutServerLoad = async (event) => {
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
