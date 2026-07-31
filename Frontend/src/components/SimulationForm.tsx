import React, { useState } from 'react';
import { Zap, Home, Building2, Briefcase, ShoppingBag, Factory } from 'lucide-react';
import type { AnalisisRequest, AnalisisResponse } from '../types';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

interface SimulationFormProps {
  onSimulationComplete: (res: AnalisisResponse) => void;
}

export const SimulationForm: React.FC<SimulationFormProps> = ({ onSimulationComplete }) => {
  const [region, setRegion] = useState('Centro');
  const [consumo, setConsumo] = useState(240);
  const [pico, setPico] = useState(false);
  const [equipos, setEquipos] = useState(6);
  const [inmueble, setInmueble] = useState('Casa');
  const [horas, setHoras] = useState(4);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const inmuebles = [
    { id: 'Casa', label: 'Casa / Residencial', icon: Home },
    { id: 'Departamento', label: 'Departamento', icon: Building2 },
    { id: 'Oficina', label: 'Oficina Comercial', icon: Briefcase },
    { id: 'Comercio', label: 'Local Retail', icon: ShoppingBag },
    { id: 'Industria', label: 'Nave Industrial', icon: Factory },
  ];



  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const req: AnalisisRequest = {
        region,
        consumo_kwh: Number(consumo),
        uso_horario_pico: pico,
        cantidad_equipos: Number(equipos),
        tipo_inmueble: inmueble,
        horas_alto_consumo: Number(horas)
      };
      const response = await apiService.analizarConsumo(req);
      showToast('Simulación ejecutada con éxito por el Modelo ML', 'success');
      onSimulationComplete(response);
    } catch (err) {
      showToast('Error procesando la simulación', 'error');
    } finally {
      setLoading(false);
    }
  };

  const costoEstimado = Math.round(consumo * 0.75 * 100) / 100;

  const getConsumoColor = () => {
    if (consumo > 400) return 'var(--color-rose-500)';
    if (consumo > 200) return 'var(--color-amber-500)';
    return 'var(--color-emerald-500)';
  };

  return (
    <div className="saas-card animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto 60px', padding: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <div style={{ background: 'var(--badge-success-bg)', padding: '12px', borderRadius: '12px', color: 'var(--color-emerald-500)' }}>
          <Zap size={26} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Simulador de Consumo e Inferencia IA</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Ajusta los parámetros energéticos para obtener la categorización ML y estimación tarifaria a R$ 0.75/kWh.
          </p>
        </div>
      </div>

      <form onSubmit={handleSimulate}>
        {/* Paso 1: Tipo de Inmueble */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
            1. Selecciona el Tipo de Inmueble
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
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
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

        {/* Paso 2: Sliders con JetBrains Mono */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '28px' }}>
          
          <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Consumo Mensual (kWh)</span>
              <span className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: getConsumoColor() }}>
                {consumo} kWh
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="5"
              value={consumo}
              onChange={(e) => setConsumo(Number(e.target.value))}
              style={{ width: '100%', accentColor: getConsumoColor(), cursor: 'pointer' }}
            />
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Equipos / Electrodomésticos</span>
              <span className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-cyan-500)' }}>
                {equipos}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={equipos}
              onChange={(e) => setEquipos(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-cyan-500)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Horas de Alto Consumo</span>
              <span className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#818cf8' }}>
                {horas} hrs/día
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              value={horas}
              onChange={(e) => setHoras(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#818cf8', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Región y Horario Pico */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Zona Climática / Región (Chile & Argentina)
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'Norte', label: 'Zona Norte (Atacama / NOA-NEA)' },
                { id: 'Centro', label: 'Zona Centro (Stgo / B. Aires)' },
                { id: 'Sur', label: 'Zona Sur (Patagonia / Austral)' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRegion(r.id)}
                  className={`btn ${region === r.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 14px', fontSize: '0.8rem', flex: '1 1 120px' }}
                  title={r.label}
                >
                  {r.id === 'Norte' ? '🌵 Norte' : r.id === 'Centro' ? '🏙️ Centro' : '❄️ Sur'}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              {region === 'Norte' && 'Región Norte: Clima árido/cálido con alta demanda de refrigeración.'}
              {region === 'Centro' && 'Región Centro: Clima templado (Santiago, Mendoza, Buenos Aires).'}
              {region === 'Sur' && 'Región Sur: Clima frío/patagónico con mayor consumo de calefacción.'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>¿Uso en Horario Pico (18:00 - 22:00)?</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Horas de alta demanda de red.</div>
            </div>
            <button
              type="button"
              onClick={() => setPico(!pico)}
              className={`btn ${pico ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 16px', fontSize: '0.8rem', background: pico ? 'var(--color-amber-500)' : undefined }}
            >
              {pico ? 'SÍ' : 'NO'}
            </button>
          </div>
        </div>

        {/* Resumen Financiero y Botón */}
        <div style={{ background: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)', padding: '20px 24px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--badge-success-text)', textTransform: 'uppercase', fontWeight: 700 }}>
              Costo Mensual Estimado (R$ 0.75/kWh)
            </div>
            <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              R$ {costoEstimado.toFixed(2)}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
            {loading ? '⚡ Procesando con IA...' : '🚀 Ejecutar Diagnóstico IA'}
          </button>
        </div>
      </form>
    </div>
  );
};
