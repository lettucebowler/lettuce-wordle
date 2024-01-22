/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {
		dbProviderOverwritten: boolean;
		getWordLettuceSession: () => Promise<
			import('$lib/types/auth').WordLettuceSession | void | null
		>;
		_gameState: import('$lib/types/gameresult').Guess[];
		getGameState: () => import('$lib/types/gameresult').Guess[];
		getDbProvider: () => import('$lib/util/gameresults').Provider | undefined;
	}
}
