import { PositiveInteger } from '$lib/schemas/util';
import * as v from 'valibot';

// Wait for a configurable number of milliseconds. if the number is not a positive integer, the function will immediately return instead of waiting.
export async function delay(ms: number): Promise<undefined> {
	const parseResult = v.safeParse(PositiveInteger, ms);
	if (!parseResult.success) {
		return;
	}
	return new Promise((resolve) => setTimeout(resolve, ms));
}
