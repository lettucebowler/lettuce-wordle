import type { WordLettuceUser } from '$lib/client/oauth';
import type { NavLink } from '$lib/types/Link';
import { Trophy, Home } from '@steeze-ui/heroicons';

export const prerender = false;

export const load: import('./$types').LayoutServerLoad = async (event) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const user: WordLettuceUser = event.locals.user || {};
	const { login, avatar } = user;

	let links: NavLink[] = [
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
