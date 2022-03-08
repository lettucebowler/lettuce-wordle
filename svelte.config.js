import adapter from 'lettuce-svelte-adapter-express';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({ out: 'build' })

		// hydrate the <div id="svelte"> element in src/app.html
	}
};

export default config;
