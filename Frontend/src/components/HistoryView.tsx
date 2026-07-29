import React, { useEffect, useState } from 'react';
import { History, Search, Download, ExternalLink, RefreshCw } from 'lucide-react';
import type { AnalisisResponse } from '../types';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

export const HistoryView: React.FC<{ onSelectAnalisis: (a: AnalisisResponse) => void }> = ({ onSelectAnalisis }) => {
  const [list, setList] = useState<AnalisisResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await apiService.obtenerHistorial();
      setList(data);
    } catch (err) {
      showToast('Error cargando el historial', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filtered = list.filter(item => 
    item.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    if (list.length === 0) return;
    const headers = 'ID,Identificador,Categoria,Probabilidad,Costo_R$,Fecha\n';
    const rows = list.map(i => `${i.id || ''},${i.identificador},${i.categoria},${i.probabilidad},${i.costo_estimado_mensual},${i.fecha || ''}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_energiai_latam_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Reporte CSV generado y descargado correctamente', 'success');
  };

  const getBadgeClass = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('efi')) return 'badge-efficient';
    if (c.includes('mod')) return 'badge-moderate';
    return 'badge-inefficient';
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1240px', margin: '0 auto 60px', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History color="var(--color-emerald-500)" /> Historial de Auditoría & CSV
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Registro cronológico oficial de inferencias energéticas realizadas por EnergiAI.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={loadHistory} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <RefreshCw size={15} /> Refrescar
          </button>
          <button onClick={exportCSV} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            <Download size={15} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Buscador Global */}
      <div className="saas-card" style={{ marginBottom: '20px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search color="var(--text-muted)" size={18} />
        <input 
          type="text"
          placeholder="Filtrar por identificador (ej. IA-DEMO001) o categoría (Eficiente/Moderado)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="saas-input"
          style={{ border: 'none', background: 'transparent', padding: 0 }}
        />
      </div>

      {/* Tabla con JetBrains Mono */}
      <div className="saas-card" style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div className="skeleton" style={{ width: '100%', height: '200px' }}></div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px' }}>Identificador</th>
                  <th style={{ padding: '12px' }}>Fecha</th>
                  <th style={{ padding: '12px' }}>Categoría</th>
                  <th style={{ padding: '12px' }}>Confianza</th>
                  <th style={{ padding: '12px' }}>Costo Proyectado</th>
                  <th style={{ padding: '12px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-cyan-600)' }}>{item.identificador}</td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {item.fecha ? new Date(item.fecha).toLocaleString('es-ES') : 'Hoy'}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={`badge ${getBadgeClass(item.categoria)}`}>{item.categoria}</span>
                    </td>
                    <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 600 }}>{(item.probabilidad * 100).toFixed(1)}%</td>
                    <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-emerald-600)' }}>R$ {item.costo_estimado_mensual.toFixed(2)}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <button onClick={() => onSelectAnalisis(item)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        Ver <ExternalLink size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
