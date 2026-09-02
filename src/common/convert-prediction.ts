export type Prediction = "STA" | "POS" | "NEG" | "DEV";

export function convertPrediction(value: string | null | undefined): Prediction | null{
  const code = value?.match(/^([A-Z]+)/)?.[1] || '';

  return ['STA', 'POS', "NEG", "DEV"].includes(code) ? code as Prediction : null;
}
