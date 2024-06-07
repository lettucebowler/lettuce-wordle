import type { GameState } from '$lib/schemas/game';

export function encodeStateV2(state: GameState) {
	return btoa(`${state.gameNum};${state.guesses.join(',')};${state.currentGuess}`);
}
