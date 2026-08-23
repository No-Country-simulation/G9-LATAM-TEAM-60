import React, { useState } from 'react';
import { Zap, Home, Building2 } from 'lucide-react';
import type { AnalisisRequest, AnalisisResponse } from '../types';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCountry } from '../context/CountryContext';

interface SimulationFormProps {
  onSimulationComplete: (res: AnalisisResponse) => void;
}

export const SimulationForm: React.FC<SimulationFormProps> = ({ onSimulationComplete }) => {
  const [region, setRegion] = useState('Centro');
  const [consumo, setConsumo] = useState<number | ''>(240);
  const [pico, setPico] = useState(false);
  const [equipos, setEquipos] = useState<number | ''>(6);
  const [inmueble, setInmueble] = useState('Casa');
  const [horas, setHoras] = useState<number | ''>(4);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { t, paisConfig, formatMoney, convertirDesdeBase, formatearCO2 } = useCountry();

  const inmuebles = [
    { id: 'Casa', label: t('sim.house'), icon: Home },
    { id: 'Departamento', label: t('sim.apartment'), icon: Building2 },
  ];

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const req: AnalisisRequest = {
        region,
        consumo_kwh: Number(consumo) || 10,
        uso_horario_pico: pico,
        cantidad_equipos: Number(equipos) || 1,
        tipo_inmueble: inmueble,
        horas_alto_consumo: Number(horas) || 0,
        moneda: paisConfig.moneda,
        simboloMoneda: paisConfig.simboloMoneda
      };
      const response = await apiService.analizarConsumo(req);
      response.moneda = paisConfig.moneda;
      response.simboloMoneda = paisConfig.simboloMoneda;
      showToast(`${t('sim.success')} — ${paisConfig.bandera} ${paisConfig.moneda}`, 'success');
      onSimulationComplete(response);
    } catch (err) {
      showToast(t('sim.error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const consumoNum = Number(consumo) || 0;
  const costoEstimado = convertirDesdeBase(consumoNum * 0.75);
  const co2Estimado = formatearCO2(consumoNum);

  const getConsumoColor = () => {
    if (consumoNum > 400) return 'var(--color-rose-500)';
    if (consumoNum > 200) return 'var(--color-amber-500)';
    return 'var(--color-emerald-500)';
  };

  return (
    <div className="saas-card animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto 60px', padding: '36px' }}>
      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--badge-success-bg)', padding: '12px', borderRadius: '12px', color: 'var(--color-emerald-500)', flexShrink: 0 }}>
          <Zap size={26} />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('sim.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{t('sim.subtitle')}</p>
        </div>
        {/* Badge de País Activo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: 'var(--badge-success-bg)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-emerald-600)', flexShrink: 0, whiteSpace: 'nowrap' }}>
          <span>{paisConfig.bandera}</span>
          <span>{paisConfig.nombre} · {paisConfig.moneda}</span>
        </div>
      </div>

      <form onSubmit={handleSimulate}>
        {/* Tipo de Inmueble */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {t('sim.step1')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {inmuebles.map((item) => {
              const Icon = item.icon;
              const isSel = inmueble === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setInmueble(item.id)}
                  style={{
                    background: isSel ? 'var(--badge-success-bg)' : 'var(--bg-surface)',
                    border: `1px solid ${isSel ? 'var(--color-emerald-500)' : 'var(--border-color)'}`,
                    borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'center'
                  }}
                >
                  <Icon size={24} color={isSel ? 'var(--color-emerald-600)' : 'var(--text-muted)'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontWeight: isSel ? 700 : 500, fontSize: '0.85rem', color: isSel ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sliders con Inputs Numéricos Editables */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '28px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t('sim.consumption')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input
                  type="number"
                  min="0"
                  max="2500"
                  value={consumo}
                  onChange={(e) => setConsumo(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  style={{
                    width: '68px',
                    border: 'none',
                    background: 'transparent',
                    color: getConsumoColor(),
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    textAlign: 'right',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: getConsumoColor() }}>kWh</span>
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="5"
              value={consumo === '' ? 10 : Math.min(1000, Number(consumo))}
              onChange={(e) => setConsumo(Number(e.target.value))}
              style={{ width: '100%', accentColor: getConsumoColor(), cursor: 'pointer' }}
            />
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t('sim.appliances')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={equipos}
                  onChange={(e) => setEquipos(e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
                  style={{
                    width: '52px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-cyan-500)',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    textAlign: 'right',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-cyan-500)' }}>uds</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={equipos === '' ? 1 : Math.min(30, Number(equipos))}
              onChange={(e) => setEquipos(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-cyan-500)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t('sim.highHours')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={horas}
                  onChange={(e) => setHoras(e.target.value === '' ? '' : Math.max(0, Math.min(24, Number(e.target.value))))}
                  style={{
                    width: '44px',
                    border: 'none',
                    background: 'transparent',
                    color: '#818cf8',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    textAlign: 'right',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8' }}>hrs/d</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              value={horas === '' ? 0 : Math.min(14, Number(horas))}
              onChange={(e) => setHoras(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#818cf8', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Región y Horario Pico */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {t('sim.region')}
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'Norte', label: t('sim.north') },
                { id: 'Centro', label: t('sim.center') },
                { id: 'Sur', label: t('sim.south') }
              ].map((r) => (
                <button key={r.id} type="button" onClick={() => setRegion(r.id)}
                  className={`btn ${region === r.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 14px', fontSize: '0.8rem', flex: '1 1 120px' }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t('sim.peakHours')}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('sim.peakHint')}</div>
            </div>
            <button type="button" onClick={() => setPico(!pico)}
              className={`btn ${pico ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 16px', fontSize: '0.8rem', background: pico ? 'var(--color-amber-500)' : undefined }}>
              {pico ? t('sim.peak.yes') : t('sim.peak.no')}
            </button>
          </div>
        </div>

        {/* Estimaciones previas + Botón */}
        <div style={{ background: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)', padding: '20px 24px', borderRadius: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--badge-success-text)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                {t('sim.projectedCost')} ({paisConfig.moneda})
              </div>
              <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatMoney(costoEstimado)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--badge-success-text)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                {t('sim.co2Estimate')}
              </div>
              <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-emerald-600)' }}>
                🌿 {co2Estimado}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              {loading ? t('sim.btnLoading') : t('sim.btnRun')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};