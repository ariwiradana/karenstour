export function parseTaxRate(taxRate: number): string {
  return `${(taxRate * 100).toFixed(0)}%`;
}

export function parseDiscountRate(discount: number): string {
  return `${(discount * 100).toFixed(0)}%`;
}
