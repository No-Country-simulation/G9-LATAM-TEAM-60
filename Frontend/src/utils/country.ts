export interface CountryEnergyConfig {
  codigo: 'AR' | 'CL' | 'BR' | 'US';
  nombre: string;
  factorCO2: number;
  unidad: string;
  moneda: string;
  simboloMoneda: string;
  idioma: 'es' | 'pt' | 'en';
  locale: string;
  bandera: string;
}

/**
 * Factores de Emisión de CO2 por País (kgCO2/kWh):
 * AR: 0.4126 | CL: 0.2021 | BR: 0.0385 | US: 0.35
 */
export const ENERGIA_POR_PAIS: Record<string, CountryEnergyConfig> = {
  AR: { codigo: 'AR', nombre: 'Argentina',      factorCO2: 0.4126, unidad: 'kgCO2/kWh',  moneda: 'ARS', simboloMoneda: 'ARS $', idioma: 'es', locale: 'es-AR', bandera: '🇦🇷' },
  CL: { codigo: 'CL', nombre: 'Chile',           factorCO2: 0.2021, unidad: 'kgCO2e/kWh', moneda: 'CLP', simboloMoneda: 'CLP $', idioma: 'es', locale: 'es-CL', bandera: '🇨🇱' },
  BR: { codigo: 'BR', nombre: 'Brasil',           factorCO2: 0.0385, unidad: 'kgCO2/kWh',  moneda: 'BRL', simboloMoneda: 'R$',    idioma: 'pt', locale: 'pt-BR', bandera: '🇧🇷' },
  US: { codigo: 'US', nombre: 'Estados Unidos',  factorCO2: 0.35,   unidad: 'kgCO2e/kWh', moneda: 'USD', simboloMoneda: 'US$',   idioma: 'en', locale: 'en-US', bandera: '🇺🇸' },
};

/** Calcula emisiones CO2: consumoKwh * factorCO2 del país */
export const calcularEmisionesCO2 = (consumoKwh: number, pais: string = 'CL'): number => {
  const config = ENERGIA_POR_PAIS[pais] || ENERGIA_POR_PAIS.CL;
  return Math.round(consumoKwh * config.factorCO2 * 10000) / 10000;
};

/** Formatea emisiones CO2 con unidad del país (ej: "48.50 kgCO2e/kWh") */
export const formatCO2 = (consumoKwh: number, pais: string = 'CL'): string => {
  const config = ENERGIA_POR_PAIS[pais] || ENERGIA_POR_PAIS.CL;
  const totalCO2 = calcularEmisionesCO2(consumoKwh, pais);
  const loc = config.locale || 'es-CL';
  return `${totalCO2.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${config.unidad}`;
};