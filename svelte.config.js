import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter({
			out: 'build'
		}),
		inlineStyleThreshold: 2048,
		paths: {
			assets: 'https://wordlettuce-assets.b-cdn.net'
		}
	}
};

export default config;
