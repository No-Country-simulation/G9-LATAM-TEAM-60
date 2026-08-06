import React from 'react';
import { Bell, Sun, Moon, LogIn, ChevronRight, User, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCountry } from '../context/CountryContext';

interface NavbarProps {
  activeTab: string;
  onOpenAuth: () => void;
  onGoLanding: () => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onOpenAuth, onGoLanding, onToggleMobileMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { paisConfig, t } = useCountry();

  const getBreadcrumbLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return t('nav.dashboard');
      case 'simulador': return t('nav.simulator');
      case 'historial': return t('nav.history');
      case 'recomendaciones': return t('nav.recommendations');
      case 'configuracion': return t('nav.settings');
      default: return 'EnergiAI';
    }
  };

  return (
    <header style={{
      height: '64px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      gap: '12px'
    }}>
      {/* Izquierda: Botón Hamburguesa Móvil + Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {/* Hamburguesa visible únicamente en dispositivos móviles */}
        <button
          onClick={onToggleMobileMenu}
          className="btn btn-secondary mobile-hamburger-btn"
          style={{ padding: '8px', borderRadius: '8px', flexShrink: 0 }}
          title="Abrir menú"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <span onClick={onGoLanding} style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 600 }}>EnergiAI</span>
          <ChevronRight size={14} style={{ flexShrink: 0 }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {getBreadcrumbLabel(activeTab)}
          </span>
        </div>
      </div>

      {/* Derecha: Selector de Tema, País Activo, Notificaciones y Autenticación */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Badge de País Activo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: 'var(--badge-success-bg)',
          border: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--color-emerald-600)'
        }} title={`País configurado: ${paisConfig.nombre} (${paisConfig.moneda})`}>
          <span>{paisConfig.bandera}</span>
          <span>{paisConfig.codigo} | {paisConfig.simboloMoneda}</span>
        </div>
        {/* Toggle Modo Claro / Oscuro */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ padding: '8px 10px', borderRadius: '10px' }}
          title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
          {theme === 'light' ? <Moon size={18} color="var(--text-secondary)" /> : <Sun size={18} color="#f59e0b" />}
        </button>

        {/* Notificaciones */}
        <button
          onClick={() => showToast('Sistema de IA operando con 93.4% de precisión.', 'info')}
          className="btn btn-secondary nav-bell-btn"
          style={{ padding: '8px', position: 'relative' }}
          title="Notificaciones"
        >
          <Bell size={18} color="var(--text-secondary)" />
          <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-emerald-500)' }}></span>
        </button>

        {/* Estado de Usuario / Botón Ingresar */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <User size={16} color="var(--color-emerald-500)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{user.nombreCompleto.split(' ')[0]}</span>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
            <LogIn size={14} /> Ingresar
          </button>
        )}
      </div>
    </header>
  );
};
