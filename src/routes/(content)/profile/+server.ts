import { redirect } from '@sveltejs/kit';
export async function GET(event) {
	const session = await event.locals.getWordLettuceSession();
	if (!session) {
		throw redirect(307, '/auth/signin');
	}
	const user = session.user;
	throw redirect(307, `/profile/${user.login}`);
}
