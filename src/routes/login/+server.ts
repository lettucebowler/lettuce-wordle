import { error, redirect } from '@sveltejs/kit';
const ghAuthURL = 'https://github.com/login/oauth/authorize';
const clientId = import.meta.env.VITE_CLIENT_ID;

export async function GET() {
	const sessionId = '1234';
	// return {
	//   status: 302,
	//   headers: {
	//     location: `${ghAuthURL}?client_id=${clientId}&state=${sessionId}`
	//   }
	// }
	throw redirect(307, `${ghAuthURL}?client_id=${clientId}&state=${sessionId}`);
}
