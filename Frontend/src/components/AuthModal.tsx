import React, { useState } from 'react';
import { X, User, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [nombre, setNombre] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        const nombreFinal = nombre.trim() || username.split('@')[0] || username;
        await register(username, pass, nombreFinal);
        showToast(`¡Bienvenido a EnergiAI, ${nombreFinal}!`, 'success');
      } else {
        await login(username, pass);
        showToast('Sesión iniciada correctamente', 'success');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas');
      showToast('Error de autenticación: verifica tus datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div 
        className="saas-card animate-fade-in" 
        style={{
          maxWidth: '440px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px 24px',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
          background: 'var(--bg-elevated)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
          title="Cerrar"
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '18px', paddingRight: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {isRegister ? 'Crear Cuenta EnergiAI' : 'Iniciar Sesión'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
            Acceso corporativo a métricas e inferencia energéticas.
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--badge-error-bg)', border: '1px solid var(--badge-error-border)', padding: '10px 12px', borderRadius: '10px', color: 'var(--badge-error-text)', fontSize: '0.8rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} /> <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '5px' }}>
                Nombre Completo
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="Ej. Ing. Sofía Ramos"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="saas-input"
                  style={{ paddingLeft: '38px', width: '100%', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '5px' }}>
              Correo Electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="ej. usuario@empresa.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="saas-input"
                style={{ paddingLeft: '38px', width: '100%', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '5px' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="saas-input"
                style={{ paddingLeft: '38px', paddingRight: '38px', width: '100%', fontSize: '0.88rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Recordar Sesión & Recuperar Contraseña */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Recordar sesión
            </label>
            <button type="button" onClick={() => showToast('Se ha enviado un enlace de recuperación a tu correo.', 'info')} style={{ background: 'transparent', border: 'none', color: 'var(--color-emerald-600)', cursor: 'pointer', fontWeight: 600 }}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px 16px', marginTop: '4px', fontSize: '0.9rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? 'Procesando...' : (isRegister ? 'Registrar y Continuar' : 'Ingresar al Sistema')} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-cyan-600)', fontWeight: 700, marginLeft: '6px', cursor: 'pointer' }}
          >
            {isRegister ? 'Inicia sesión aquí' : 'Crea una cuenta aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};
