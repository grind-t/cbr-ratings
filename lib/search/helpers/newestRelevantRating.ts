import dayjs from "dayjs";
import type { RatingItem } from "../types/output.ts";
import { isRatingWithdrawn } from "./isRatingWithdrawn.ts";

export function newestRelevantRating(items: RatingItem[]): RatingItem {
	return items
		.filter((v) => !isRatingWithdrawn(v.ratingValue, v.ratingAction))
		.sort(
			(a, b) =>
				dayjs(b.releaseDate, "DD-MM-YYYY").valueOf() -
				dayjs(a.releaseDate, "DD-MM-YYYY").valueOf(),
		)
		.at(0);
}
