export function serializeFields(
	fields: Record<string, string | string[] | number | number[] | undefined>,
	prefix = "fields",
): string {
	const str: string[] = [];

	for (const [key, value] of Object.entries(fields)) {
		if (value === undefined) continue;

		if (Array.isArray(value)) {
			value.forEach((v: string | number, i: number) => {
				const serialzedKey = `${prefix}[${key}][${i}]`;
				const serialzedValue = encodeURIComponent(v);

				str.push(`${serialzedKey}=${serialzedValue}`);
			});
		} else {
			const serialzedKey = `${prefix}[${key}]`;
			const serialzedValue = encodeURIComponent(value);

			str.push(`${serialzedKey}=${serialzedValue}`);
		}
	}

	return str.join("&");
}
