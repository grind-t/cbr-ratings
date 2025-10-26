export type KRA = "AKRA" | "NKR" | "EXPERT_RA" | "NRA";

export function convertKraName(value: string): KRA | undefined {
	const ucValue = value.toUpperCase();

	if (ucValue.includes("АКРА")) {
		return "AKRA";
	}

	if (ucValue.includes("НКР")) {
		return "NKR";
	}

	if (ucValue.includes("ЭКСПЕРТ РА")) {
		return "EXPERT_RA";
	}

	if (ucValue.includes("НРА")) {
		return "NRA";
	}
}
