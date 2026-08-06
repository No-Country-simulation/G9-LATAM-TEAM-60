export interface CountryEnergyConfig {
  codigo: 'AR' | 'CL' | 'BR' | 'US';
  nombre: string;
  factorCO2: number;
  unidad: string;
  moneda: string;       // 'ARS', 'CLP', 'BRL', 'USD'
  simboloMoneda: string;// 'ARS $', 'CLP $', 'R$', 'US$'
  idioma: 'es' | 'pt' | 'en';
  bandera: string;
}

/**
 * Tabla Oficial de Factores de Emisión de CO2 por País (kgCO2/kWh o kgCO2e/kWh):
 * AR (Argentina): 0.4126 kgCO2/kWh
 * CL (Chile): 0.2021 kgCO2e/kWh
 * BR (Brasil): 0.0385 kgCO2/kWh
 * US (Estados Unidos): 0.35 kgCO2e/kWh
 */
export const ENERGIA_POR_PAIS: Record<string, CountryEnergyConfig> = {
  AR: {
    codigo: 'AR',
    nombre: 'Argentina',
    factorCO2: 0.4126,
    unidad: 'kgCO2/kWh',
    moneda: 'ARS',
    simboloMoneda: 'ARS $',
    idioma: 'es',
    bandera: '🇦🇷'
  },
  CL: {
    codigo: 'CL',
    nombre: 'Chile',
    factorCO2: 0.2021,
    unidad: 'kgCO2e/kWh',
    moneda: 'CLP',
    simboloMoneda: 'CLP $',
    idioma: 'es',
    bandera: '🇨🇱'
  },
  BR: {
    codigo: 'BR',
    nombre: 'Brasil',
    factorCO2: 0.0385,
    unidad: 'kgCO2/kWh',
    moneda: 'BRL',
    simboloMoneda: 'R$',
    idioma: 'pt',
    bandera: '🇧🇷'
  },
  US: {
    codigo: 'US',
    nombre: 'Estados Unidos',
    factorCO2: 0.35,
    unidad: 'kgCO2e/kWh',
    moneda: 'USD',
    simboloMoneda: 'US$',
    idioma: 'en',
    bandera: '🇺🇸'
  }
};

/**
 * Función oficial de cálculo de Emisiones de CO2 según el consumo en kWh y el factor del país.
 * emisionesCO2 = consumoKwh * energiaPorPais[pais].factorCO2
 */
export const calcularEmisionesCO2 = (consumoKwh: number, pais: string = 'CL'): number => {
  const config = ENERGIA_POR_PAIS[pais] || ENERGIA_POR_PAIS.CL;
  const emisiones = consumoKwh * config.factorCO2;
  return Math.round(emisiones * 10000) / 10000;
};

/**
 * Formatea el resultado de las emisiones de CO2 con su unidad correspondiente (ej: "48.50 kgCO2e/kWh")
 */
export const formatCO2 = (consumoKwh: number, pais: string = 'CL'): string => {
  const config = ENERGIA_POR_PAIS[pais] || ENERGIA_POR_PAIS.CL;
  const totalCO2 = calcularEmisionesCO2(consumoKwh, pais);
  return `${totalCO2.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${config.unidad}`;
};
