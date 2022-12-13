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

export const load: import('./$types').LayoutServerLoad = async (event) => {
	const user = event.locals.user;

	const { login, avatar } = user || {};

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
		},
		{
			path: '/login',
			name: 'Login',
			enabled: !login,
			margin: 'left',
			prefetch: false
		}
	];

	return {
		user: {
			login: login || '',
			avatar: avatar || ''
		},
		nav: links
	};
};
