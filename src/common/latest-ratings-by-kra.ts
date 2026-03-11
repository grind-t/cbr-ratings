import type { RatingItem } from "../rating-search/schema/output.ts";
import { convertKraName, type Kra } from "./convert-kra-name.ts";
import { latestRating } from "./latest-rating.ts";

export function latestRatingsByKra(
	items: RatingItem[],
): Partial<Record<Kra, RatingItem>> {
	const groups = Object.groupBy(items, (item) => convertKraName(item.kraName));

	return Object.fromEntries(
		Object.entries(groups)
			.map(([k, v]) => [k, latestRating(v)])
			.filter(([, v]) => !!v),
	);
}
