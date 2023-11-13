import { object, string, number, integer, minValue, email } from 'valibot';
import type { Output } from 'valibot';

export const userProfileSchema = object({
	id: number([integer(), minValue(0)]),
	login: string(),
	email: string([email()])
});
export type UserProfile = Output<typeof userProfileSchema>;

export const wordLettuceSessionSchema = object({
	user: userProfileSchema,
	expires: string()
});
export type WordLettuceSession = Output<typeof wordLettuceSessionSchema>;
