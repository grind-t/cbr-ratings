import { z } from "zod";

export const RatingItemSchema = z.object({
	ratingAction: z.string(),
	country: z.string(),
	koNumber: z.string(),
	releaseDate: z.string(),
	inn: z.string(),
	objectType: z.string(),
	ratingValue: z.string(),
	prediction: z.string(),
	objectName: z.string(),
	kraName: z.string(),
	releaseUrl: z.string(),
	objectId: z.string(),
	isin: z.string(),
	subjectName: z.string(),
});

export const SearchRatingSuccessResponseSchems = z.object({
	status: z.literal("success"),
	data: z.object({
		pageCount: z.number(),
		pageNumber: z.number(),
		sortingField: z.string(),
		sortingDirection: z.string(),
		pageSize: z.number(),
		itemList: z.array(RatingItemSchema),
		itemCount: z.number(),
	}),
	errors: z.tuple([]),
});

export const SearchRatingsErrorResponseSchema = z.object({
	status: z.literal("error"),
	data: z.null(),
	errors: z.array(
		z.object({
			message: z.string(),
			code: z.number(),
			customData: z.any(),
		}),
	),
});

export const SearchRatingResponseSchema = z.union([
	SearchRatingSuccessResponseSchems,
	SearchRatingsErrorResponseSchema,
]);

export type RatingItem = z.infer<typeof RatingItemSchema>;
export type SearchRatingResponse = z.infer<typeof SearchRatingResponseSchema>;
