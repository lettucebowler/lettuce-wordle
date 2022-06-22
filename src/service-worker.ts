/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;

worker.addEventListener('fetch', function (event) {
	event.respondWith(fetch(event.request));
});
