import { redirect } from '@sveltejs/kit';
const ghAuthURL = 'https://github.com/login/oauth/authorize';
import { CLIENT_ID } from '$env/static/private';

export async function GET() {
	const sessionId = '1234';
	throw redirect(307, `${ghAuthURL}?client_id=${CLIENT_ID}&state=${sessionId}`);
}
