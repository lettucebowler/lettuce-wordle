import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter({
			out: 'build',
			// runtime: 'edge',
			runtime: 'nodejs18.x'
			// split: true
		})
	}
};

export default config;
