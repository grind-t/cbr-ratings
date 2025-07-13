import fetchCookie from "fetch-cookie";
import { fetchCSRFToken } from "./helpers/fetchCSRFToken.ts";
import { serializeFields } from "./helpers/serializeFields.ts";
import type { SearchRatingRequest } from "./types/input.ts";
import type { SearchRatingResponse } from "./types/output.ts";

const fetcher = fetchCookie(fetch);

/**
 * Поиск кредитных рейтингов в реестре ЦБ РФ
 * @param req Параметры поиска
 * @returns Ответ API рейтингов ЦБ
 */
export async function searchRatings(
	req: SearchRatingRequest,
): Promise<SearchRatingResponse> {
	const csrfToken = await fetchCSRFToken(fetcher);
	const url =
		"https://ratings.cbr.ru/bitrix/services/main/ajax.php?mode=ajax&c=prr.form&action=searchRating";
	const body = serializeFields(req.fields);
	const res = await fetcher(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"bx-ajax": "true",
			"x-bitrix-csrf-token": csrfToken,
		},
		body,
	});

	if (!res.ok) {
		return {
			status: "error",
			data: null,
			errors: [
				{ message: `HTTP ${res.status}`, code: res.status, customData: null },
			],
		};
	}

	return (await res.json()) as SearchRatingResponse;
}
