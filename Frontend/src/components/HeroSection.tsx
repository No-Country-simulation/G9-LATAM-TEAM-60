import React from 'react';
import { Sparkles, ArrowRight, Activity, ShieldCheck, Zap, DollarSign } from 'lucide-react';

interface HeroSectionProps {
  onStartSimulation: () => void;
  onViewDashboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartSimulation, onViewDashboard }) => {
  return (
    <div style={{ padding: '40px 24px 20px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Badge Superior */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div className="badge badge-efficient animate-float" style={{ padding: '8px 20px', fontSize: '0.85rem', gap: '8px', boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)' }}>
          <Sparkles size={16} /> Hackathon OCI LATAM 2026 — Grupo 9 (Equipo 60)
        </div>
      </div>

      {/* Titulo y Subtitulo */}
      <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 36px' }}>
        <h1 style={{ fontSize: '3.6rem', lineHeight: 1.1, marginBottom: '20px', fontWeight: 800 }}>
          Revoluciona tu Consumo con <br />
          <span className="gradient-text">Inteligencia Artificial & Ciencia de Datos</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto' }}>
          Predicción en tiempo real de patrones energéticos, clasificación automatizada mediante <strong style={{ color: '#34d399' }}>Regresión Logística / Random Forest</strong> y cálculo financiero instantáneo a tarifa de R$ 0.75/kWh.
        </p>
      </div>

      {/* Botones de Acción CTA */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '48px' }}>
        <button 
          onClick={onStartSimulation} 
          className="btn btn-primary"
          style={{ padding: '16px 36px', fontSize: '1.1rem', borderRadius: '16px', boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)' }}
        >
          <Zap size={20} /> Comenzar Simulación Ahora <ArrowRight size={20} />
        </button>
        <button 
          onClick={onViewDashboard} 
          className="btn btn-secondary"
          style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '16px' }}
        >
          <Activity size={20} /> Explorar Dashboard Analítico
        </button>
      </div>

      {/* Tarjetas Flotantes de Métricas Rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', margin: '0 16px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '14px', color: '#10b981' }}>
            <Activity size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Motor ML Inferencia</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>F1-Score: 0.835</div>
            <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Regresión Logística Calibrada</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '12px', borderRadius: '14px', color: '#06b6d4' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Cálculo Financiero</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>R$ 0.75 / kWh</div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Tarifa oficial normada</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '12px', borderRadius: '14px', color: '#6366f1' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Arquitectura OCI Ready</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>100% Resiliente</div>
            <div style={{ fontSize: '0.75rem', color: '#818cf8' }}>Spring Boot + Python FastAPI</div>
          </div>
        </div>
      </div>
    </div>
  );
};
