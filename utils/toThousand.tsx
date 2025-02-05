export function toThousand(value: number | string): string {
  // Convert the value to a number if it's a string
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    return ""; // Return "0" if the value is not a valid number
  }

  // Format the number with thousand separators (comma) and then replace commas with periods
  const formatted = numericValue
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Replace commas with periods to use period as thousand separator
  return formatted.replace(/,/g, ".");
}
