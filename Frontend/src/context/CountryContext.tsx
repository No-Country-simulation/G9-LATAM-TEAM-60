import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ENERGIA_POR_PAIS, calcularEmisionesCO2, formatCO2 } from '../utils/country';
import type { CountryEnergyConfig } from '../utils/country';
import { TRANSLATIONS } from '../utils/i18n';
import type { Language } from '../utils/i18n';
import { CURRENCIES, formatDateLocale, convertFromBaseCost } from '../utils/currency';

interface CountryContextType {
  pais: 'AR' | 'CL' | 'BR' | 'US';
  setPais: (codigo: 'AR' | 'CL' | 'BR' | 'US') => void;
  paisConfig: CountryEnergyConfig;
  idioma: Language;
  locale: string;
  moneda: string;
  simboloMoneda: string;
  t: (key: string) => string;
  calcularCO2: (consumoKwh: number) => number;
  formatearCO2: (consumoKwh: number) => string;
  /** Formatea un monto en la moneda y locale del pais activo */
  formatMoney: (amount: number) => string;
  /** Convierte desde costo base BRL a la moneda del país activo */
  convertirDesdeBase: (baseCost: number) => number;
  /** Formatea una fecha en el locale del pais activo */
  formatDate: (date: string | Date | undefined | null, opts?: Intl.DateTimeFormatOptions) => string;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pais, setPaisState] = useState<'AR' | 'CL' | 'BR' | 'US'>(() => {
    const saved = localStorage.getItem('energiAI_pais');
    return (saved && ENERGIA_POR_PAIS[saved]) ? (saved as 'AR' | 'CL' | 'BR' | 'US') : 'CL';
  });

  const paisConfig = ENERGIA_POR_PAIS[pais] || ENERGIA_POR_PAIS.CL;
  const idioma = paisConfig.idioma;
  const locale = paisConfig.locale || 'es-CL';
  const moneda = paisConfig.moneda;
  const simboloMoneda = paisConfig.simboloMoneda;

  const setPais = (codigo: 'AR' | 'CL' | 'BR' | 'US') => {
    if (ENERGIA_POR_PAIS[codigo]) {
      setPaisState(codigo);
      localStorage.setItem('energiAI_pais', codigo);
    }
  };

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[idioma] || TRANSLATIONS.es;
    return langDict[key] || TRANSLATIONS.es[key] || key;
  };

  const calcularCO2 = (consumoKwh: number): number => calcularEmisionesCO2(consumoKwh, pais);
  const formatearCO2 = (consumoKwh: number): string => formatCO2(consumoKwh, pais);

  const formatMoney = (amount: number): string => {
    const curr = CURRENCIES[moneda] || CURRENCIES.CLP;
    return `${curr.symbol} ${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const convertirDesdeBase = (baseCost: number): number => convertFromBaseCost(baseCost, moneda);

  const formatDate = (date: string | Date | undefined | null, opts?: Intl.DateTimeFormatOptions): string =>
    formatDateLocale(date, locale, opts);

  return (
    <CountryContext.Provider
      value={{
        pais, setPais, paisConfig, idioma, locale, moneda, simboloMoneda,
        t, calcularCO2, formatearCO2, formatMoney, convertirDesdeBase, formatDate
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = (): CountryContextType => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry debe ser utilizado dentro de un CountryProvider');
  }
  return context;
};