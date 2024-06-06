/// <reference types="@sveltejs/kit" />
import type { D1Database } from '@cloudflare/workers-types';
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
			_gameState: import('$lib/types/gameresult').GuessOutput[];
			getGameState: () => import('$lib/types/gameresult').GuessOutput[];
			getGameStateV2: () => { guesses: string[]; currentGuess: string };
			gameState: import('$lib/types/gameresult').GuessOutput[];
		}
	}
}
export {};
