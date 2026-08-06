import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, DollarSign, Zap, Users, RefreshCw, AlertTriangle, CheckCircle2, Leaf, PiggyBank, ShieldCheck, TreePine, Car, Smartphone, Info } from 'lucide-react';
import type { DashboardStats, AnalisisResponse } from '../types';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCountry } from '../context/CountryContext';

export const DashboardView: React.FC<{ onSelectAnalisis?: (a: AnalisisResponse) => void }> = ({ onSelectAnalisis }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [ecoMode, setEcoMode] = useState<'arboles' | 'km' | 'movil'>('arboles');
  const [showEcoInfo, setShowEcoInfo] = useState(false);
  const { showToast } = useToast();
  const { t, paisConfig, formatMoney, convertirDesdeBase, formatDate } = useCountry();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiService.obtenerDashboardStats();
      setStats(data);
    } catch (err) {
      showToast(t('dash.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

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
    { name: t('dash.efficient'),   valor: stats.distribucionCategorias.Eficiente  || 0, color: '#10b981' },
    { name: t('dash.moderate'),    valor: stats.distribucionCategorias.Moderado    || 0, color: '#f59e0b' },
    { name: t('dash.inefficient'), valor: stats.distribucionCategorias.Ineficiente || 0, color: '#f43f5e' },
  ];

  // Conversiones con moneda del contexto
  const gastoAcumulado       = convertirDesdeBase(stats.costoTotalEstimado);
  const ahorroPotencialBase  = Math.round(stats.costoTotalEstimado * 0.22 * 100) / 100;
  const ahorroPotencial      = convertirDesdeBase(ahorroPotencialBase);
  const ahorroAnual          = convertirDesdeBase(ahorroPotencialBase * 12);

  // Huella de carbono con factor del país
  const huellaCarbonoCo2        = Math.round(stats.consumoPromedioKwh * paisConfig.factorCO2 * 10) / 10;
  const arbolesEquivalentes     = Math.ceil(huellaCarbonoCo2 / 18);
  const kmVehiculoEquivalente   = Math.round(huellaCarbonoCo2 * 5.2);
  const recargasMovilEquivalente = Math.round(huellaCarbonoCo2 * 80);
  const scoreEficiencia         = Math.min(98, Math.max(45, Math.round(100 - (stats.consumoPromedioKwh / 5.5))));

  const getBadgeClass = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('efi')) return 'badge-efficient';
    if (c.includes('mod')) return 'badge-moderate';
    return 'badge-inefficient';
  };

  return (
    <div className="view-container animate-fade-in">
      {/* Encabezado — sin selector de moneda */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity color="var(--color-emerald-500)" /> {t('dash.title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('dash.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Badge país activo (reemplaza el selector de moneda) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)', borderRadius: '20px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-emerald-600)', whiteSpace: 'nowrap' }}>
            <span>{paisConfig.bandera}</span>
            <span>{paisConfig.nombre} · {paisConfig.moneda}</span>
          </div>
          <button onClick={loadData} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <RefreshCw size={15} /> {t('dash.refresh')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Diagnósticos */}
        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('dash.totalDiagnostics')}</span>
            <Users size={18} color="var(--color-cyan-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalConsultas}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan-500)', fontWeight: 600, marginTop: '4px' }}>{t('dash.savedAudits')}</div>
        </div>

        {/* Consumo Promedio */}
        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('dash.avgConsumption')}</span>
            <Zap size={18} color="var(--color-emerald-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {stats.consumoPromedioKwh} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>kWh</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald-500)', fontWeight: 600, marginTop: '4px' }}>{t('dash.avgAudits')}</div>
        </div>

        {/* Gasto Acumulado */}
        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('dash.accumulatedCost')} ({paisConfig.moneda})</span>
            <DollarSign size={18} color="var(--color-amber-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '1.7rem', fontWeight: 800 }}>{formatMoney(gastoAcumulado)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-amber-500)', fontWeight: 600, marginTop: '4px' }}>{paisConfig.nombre}</div>
        </div>

        {/* Ahorro Potencial */}
        <div className="saas-card" style={{ borderLeft: '4px solid var(--color-emerald-500)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('dash.potentialSavings')} ({paisConfig.moneda})</span>
            <PiggyBank size={18} color="var(--color-emerald-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-emerald-500)' }}>{formatMoney(ahorroPotencial)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald-600)', fontWeight: 600, marginTop: '4px' }}>
            {t('dash.savingsHint')} · {t('dash.annualSavings')}: {formatMoney(ahorroAnual)}
          </div>
        </div>

        {/* Score Energético */}
        <div className="saas-card" style={{ borderLeft: '4px solid var(--color-cyan-500)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('dash.energyScore')}</span>
            <ShieldCheck size={18} color="var(--color-cyan-500)" />
          </div>
          <div className="kpi-number" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-cyan-500)' }}>
            {scoreEficiencia} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan-600)', fontWeight: 600, marginTop: '4px' }}>{t('dash.efficiencyIndex')}</div>
        </div>

        {/* Huella de Carbono */}
        <div className="saas-card" style={{ position: 'relative', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              onClick={() => setShowEcoInfo(!showEcoInfo)}>
              {t('dash.carbonFootprint')} <Info size={14} style={{ color: 'var(--color-emerald-500)' }} />
            </span>
            <Leaf size={18} color="#10b981" />
          </div>
          <div className="kpi-number" style={{ fontSize: '1.7rem', fontWeight: 800 }}>
            {huellaCarbonoCo2} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>kg CO₂</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              {[['arboles', t('dash.ecoTrees')], ['km', t('dash.ecoCar')], ['movil', t('dash.ecoPhone')]].map(([mode, label]) => (
                <button key={mode} type="button" onClick={() => setEcoMode(mode as 'arboles' | 'km' | 'movil')}
                  style={{ background: ecoMode === mode ? 'var(--badge-success-bg)' : 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer', color: ecoMode === mode ? '#10b981' : 'var(--text-muted)' }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              {ecoMode === 'arboles' && <><TreePine size={13} /> {arbolesEquivalentes} {t('dash.co2Trees')}</>}
              {ecoMode === 'km'      && <><Car size={13} /> {t('dash.co2Km').replace('{n}', String(kmVehiculoEquivalente))}</>}
              {ecoMode === 'movil'   && <><Smartphone size={13} /> {t('dash.co2Mobile').replace('{n}', String(recargasMovilEquivalente))}</>}
            </div>
          </div>
          {showEcoInfo && (
            <div style={{ marginTop: '10px', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--color-emerald-500)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              <strong style={{ color: '#10b981', display: 'block', marginBottom: '4px' }}>{t('dash.carbonInfo')}</strong>
              {t('dash.carbonExplain')}
            </div>
          )}
        </div>
      </div>

      {/* Gráfico + Recomendaciones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="saas-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>{t('dash.categoryDistribution')}</h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="saas-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>{t('dash.aiRecommendations')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)', borderRadius: '10px', display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
              <CheckCircle2 size={18} color="var(--badge-success-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--badge-success-text)' }}>{t('dash.rec1Title')}</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{t('dash.rec1Body')}</p>
              </div>
            </div>
            <div style={{ padding: '12px', background: 'var(--badge-warning-bg)', border: '1px solid var(--badge-warning-border)', borderRadius: '10px', display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
              <AlertTriangle size={18} color="var(--badge-warning-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--badge-warning-text)' }}>{t('dash.rec2Title')}</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{t('dash.rec2Body')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Diagnósticos Recientes */}
      <div className="saas-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
          🕒 {t('dash.recentRecords')} ({paisConfig.moneda})
        </h3>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>{t('history.colId')}</th>
                <th style={{ padding: '12px' }}>{t('history.colDate')}</th>
                <th style={{ padding: '12px' }}>{t('history.colCategory')}</th>
                <th style={{ padding: '12px' }}>{t('history.colConfidence')}</th>
                <th style={{ padding: '12px' }}>{t('history.colCost')} ({paisConfig.moneda})</th>
                <th style={{ padding: '12px' }}>{t('history.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {stats.analisisRecientes && stats.analisisRecientes.length > 0 ? (
                stats.analisisRecientes.map((item, idx) => {
                  const costoConvertido = convertirDesdeBase(item.costo_estimado_mensual);
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-cyan-600)' }}>{item.identificador}</td>
                      <td style={{ padding: '14px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {formatDate(item.fecha, { dateStyle: 'short' })}
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <span className={`badge ${getBadgeClass(item.categoria)}`}>{item.categoria}</span>
                      </td>
                      <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 600 }}>{(item.probabilidad * 100).toFixed(1)}%</td>
                      <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-emerald-600)' }}>
                        {formatMoney(costoConvertido)}
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <button onClick={() => onSelectAnalisis && onSelectAnalisis(item)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                          {t('dash.details')}
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