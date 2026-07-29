import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, LogIn, ChevronRight, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface NavbarProps {
  activeTab: string;
  onOpenAuth: () => void;
  onGoLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onOpenAuth, onGoLanding }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, loginDemo } = useAuth();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const getBreadcrumbLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Ejecutivo';
      case 'simulador': return 'Simulador de Inferencia IA';
      case 'historial': return 'Historial de Auditoría';
      case 'recomendaciones': return 'Recomendaciones Inteligentes';
      case 'configuracion': return 'Configuración del Sistema';
      default: return 'Plataforma Principal';
    }
  };

  return (
    <header style={{
      height: '64px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      {/* Left: Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        <span onClick={onGoLanding} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>EnergiAI</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{getBreadcrumbLabel(activeTab)}</span>
      </div>

      {/* Center: Global Search Input */}
      <div style={{ flex: 1, maxWidth: '420px', margin: '0 24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Búsqueda global (parámetros, ID de diagnóstico, kWh)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="saas-input"
            style={{ paddingLeft: '38px', fontSize: '0.85rem', height: '38px' }}
          />
        </div>
      </div>

      {/* Right: Theme Switcher, Notifications & User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Toggle Modo Claro / Oscuro */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ padding: '8px 12px', borderRadius: '10px' }}
          title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
          {theme === 'light' ? <Moon size={18} color="var(--text-secondary)" /> : <Sun size={18} color="#f59e0b" />}
        </button>

        {/* Notificaciones */}
        <button
          onClick={() => showToast('Sistema de IA operando con 93.4% de precisión.', 'info')}
          className="btn btn-secondary"
          style={{ padding: '8px', position: 'relative' }}
          title="Notificaciones"
        >
          <Bell size={18} color="var(--text-secondary)" />
          <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-emerald-500)' }}></span>
        </button>

        {/* Auth State */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <User size={16} color="var(--color-emerald-500)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.nombreCompleto}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => loginDemo(false)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Demo 1 Clic
            </button>
            <button onClick={onOpenAuth} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              <LogIn size={14} /> Ingresar
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
