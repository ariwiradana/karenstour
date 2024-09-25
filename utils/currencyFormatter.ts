export const currencyIDR = (amount: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  });

  return `IDR. ${formatter.format(amount)}`;
};

export const currencyRupiah = (amount: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  });

  return `Rp. ${formatter.format(amount)}`;
};
