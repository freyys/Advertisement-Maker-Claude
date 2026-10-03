// German number formatting without relying on the renderer's ICU data.
const group = (intPart: string) => intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const de = (n: number, decimals = 2) => {
  const fixed = Math.abs(n).toFixed(decimals);
  const [i, d] = fixed.split('.');
  const sign = n < 0 ? '−' : '';
  return d ? `${sign}${group(i)},${d}` : `${sign}${group(i)}`;
};

export const eur = (n: number) => `${de(n, 2)} €`;

export const qty = (n: number, unit: string) => `${de(n, 1)} ${unit}`;
