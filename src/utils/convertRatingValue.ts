export const ratingScale = [
	"D",
	"C",
	"CC-",
	"CC",
	"CC+",
	"CCC-",
	"CCC",
	"CCC+",
	"B-",
	"B",
	"B+",
	"BB-",
	"BB",
	"BB+",
	"BBB-",
	"BBB",
	"BBB+",
	"A-",
	"A",
	"A+",
	"AA-",
	"AA",
	"AA+",
	"AAA",
] as const;

const ratingRegex = /[A-D]{1,3}[+-]?/i;

export function ratingValueToNumber(
	value: string,
	scale = ratingScale,
): number | undefined {
	const rating = value.match(ratingRegex)?.[0];
	const index = scale.indexOf(rating as (typeof scale)[number]);

	return index === -1 ? undefined : index;
}
