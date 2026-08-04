export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  exchangeRateFromBase: number; // Factor de conversión desde 1 BRL (Base ML)
}

/**
 * Mapeo de Conversión Directa de Monedas LATAM / Internacional:
 * Mantiene el modelo de Machine Learning intacto (Tarifa Base R$ 0.75 / kWh)
 * y convierte el resultado proyectado según los tipos de cambio oficiales actuales:
 * - 1 BRL = 183.19 CLP (Peso Chileno)
 * - 1 BRL = 292.36 ARS (Peso Argentino)
 * - 1 BRL = 1.0000 BRL (Real Brasileño Base ML)
 * - 1 BRL = 0.2000 USD (Dólar Estadounidense)
 */
export const CURRENCIES: Record<string, CurrencyConfig> = {
  CLP: { code: 'CLP', name: 'Peso Chileno (CLP)', symbol: 'CLP $', flag: '🇨🇱', exchangeRateFromBase: 183.19 },
  ARS: { code: 'ARS', name: 'Peso Argentino (ARS)', symbol: 'ARS $', flag: '🇦🇷', exchangeRateFromBase: 292.36 },
  BRL: { code: 'BRL', name: 'Real Brasileño (BRL)', symbol: 'R$', flag: '🇧🇷', exchangeRateFromBase: 1.0 },
  USD: { code: 'USD', name: 'Dólar US (USD)', symbol: 'US$', flag: '🇺🇸', exchangeRateFromBase: 0.20 },
};

/**
 * Convierte el costo base del modelo ML al tipo de cambio de la moneda seleccionada.
 */
export const convertFromBaseCost = (baseCost: number, currencyCode: string = 'CLP'): number => {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.CLP;
  return Math.round(baseCost * curr.exchangeRateFromBase * 100) / 100;
};

export const formatMoney = (amount: number, currencyCode?: string, symbol?: string): string => {
  const code = currencyCode && CURRENCIES[currencyCode] ? currencyCode : 'CLP';
  const curr = CURRENCIES[code];
  const sym = symbol || curr.symbol;
  return `${sym} ${amount.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
