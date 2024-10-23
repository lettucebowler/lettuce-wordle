/// <reference types="@sveltejs/kit" />
import '@auth/sveltekit';

declare module '@auth/sveltekit' {
	interface User {
		login: string;
		githubId: number;
	}
}

declare global {
	declare namespace App {
		interface Locals {
			getGameStateV2: () => import('$lib/schemas/game').GameState;
		}
		interface PageState {
			showModal: boolean;
		}
		interface Platform {
			env?: {
				WORDLETTUCE_DB: D1Database;
			};
		}
	}
}
export {};
