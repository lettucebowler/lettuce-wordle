import * as v from 'valibot';

export const PositiveIntegerSchema = v.pipe(v.number(), v.integer(), v.minValue(1));
export const NonNegativeIntegerSchema = v.pipe(v.number(), v.integer(), v.minValue(0));

export const EmailSchema = v.pipe(v.string(), v.email());
