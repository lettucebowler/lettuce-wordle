import { redirect } from '@sveltejs/kit';
const ghAuthURL = 'https://github.com/login/oauth/authorize';
import { LEGACY_AUTH_CLIENT_ID } from '$env/static/private';

export async function GET() {
	const sessionId = '1234';
	throw redirect(307, `${ghAuthURL}?client_id=${LEGACY_AUTH_CLIENT_ID}&state=${sessionId}`);
}
