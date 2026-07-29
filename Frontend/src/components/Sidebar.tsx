import React from 'react';
import { LayoutDashboard, Zap, History, Lightbulb, Settings, ChevronLeft, ChevronRight, LogOut, Shield, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed, setCollapsed, onOpenAuth }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const menuItems = [
    { id: 'simulador', label: 'Simulador IA', icon: Zap, public: true },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, public: false },
    { id: 'historial', label: 'Historial & CSV', icon: History, public: false },
    { id: 'recomendaciones', label: 'Recomendaciones', icon: Lightbulb, public: false },
    { id: 'configuracion', label: 'Configuración', icon: Settings, public: false },
  ];

  const handleTabClick = (item: typeof menuItems[0]) => {
    if (!item.public && !user) {
      showToast('Función restringida: Inicia sesión para habilitar esta sección', 'info');
      onOpenAuth();
      return;
    }
    setActiveTab(item.id);
  };

  return (
    <aside style={{
      width: collapsed ? '80px' : '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 40,
      padding: '20px 14px'
    }}>
      {/* Parte Superior: Logo y Toggle */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', marginBottom: '32px', padding: '0 4px' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--color-emerald-500)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                <Zap size={18} color="#ffffff" fill="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Energi<span className="gradient-heading">AI</span></span>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-secondary"
            style={{ padding: '6px', borderRadius: '8px' }}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Menú de Ítems */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isAct = activeTab === item.id;
            const isLocked = !item.public && !user;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isAct ? 'var(--badge-success-bg)' : 'transparent',
                  color: isAct ? 'var(--color-emerald-600)' : (isLocked ? 'var(--text-muted)' : 'var(--text-secondary)'),
                  fontWeight: isAct ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  transition: 'all 0.2s ease',
                  opacity: isLocked ? 0.75 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={20} color={isAct ? 'var(--color-emerald-600)' : (isLocked ? 'var(--text-muted)' : 'var(--text-secondary)')} />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && isLocked && (
                  <span title="Requiere inicio de sesión">
                    <Lock size={14} color="var(--text-muted)" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Parte Inferior: Perfil Usuario y Cerrar Sesión */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', gap: '8px' }}>
            {!collapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--bg-surface-hover)', padding: '8px', borderRadius: '50%' }}>
                  {user.role === 'ADMIN' ? <Shield size={16} color="var(--color-emerald-500)" /> : <User size={16} color="var(--color-cyan-500)" />}
                </div>
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.nombreCompleto}</div>
                  <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</div>
                </div>
              </div>
            )}
            <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px', color: 'var(--color-rose-500)' }} title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          !collapsed && (
            <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              🔒 Modo Prueba Activo<br />
              <span style={{ color: 'var(--color-emerald-600)', fontWeight: 700, cursor: 'pointer' }} onClick={onOpenAuth}>Ingresar para desbloquear</span>
            </div>
          )
        )}
      </div>
    </aside>
  );
};
