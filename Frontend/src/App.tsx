import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SimulationForm } from './components/SimulationForm';
import { HistoryView } from './components/HistoryView';
import { ConfiguracionView } from './components/ConfiguracionView';
import { ResultsModal } from './components/ResultsModal';
import { AuthModal } from './components/AuthModal';
import { AmbientBackground } from './components/AmbientBackground';
import type { AnalisisResponse } from './types';
import { Globe, ExternalLink, Lightbulb, Lock } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLanding, setIsLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('simulador');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalisisResponse | null>(null);

  // Redireccionar al Landing Page automáticamente si el usuario cierra sesión
  useEffect(() => {
    if (!user) {
      setIsLanding(true);
      setActiveTab('simulador');
    }
  }, [user]);

  // Manejar intento de navegar a pestañas protegidas en Modo Prueba (Guest)
  const handleTabChange = (tab: string) => {
    if (!user && tab !== 'simulador') {
      showToast('Sección restringida: Inicia sesión para habilitar esta pestaña', 'info');
      setAuthOpen(true);
      return;
    }
    setActiveTab(tab);
    setIsLanding(false);
  };

  const handleStartSimulation = () => {
    setIsLanding(false);
    setActiveTab('simulador');
  };

  if (isLanding && !user) {
    return (
      <div style={{ position: 'relative' }}>
        <AmbientBackground />
        <LandingPage 
          onStartSimulation={handleStartSimulation} 
          onOpenAuth={() => setAuthOpen(true)} 
        />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      <AmbientBackground />
      {/* Sidebar Colapsable con Drawer Flotante en Móviles */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        onOpenAuth={() => setAuthOpen(true)}
      />

      {/* Área Principal de Contenido SaaS */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar 
          activeTab={activeTab} 
          onOpenAuth={() => setAuthOpen(true)} 
          onGoLanding={() => setIsLanding(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Banner de Modo Prueba cuando no hay usuario logueado */}
        {!user && (
          <div style={{
            background: 'var(--badge-warning-bg)',
            borderBottom: '1px solid var(--badge-warning-border)',
            color: 'var(--badge-warning-text)',
            padding: '10px 20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} />
              <span>Estás navegando en <strong>Modo Prueba (Guest)</strong>. Regístrate o inicia sesión para habilitar el Dashboard, Historial y Configuración.</span>
            </div>
            <button onClick={() => setAuthOpen(true)} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
              Iniciar Sesión / Registro
            </button>
          </div>
        )}

        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && user && (
            <DashboardView onSelectAnalisis={(res) => setCurrentResult(res)} />
          )}

          {activeTab === 'simulador' && (
            <div className="view-container">
              <SimulationForm onSimulationComplete={(res) => setCurrentResult(res)} />
            </div>
          )}

          {activeTab === 'historial' && user && (
            <HistoryView onSelectAnalisis={(res) => setCurrentResult(res)} />
          )}

          {activeTab === 'recomendaciones' && user && (
            <div className="view-container">
              <div className="saas-card">
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Lightbulb color="var(--color-amber-500)" /> Recomendaciones & Planes de Eficiencia
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                  Generación automatizada de directivas de ahorro basadas en tu perfil de consumo y las inferencias del modelo de Machine Learning.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                  <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-emerald-600)', marginBottom: '8px' }}>1. Desplazamiento Horario (Peak Shaving)</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Evita el encendido de cargas resistivas (hornos, secadoras, climatización) entre 18:00 y 22:00 hs para prevenir la tarifa pico.
                    </p>
                  </div>
                  <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-cyan-600)', marginBottom: '8px' }}>2. Migración a Tecnología LED</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Sustituye luminarias fluorescentes o incandescentes por sistemas LED inteligentes con sensores de presencia.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'configuracion' && user && (
            <div className="view-container">
              <ConfiguracionView />
            </div>
          )}
        </main>

        {/* Footer App */}
        <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '20px 28px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>© 2026 EnergiAI — Enterprise SaaS Platform for Energy Efficiency.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span onClick={() => setIsLanding(true)} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Ver Landing Page</span>
            <a href="https://github.com/No-Country-simulation/G9-LATAM-TEAM-60" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-emerald-600)', fontWeight: 600 }}>
              <Globe size={14} /> GitHub Repo <ExternalLink size={12} />
            </a>
          </div>
        </footer>
      </div>

      {/* Modales */}
      <ResultsModal result={currentResult} onClose={() => setCurrentResult(null)} onReset={() => setCurrentResult(null)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

import { CountryProvider } from './context/CountryContext';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CountryProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </CountryProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
