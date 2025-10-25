export function isRatingWithdrawn(value: string, action?: string) {
	return value.toLowerCase() === "рейтинг отозван" || !!action?.includes("WD");
}
