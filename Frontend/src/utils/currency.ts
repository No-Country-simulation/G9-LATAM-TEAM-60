export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  exchangeRateFromBase: number; // Factor de conversión desde 1 BRL (Base ML)
}

/**
 * Tipos de cambio: Base BRL 0.75/kWh → monedas LATAM
 * 1 BRL = 183.19 CLP | 292.36 ARS | 1.0 BRL | 0.20 USD
 */
export const CURRENCIES: Record<string, CurrencyConfig> = {
  CLP: { code: 'CLP', name: 'Peso Chileno (CLP)',    symbol: 'CLP $', flag: '🇨🇱', exchangeRateFromBase: 183.19 },
  ARS: { code: 'ARS', name: 'Peso Argentino (ARS)',  symbol: 'ARS $', flag: '🇦🇷', exchangeRateFromBase: 292.36 },
  BRL: { code: 'BRL', name: 'Real Brasileño (BRL)',  symbol: 'R$',    flag: '🇧🇷', exchangeRateFromBase: 1.0    },
  USD: { code: 'USD', name: 'Dólar US (USD)',         symbol: 'US$',   flag: '🇺🇸', exchangeRateFromBase: 0.20   },
};

/** Convierte costo base ML al tipo de cambio de la moneda seleccionada */
export const convertFromBaseCost = (baseCost: number, currencyCode: string = 'CLP'): number => {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.CLP;
  return Math.round(baseCost * curr.exchangeRateFromBase);
};

/** Formatea un monto con símbolo de moneda y separadores según locale del país (sin decimales) */
export const formatMoney = (amount: number, currencyCode?: string, symbol?: string): string => {
  const code = currencyCode && CURRENCIES[currencyCode] ? currencyCode : 'CLP';
  const curr = CURRENCIES[code];
  const sym = symbol || curr.symbol;
  return `${sym} ${Math.round(amount).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

/** Formatea un monto usando el locale correcto del país para números y moneda (sin decimales) */
export const formatMoneyLocale = (amount: number, currencyCode: string, locale: string): string => {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.CLP;
  const loc = locale || 'es-CL';
  return `${curr.symbol} ${Math.round(amount).toLocaleString(loc, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

/** Formatea una fecha según el locale del país */
export const formatDateLocale = (date: string | Date | undefined | null, locale: string, opts?: Intl.DateTimeFormatOptions): string => {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleString(locale || 'es-CL', opts || { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return String(date);
  }
};

