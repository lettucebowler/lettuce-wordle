import adapter from '@sveltejs/adapter-vercel';
// import adapter from 'svelte-adapter-bun';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			out: 'build',
			edge: true
		}),
		prerender: {
			default: false
		},
		inlineStyleThreshold: 2048
	}
};

export default config;
