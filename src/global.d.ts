/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {
		authProvider: string;
		dbProvider: string;
		user: {
			login: string;
			avatar: string;
			bio: string;
		};
		gameState: { guess: string; complete: boolean }[];
	}
}
