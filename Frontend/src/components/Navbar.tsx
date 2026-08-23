import React, { useState, useRef, useEffect } from 'react';
import { Bell, Sun, Moon, LogIn, ChevronRight, User, Menu, ChevronDown, Check, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCountry } from '../context/CountryContext';
import { ENERGIA_POR_PAIS } from '../utils/country';

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
  const { pais, setPais, paisConfig, t } = useCountry();

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar desplegables al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
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
          <span 
            onClick={onGoLanding} 
            style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>Energi<strong style={{ color: 'var(--color-emerald-500)' }}>AI</strong></span>
          </span>
          <ChevronRight size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {getBreadcrumbLabel(activeTab)}
          </span>
        </div>
      </div>

      {/* Derecha: Acciones Interactivas y Responsivas */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        
        {/* 1. Selector Interactivo de País / Moneda / Idioma */}
        <div ref={countryDropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
            className="btn btn-secondary country-selector-header-btn"
            style={{
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              color: 'var(--color-emerald-600)',
              background: 'var(--badge-success-bg)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
            title={t('config.countryLanguage')}
          >
            <span>{paisConfig.bandera}</span>
            <span className="country-fullname-desktop">{paisConfig.nombre} · {paisConfig.moneda}</span>
            <span className="country-code-mobile" style={{ display: 'none' }}>{paisConfig.moneda}</span>
            <ChevronDown size={13} style={{ opacity: 0.7 }} />
          </button>

          {countryDropdownOpen && (
            <div className="saas-card" style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '230px',
              zIndex: 100,
              padding: '8px',
              boxShadow: 'var(--shadow-lg)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 10px', marginBottom: '4px' }}>
                {t('country.select')}
              </div>
              {Object.values(ENERGIA_POR_PAIS).map((c) => (
                <button
                  key={c.codigo}
                  onClick={() => {
                    setPais(c.codigo);
                    setCountryDropdownOpen(false);
                    showToast(`País actualizado: ${c.nombre} (${c.moneda})`, 'success');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: pais === c.codigo ? 'var(--badge-success-bg)' : 'transparent',
                    color: pais === c.codigo ? 'var(--color-emerald-600)' : 'var(--text-primary)',
                    fontWeight: pais === c.codigo ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{c.bandera}</span>
                    <span>{c.nombre}</span>
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }} className="font-mono">{c.moneda}</span>
                    {pais === c.codigo && <Check size={14} color="var(--color-emerald-500)" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Toggle Modo Claro / Oscuro */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ padding: '7px 9px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
          {theme === 'light' ? <Moon size={17} color="var(--text-secondary)" /> : <Sun size={17} color="#f59e0b" />}
        </button>

        {/* 3. Notificaciones & Telemetría */}
        <div ref={notifDropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="btn btn-secondary nav-bell-btn"
            style={{ padding: '7px 9px', borderRadius: '10px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Centro de Alertas & Telemetría IA"
          >
            <Bell size={17} color="var(--text-secondary)" />
            <span style={{ position: 'absolute', top: '5px', right: '5px', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-emerald-500)' }}></span>
          </button>

          {notificationsOpen && (
            <div className="saas-card" style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '280px',
              zIndex: 100,
              padding: '14px',
              boxShadow: 'var(--shadow-lg)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={14} color="var(--color-emerald-500)" /> Telemetría IA
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'var(--badge-success-bg)', color: 'var(--color-emerald-600)' }}>
                  En Vivo
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Sparkles size={15} color="var(--color-emerald-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Modelo ML Scikit-Learn</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Operando con 93.4% de precisión analítica.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={15} color="var(--color-cyan-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Integración Backend Spring Boot</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Seguridad JWT y migraciones Flyway H2 activas.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Estado de Usuario / Botón Ingresar */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '20px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <User size={15} color="var(--color-emerald-500)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              {user.nombreCompleto.split(' ')[0]}
            </span>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            <LogIn size={14} /> <span className="auth-btn-text-desktop">Ingresar</span>
          </button>
        )}
      </div>
    </header>
  );
};
