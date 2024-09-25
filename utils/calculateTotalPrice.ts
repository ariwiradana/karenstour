export function calculateTotalPrice(
  subtotal: number,
  taxRate: number
): { tax: number; grandTotal: number } {
  const tax = Math.round(subtotal * taxRate);
  const grandTotal = Math.round(subtotal + tax);

  return {
    tax: tax,
    grandTotal: grandTotal,
  };
}
