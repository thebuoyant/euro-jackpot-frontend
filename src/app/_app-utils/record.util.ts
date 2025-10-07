import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

export function formatNumberToEuroString(
  amount = 0,
  decimalCount = 2,
  decimal = ",",
  thousands = "."
) {
  try {
    decimalCount = Math.abs(decimalCount);
    const negativeSign = amount < 0 ? "-" : "";
    const i = parseInt(
      Math.abs(Number(amount) || 0).toFixed(decimalCount),
      10
    ).toString();
    const j = i.length > 3 ? i.length % 3 : 0;
    return (
      negativeSign +
      (j ? i.substring(0, j) + thousands : "") +
      i.substring(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`) +
      (decimalCount
        ? `${
            decimal +
            Math.abs(amount - Number(i))
              .toFixed(decimalCount)
              .slice(2)
          } €`
        : "")
    );
  } catch (e) {
    /* istanbul ignore next */
    console.error(e);
  }
}

export function stringToNumber(numberString: string): number {
  const normalizedString = numberString
    .replace(".", "")
    .replace(".", "")
    .replace(".", "");
  return Number(normalizedString);
}

export function euroStringToNumber(euroString: string): number {
  const trim1 = euroString.replace(/€/g, "").trim();
  const trim2 = trim1.replace(/\./g, "");
  const trim3 = trim2.replace(/,/g, ".");
  return Number(trim3);
}

export function formatNumberToString(
  rawNumber = 0,
  decimalCount = 2,
  decimal = ",",
  thousands = "."
) {
  try {
    decimalCount = Math.abs(decimalCount);
    const negativeSign = rawNumber < 0 ? "-" : "";
    const i = parseInt(
      Math.abs(Number(rawNumber) || 0).toFixed(decimalCount),
      10
    ).toString();
    const j = i.length > 3 ? i.length % 3 : 0;
    return (
      negativeSign +
      (j ? i.substring(0, j) + thousands : "") +
      i.substring(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`) +
      (decimalCount
        ? `${
            decimal +
            Math.abs(rawNumber - Number(i))
              .toFixed(decimalCount)
              .slice(2)
          }`
        : "")
    );
  } catch (e) {
    /* istanbul ignore next */
    console.error(e);
  }
}

export function resolveDay(dayShortValue: "Di" | "Fr"): string {
  if (dayShortValue === "Di") {
    return APP_TYPO_CONST.common.tuesday;
  }

  return APP_TYPO_CONST.common.friday;
}
