export function converKraName(value: string) {
	const ucValue = value.toUpperCase();

	if (ucValue.includes("АКРА")) {
		return "AKRA" as const;
	}

	if (ucValue.includes("НКР")) {
		return "NKR" as const;
	}

	if (ucValue.includes("ЭКСПЕРТ РА")) {
		return "EXPERT_RA" as const;
	}

	if (ucValue.includes("НРА")) {
		return "NRA" as const;
	}
}
