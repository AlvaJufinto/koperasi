export function formatRupiah(
  value: number | string,
  withPrefix = true
): string {
  let number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) return withPrefix ? "Rp 0" : "0";

  return (withPrefix ? "Rp " : "") + number.toLocaleString("id-ID");
}
