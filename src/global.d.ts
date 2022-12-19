/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {
		dbProvider: string;
		gameState: { guess: string; complete: boolean }[];
	}
}
