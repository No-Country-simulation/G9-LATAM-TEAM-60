import React from 'react';
import { X, Sparkles, Zap, CheckCircle2, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import type { AnalisisResponse } from '../types';
import { useToast } from '../context/ToastContext';

interface ResultsModalProps {
  result: AnalisisResponse | null;
  onClose: () => void;
  onReset: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ result, onClose, onReset }) => {
  const { showToast } = useToast();
  if (!result) return null;

  const getBadgeClass = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('efi')) return 'badge-efficient';
    if (c.includes('mod')) return 'badge-moderate';
    return 'badge-inefficient';
  };

  const isEfi = result.categoria.toLowerCase().includes('efi');
  const isMod = result.categoria.toLowerCase().includes('mod');

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="saas-card animate-fade-in" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        background: 'var(--bg-surface)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px', right: '20px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            width: '32px', height: '32px',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '14px', background: 'var(--bg-primary)', marginBottom: '12px' }}>
            <Sparkles size={32} color={isEfi ? 'var(--color-emerald-500)' : isMod ? 'var(--color-amber-500)' : 'var(--color-rose-500)'} />
          </div>
          <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
            Inferencia IA ID: {result.identificador}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>
            Dictamen del Perfil Energético
          </h2>
          <div className={`badge ${getBadgeClass(result.categoria)}`} style={{ fontSize: '1rem', padding: '6px 20px' }}>
            ● {result.categoria.toUpperCase()}
          </div>
        </div>

        {/* JetBrains Mono Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
              Confianza del Modelo
            </div>
            <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-cyan-500)' }}>
              {(result.probabilidad * 100).toFixed(1)}%
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
              Costo Mensual Estimado
            </div>
            <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-emerald-500)' }}>
              R$ {result.costo_estimado_mensual.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="var(--color-emerald-500)" /> Recomendaciones del Sistema IA:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {result.recomendaciones && result.recomendaciones.length > 0 ? (
              result.recomendaciones.map((rec, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {isEfi ? <CheckCircle2 size={16} color="var(--color-emerald-500)" style={{ flexShrink: 0, marginTop: '2px' }} /> : <AlertTriangle size={16} color="var(--color-amber-500)" style={{ flexShrink: 0, marginTop: '2px' }} />}
                  <span>{rec}</span>
                </div>
              ))
            ) : null}
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => { onReset(); onClose(); }} className="btn btn-secondary" style={{ flex: 1 }}>
            <RefreshCw size={16} /> Nueva Simulación
          </button>
          <button onClick={() => showToast(`Reporte [ID: ${result.identificador}] preparado en PDF`, 'success')} className="btn btn-primary" style={{ flex: 1 }}>
            <Download size={16} /> Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
};
