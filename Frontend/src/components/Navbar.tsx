import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, LogIn, ChevronRight, User, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
  const [search, setSearch] = useState('');

  const getBreadcrumbLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Ejecutivo';
      case 'simulador': return 'Simulador IA';
      case 'historial': return 'Historial & CSV';
      case 'recomendaciones': return 'Recomendaciones';
      case 'configuracion': return 'Configuración';
      default: return 'Plataforma Principal';
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

      {/* Centro: Búsqueda Global (Oculta o Colapsada en Móviles Pequeños) */}
      <div className="nav-search-container" style={{ flex: 1, maxWidth: '380px', margin: '0 12px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Búsqueda global (parámetros, ID, kWh)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="saas-input"
            style={{ paddingLeft: '38px', fontSize: '0.85rem', height: '38px' }}
          />
        </div>
      </div>

      {/* Derecha: Selector de Tema, Notificaciones y Autenticación */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
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
