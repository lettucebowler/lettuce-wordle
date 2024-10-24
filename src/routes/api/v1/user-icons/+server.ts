import { error } from '@sveltejs/kit';

const host = 'https://api.dicebear.com/7.x/bottts-neutral/svg';
const bgs = ['BF616A', 'D08770', 'EBCB8B', 'A3BE8C', 'B48EAD', '88C0D0', '81A1C1'];

export async function GET(event) {
	const hostUrl = new URL(host);
	bgs.forEach((backgroundColor) => {
		hostUrl.searchParams.append('backgroundColor', backgroundColor);
	});
	const username = event.url.searchParams.get('username');
	if (!username) {
		error(400, 'username is a required query param');
	}
	hostUrl.searchParams.set('seed', username);

	const response = await event.fetch(hostUrl.href);
	event.setHeaders({
		'Content-Type': 'image/svg+xml',
		'Cache-Control': 'public, max-age=31919000'
	});
	return new Response(response.body);
}
