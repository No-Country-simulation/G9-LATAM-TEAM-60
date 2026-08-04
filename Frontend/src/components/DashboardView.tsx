import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, DollarSign, Zap, Users, RefreshCw, AlertTriangle, CheckCircle2, Leaf, PiggyBank, ShieldCheck, TreePine, Coins, Car, Smartphone, Info } from 'lucide-react';
import type { DashboardStats, AnalisisResponse } from '../types';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { CURRENCIES, convertFromBaseCost, formatMoney } from '../utils/currency';

export const DashboardView: React.FC<{ onSelectAnalisis?: (a: AnalisisResponse) => void }> = ({ onSelectAnalisis }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('CLP');
  const [ecoMode, setEcoMode] = useState<'arboles' | 'km' | 'movil'>('arboles');
  const [showEcoInfo, setShowEcoInfo] = useState(false);
  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiService.obtenerDashboardStats();
      setStats(data);
    } catch (err) {
      showToast('Error cargando datos del dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '32px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="saas-card" style={{ height: '120px' }}>
              <div className="skeleton" style={{ width: '40%', height: '16px', marginBottom: '16px' }}></div>
              <div className="skeleton" style={{ width: '70%', height: '32px' }}></div>
            </div>
          ))}
        </div>
        <div className="saas-card" style={{ height: '320px' }}>
          <div className="skeleton" style={{ width: '30%', height: '24px', marginBottom: '20px' }}></div>
          <div className="skeleton" style={{ width: '100%', height: '220px' }}></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const chartData = [
    { name: 'Eficiente', valor: stats.distribucionCategorias.Eficiente || 0, color: '#10b981' },
    { name: 'Moderado', valor: stats.distribucionCategorias.Moderado || 0, color: '#f59e0b' },
    { name: 'Ineficiente', valor: stats.distribucionCategorias.Ineficiente || 0, color: '#f43f5e' },
  ];

  // Conversión de Monedas
  const currentCurrency = CURRENCIES[selectedCurrency] || CURRENCIES.CLP;
  const gastoAcumuladoConvertido = convertFromBaseCost(stats.costoTotalEstimado, selectedCurrency);
  const ahorroPotencialBase = Math.round(stats.costoTotalEstimado * 0.22 * 100) / 100;
  const ahorroPotencialConvertido = convertFromBaseCost(ahorroPotencialBase, selectedCurrency);

  // Métricas avanzadas de impacto
  const huellaCarbonoCo2 = Math.round(stats.consumoPromedioKwh * 0.385 * 10) / 10;
  const arbolesEquivalentes = Math.ceil(huellaCarbonoCo2 / 18);
  const kmVehiculoEquivalente = Math.round(huellaCarbonoCo2 * 5.2);
  const recargasMovilEquivalente = Math.round(huellaCarbonoCo2 * 80);
  const scoreEficiencia = Math.min(98, Math.max(45, Math.round(100 - (stats.consumoPromedioKwh / 5.5))));

  const getBadgeClass = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('efi')) return 'badge-efficient';
    if (c.includes('mod')) return 'badge-moderate';
    return 'badge-inefficient';
  };

  return (
    <div className="view-container animate-fade-in">
      {/* Encabezado Dashboard y Selector de Moneda */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity color="var(--color-emerald-500)" /> Dashboard Ejecutivo de Eficiencia
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Indicadores de consumo personalizado, potencial de ahorro financiero e impacto ambiental.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Selector de Moneda LATAM */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '4px 8px', gap: '4px' }}>
            <Coins size={16} color="var(--color-amber-500)" style={{ marginLeft: '4px' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>MONEDA:</span>
            {Object.values(CURRENCIES).map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setSelectedCurrency(c.code)}
                className={`btn ${selectedCurrency === c.code ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '8px', border: 'none', background: selectedCurrency === c.code ? 'var(--color-emerald-600)' : 'transparent', color: selectedCurrency === c.code ? '#fff' : 'var(--text-secondary)' }}
              >
                <span>{c.flag}</span> <strong style={{ marginLeft: '2px' }}>{c.code}</strong>
              </button>
            ))}
          </div>

          <button onClick={loadData} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <RefreshCw size={15} /> Actualizar KPIs
          </button>
        </div>
      </div>

      {/* Tarjetas KPI Responsivas Ampliadas (6 tarjetas de alto valor) */}
      <div className="dashboard-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tus Diagnósticos</span>
            <Users size={18} color="var(--color-cyan-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalConsultas}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan-500)', fontWeight: 600, marginTop: '4px' }}>Auditorías guardadas</div>
        </div>

        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Consumo Promedio</span>
            <Zap size={18} color="var(--color-emerald-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {stats.consumoPromedioKwh} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>kWh</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald-500)', fontWeight: 600, marginTop: '4px' }}>Promedio de tus auditorías</div>
        </div>

        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gasto Acumulado ({selectedCurrency})</span>
            <DollarSign size={18} color="var(--color-amber-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatMoney(gastoAcumuladoConvertido, selectedCurrency)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-amber-500)', fontWeight: 600, marginTop: '4px' }}>Costo total en {currentCurrency.name}</div>
        </div>

        <div className="saas-card" style={{ borderLeft: '4px solid var(--color-emerald-500)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ahorro Potencial ({selectedCurrency})</span>
            <PiggyBank size={18} color="var(--color-emerald-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-emerald-500)' }}>
            {formatMoney(ahorroPotencialConvertido, selectedCurrency)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald-600)', fontWeight: 600, marginTop: '4px' }}>Optimizable (~22% reducción)</div>
        </div>

        <div className="saas-card" style={{ borderLeft: '4px solid var(--color-cyan-500)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score Energético</span>
            <ShieldCheck size={18} color="var(--color-cyan-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-cyan-500)' }}>
            {scoreEficiencia} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan-600)', fontWeight: 600, marginTop: '4px' }}>Índice de Eficiencia IA</div>
        </div>

        {/* Tarjeta Enriquecida de Huella de Carbono */}
        <div className="saas-card" style={{ position: 'relative', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span 
              style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              onClick={() => setShowEcoInfo(!showEcoInfo)} 
              title="¿Para qué sirve este indicador?"
            >
              Huella de Carbono
              <Info 
                size={14} 
                style={{ color: 'var(--color-emerald-500)' }} 
              />
            </span>
            <Leaf size={18} color="#10b981" />
          </div>

          <div className="kpi-number" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {huellaCarbonoCo2} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>kg CO₂</span>
          </div>

          {/* Selector de Equivalencias Ecológicas */}
          <div style={{ marginTop: '8px', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <button 
                type="button"
                onClick={() => setEcoMode('arboles')}
                style={{ background: ecoMode === 'arboles' ? 'var(--badge-success-bg)' : 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer', color: ecoMode === 'arboles' ? '#10b981' : 'var(--text-muted)' }}
              >
                🌲 Árboles
              </button>
              <button 
                type="button"
                onClick={() => setEcoMode('km')}
                style={{ background: ecoMode === 'km' ? 'var(--badge-success-bg)' : 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer', color: ecoMode === 'km' ? '#10b981' : 'var(--text-muted)' }}
              >
                🚗 Auto (Km)
              </button>
              <button 
                type="button"
                onClick={() => setEcoMode('movil')}
                style={{ background: ecoMode === 'movil' ? 'var(--badge-success-bg)' : 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer', color: ecoMode === 'movil' ? '#10b981' : 'var(--text-muted)' }}
              >
                📱 Móniles
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              {ecoMode === 'arboles' && <><TreePine size={13} /> {arbolesEquivalentes} árboles para neutralizar (1 año)</>}
              {ecoMode === 'km' && <><Car size={13} /> Equivale a {kmVehiculoEquivalente} km recorridos en auto</>}
              {ecoMode === 'movil' && <><Smartphone size={13} /> Equivale a {recargasMovilEquivalente} recargas de smartphone</>}
            </div>
          </div>

          {/* Cuadro desplegable explicativo de la utilidad de la Huella de Carbono */}
          {showEcoInfo && (
            <div style={{ marginTop: '10px', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--color-emerald-500)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              <strong style={{ color: '#10b981', display: 'block', marginBottom: '4px' }}>¿Para qué sirve este indicador?</strong>
              Traduce tu consumo eléctrico (kWh) en emisiones de CO₂ (factor 0.385 kg/kWh). Te permite medir tu impacto ecológico real, cumplir objetivos de sostenibilidad ESG y visibilizar cuántos árboles se necesitan para neutralizar tu consumo.
            </div>
          )}
        </div>
      </div>

      {/* Secciones Gráficas & Resumen */}
      <div className="dashboard-grid-dual" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        
        {/* Gráfico Recharts */}
        <div className="saas-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
            📊 Categorización Energética
          </h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Indicadores de Ahorro y Recomendaciones Inteligentes */}
        <div className="saas-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
            💡 Recomendaciones Inteligentes de IA
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)', borderRadius: '10px', display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
              <CheckCircle2 size={18} color="var(--badge-success-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--badge-success-text)' }}>Optimización de Horario Pico:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Desplaza lavadoras y climatizadores fuera de las 18:00 - 22:00 hs para reducir tu factura hasta en 20%.</p>
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--badge-warning-bg)', border: '1px solid var(--badge-warning-border)', borderRadius: '10px', display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
              <AlertTriangle size={18} color="var(--badge-warning-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--badge-warning-text)' }}>Alerta de Consumo Moderado:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Revisa electrodomésticos antiguos en modo Standby para mitigar el consumo vampiro.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tabla de Diagnósticos Recientes con JetBrains Mono */}
      <div className="saas-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
          🕒 Registros Energéticos Recientes ({selectedCurrency})
        </h3>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Identificador</th>
                <th style={{ padding: '12px' }}>Fecha</th>
                <th style={{ padding: '12px' }}>Categoría ML</th>
                <th style={{ padding: '12px' }}>Confianza</th>
                <th style={{ padding: '12px' }}>Costo Proyectado ({selectedCurrency})</th>
                <th style={{ padding: '12px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {stats.analisisRecientes && stats.analisisRecientes.length > 0 ? (
                stats.analisisRecientes.map((item, idx) => {
                  const costoConvertido = convertFromBaseCost(item.costo_estimado_mensual, selectedCurrency);
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-cyan-600)' }}>{item.identificador}</td>
                      <td style={{ padding: '14px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.fecha ? new Date(item.fecha).toLocaleDateString('es-ES') : 'Hoy'}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <span className={`badge ${getBadgeClass(item.categoria)}`}>{item.categoria}</span>
                      </td>
                      <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 600 }}>{(item.probabilidad * 100).toFixed(1)}%</td>
                      <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-emerald-600)' }}>
                        {formatMoney(costoConvertido, selectedCurrency)}
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <button onClick={() => onSelectAnalisis && onSelectAnalisis(item)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                          Detalles
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

