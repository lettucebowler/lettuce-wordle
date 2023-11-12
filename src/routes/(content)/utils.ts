import { integer, minValue, number, safeParse } from 'valibot';

const msSchema = number([integer(), minValue(0)]);
// Wait for a configurable number of milliseconds. if the number is not a positive integer, the function will immediately return instead of waiting.
export async function delay(ms: number): Promise<undefined> {
	const parseResult = safeParse(msSchema, ms);
	if (!parseResult.success) {
		return;
	}
	return new Promise((resolve) => setTimeout(resolve, ms));
}
