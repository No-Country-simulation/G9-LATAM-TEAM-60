import React from 'react';
import { X, Sparkles, Zap, CheckCircle2, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import type { AnalisisResponse } from '../types';
import { useToast } from '../context/ToastContext';
import { generarComprobantePDF } from '../utils/pdfExporter';

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

  const handleExportPDF = () => {
    generarComprobantePDF(result);
    showToast(`Comprobante Oficial PDF generado para ${result.identificador}`, 'success');
  };

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
      padding: '16px'
    }}>
      <div className="saas-card animate-fade-in" style={{
        maxWidth: '640px',
        width: '100%',
        padding: '24px',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        background: 'var(--bg-surface)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px', right: '16px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            width: '32px', height: '32px',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '14px', background: 'var(--bg-primary)', marginBottom: '10px' }}>
            <Sparkles size={28} color={isEfi ? 'var(--color-emerald-500)' : isMod ? 'var(--color-amber-500)' : 'var(--color-rose-500)'} />
          </div>
          <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
            Inferencia IA ID: {result.identificador}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
            Dictamen del Perfil Energético
          </h2>
          <div className={`badge ${getBadgeClass(result.categoria)}`} style={{ fontSize: '0.9rem', padding: '6px 18px' }}>
            ● {result.categoria.toUpperCase()}
          </div>
        </div>

        {/* Métricas con JetBrains Mono */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
              Confianza del Modelo
            </div>
            <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-cyan-500)' }}>
              {(result.probabilidad * 100).toFixed(1)}%
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
              Costo Mensual Estimado
            </div>
            <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-emerald-500)' }}>
              R$ {result.costo_estimado_mensual.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="var(--color-emerald-500)" /> Recomendaciones del Sistema IA:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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

        {/* Botones Adaptativos (Jamás Sobresalen) */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { onReset(); onClose(); }}
            className="btn btn-secondary"
            style={{ flex: '1 1 160px', padding: '10px 14px', fontSize: '0.85rem', justifyContent: 'center' }}
          >
            <RefreshCw size={15} /> Nueva Simulación
          </button>
          
          <button
            onClick={handleExportPDF}
            className="btn btn-primary"
            style={{ flex: '1 1 160px', padding: '10px 14px', fontSize: '0.85rem', justifyContent: 'center', whiteSpace: 'nowrap' }}
          >
            <FileText size={15} /> Descargar Comprobante PDF
          </button>
        </div>
      </div>
    </div>
  );
};
