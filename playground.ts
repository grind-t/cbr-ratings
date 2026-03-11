import { searchRatings } from "./src/index.ts";

const res = await searchRatings({
	fields: {
		formSearh: "advanced",
		isin: "RU000A101RZ3",
		typeGroup: ["Финансовые инструменты"],
	},
});

console.log(res);
