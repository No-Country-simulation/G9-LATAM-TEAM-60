import React from 'react';
import { Settings as SettingsIcon, Globe, Leaf, DollarSign, ShieldCheck } from 'lucide-react';
import { useCountry } from '../context/CountryContext';
import { ENERGIA_POR_PAIS } from '../utils/country';

export const ConfiguracionView: React.FC = () => {
  const { pais, setPais, paisConfig, moneda, t } = useCountry();

  return (
    <div className="view-container animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div className="saas-card" style={{ padding: '32px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '18px' }}>
          <div style={{ background: 'var(--badge-success-bg)', padding: '12px', borderRadius: '12px', color: 'var(--color-cyan-500)' }}>
            <SettingsIcon size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {t('config.title')}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {t('config.subtitle')}
            </p>
          </div>
        </div>

        {/* Selector Principal de País de Residencia */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
            <Globe size={18} color="var(--color-emerald-500)" /> {t('config.activeCountry')}
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {Object.values(ENERGIA_POR_PAIS).map(p => {
              const isSelected = pais === p.codigo;
              return (
                <button
                  key={p.codigo}
                  type="button"
                  onClick={() => setPais(p.codigo as 'AR' | 'CL' | 'BR' | 'US')}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid var(--color-emerald-500)' : '1px solid var(--border-color)',
                    background: isSelected ? 'var(--badge-success-bg)' : 'var(--bg-primary)',
                    color: isSelected ? 'var(--color-emerald-600)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{p.bandera}</span>
                  <strong style={{ fontSize: '1rem' }}>{p.nombre}</strong>
                  <span style={{ fontSize: '0.75rem', opacity: 0.85, color: isSelected ? 'var(--color-emerald-600)' : 'var(--text-muted)' }}>
                    {p.moneda} ({p.simboloMoneda}) | {p.factorCO2} {p.unidad}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resumen de Parámetros del País Seleccionado */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          background: 'var(--bg-primary)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} color="var(--color-emerald-500)" /> {t('config.countryLanguage')}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {paisConfig.nombre} {paisConfig.bandera}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Idioma: {paisConfig.idioma === 'es' ? 'Español' : paisConfig.idioma === 'pt' ? 'Português' : 'English'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={14} color="var(--color-amber-500)" /> {t('config.localCurrency')}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-amber-500)' }}>
              {moneda} ({paisConfig.simboloMoneda})
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Standard ISO 4217
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Leaf size={14} color="var(--color-cyan-500)" /> {t('config.co2Factor')}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-cyan-500)' }}>
              {paisConfig.factorCO2} {paisConfig.unidad}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Standard internacional por kWh
            </div>
          </div>
        </div>
      </div>

      {/* Información Técnica Adicional */}
      <div className="saas-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck color="var(--color-emerald-500)" /> {t('config.infrastructure')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              {t('config.mlModel')}
            </label>
            <input type="text" readOnly value="Scikit-Learn Random Forest Classifier & Regressor v1.4" className="saas-input font-mono" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              {t('config.cloudInfra')}
            </label>
            <input type="text" readOnly value="Oracle Cloud Infrastructure (OCI) Enterprise" className="saas-input font-mono" />
          </div>
        </div>
      </div>
    </div>
  );
};
