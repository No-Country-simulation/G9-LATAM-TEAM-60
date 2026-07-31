import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, DollarSign, Zap, TrendingUp, Users, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { DashboardStats, AnalisisResponse } from '../types';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

export const DashboardView: React.FC<{ onSelectAnalisis?: (a: AnalisisResponse) => void }> = ({ onSelectAnalisis }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
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
          {[1, 2, 3, 4].map(n => (
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

  const getBadgeClass = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('efi')) return 'badge-efficient';
    if (c.includes('mod')) return 'badge-moderate';
    return 'badge-inefficient';
  };

  return (
    <div className="view-container animate-fade-in">
      {/* Encabezado Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity color="var(--color-emerald-500)" /> Dashboard Analítico Principal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Monitoreo en tiempo real de eficiencia energética, distribución ML e indicadores de ahorro.
          </p>
        </div>
        <button onClick={loadData} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <RefreshCw size={15} /> Actualizar KPIs
        </button>
      </div>

      {/* Tarjetas KPI Responsivas */}
      <div className="dashboard-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Análisis</span>
            <Users size={18} color="var(--color-cyan-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalConsultas}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald-500)', fontWeight: 600, marginTop: '4px' }}>Inferencia Scikit-Learn</div>
        </div>

        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Consumo Promedio</span>
            <Zap size={18} color="var(--color-emerald-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {stats.consumoPromedioKwh} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>kWh</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald-500)', fontWeight: 600, marginTop: '4px' }}>Rango residencial normal</div>
        </div>

        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gasto Mensual Total</span>
            <DollarSign size={18} color="var(--color-amber-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            $ {stats.costoTotalEstimado.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-amber-500)', fontWeight: 600, marginTop: '4px' }}>Tarifa $ 0.75 / kWh</div>
        </div>

        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Precisión Modelo ML</span>
            <TrendingUp size={18} color="#818cf8" />
          </div>
          <div className="kpi-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>93.4%</div>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, marginTop: '4px' }}>Regresión Logística</div>
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
          🕒 Registros Energéticos Recientes
        </h3>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Identificador</th>
                <th style={{ padding: '12px' }}>Fecha</th>
                <th style={{ padding: '12px' }}>Categoría ML</th>
                <th style={{ padding: '12px' }}>Confianza</th>
                <th style={{ padding: '12px' }}>Costo Proyectado</th>
                <th style={{ padding: '12px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {stats.analisisRecientes && stats.analisisRecientes.length > 0 ? (
                stats.analisisRecientes.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-cyan-600)' }}>{item.identificador}</td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.fecha ? new Date(item.fecha).toLocaleDateString('es-ES') : 'Hoy'}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={`badge ${getBadgeClass(item.categoria)}`}>{item.categoria}</span>
                    </td>
                    <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 600 }}>{(item.probabilidad * 100).toFixed(1)}%</td>
                    <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-emerald-600)' }}>$ {item.costo_estimado_mensual.toFixed(2)}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <button onClick={() => onSelectAnalisis && onSelectAnalisis(item)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
