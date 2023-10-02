/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {
		dbProvider: string;
		dbProviderOverwritten: boolean;
		gameState: { guess: string; complete: boolean }[];
		getWordLettuceSession: () => Promise<
			import('$lib/types/auth').WordLettuceSession | void | null
		>;
	}
}
