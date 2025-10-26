export function isRatingWithdrawn(value: string, action?: string): boolean {
	return value.toLowerCase() === "рейтинг отозван" || !!action?.includes("WD");
}
