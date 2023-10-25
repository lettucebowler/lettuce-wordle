/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {
		dbProviderOverwritten: boolean;
		getWordLettuceSession: () => Promise<
			import('$lib/types/auth').WordLettuceSession | void | null
		>;
		getGameState: () => import('$lib/types/gameresult').Guess[];
		getDbProvider: () => string | undefined;
	}
}
