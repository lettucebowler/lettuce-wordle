import * as v from 'valibot';

export const PositiveInteger = v.pipe(v.number(), v.integer(), v.minValue(1));
export const NonNegativeInteger = v.pipe(v.number(), v.integer(), v.minValue(0));
export const Email = v.pipe(v.string(), v.email());
