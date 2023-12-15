import { redirect } from '@sveltejs/kit';
export async function GET(event) {
	const session = await event.locals.getWordLettuceSession();
	if (!session) {
		redirect(307, '/auth/signin');
	}
	const user = session.user;
	redirect(307, `/profile/${user.login}`);
}
