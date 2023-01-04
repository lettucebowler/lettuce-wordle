import { fetcher } from 'itty-fetcher';

import { browser } from '$app/environment';

export const load = async ({ data }) => {
	if (browser) {
		const { csrfToken } = await fetcher().get(window.location.origin + '/auth/csrf');
		return {
			...data,
			csrfToken
		};
	}
	return {
		...data
	};
};
