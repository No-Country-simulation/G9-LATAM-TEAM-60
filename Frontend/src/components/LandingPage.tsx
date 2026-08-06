import React, { useState } from 'react';
import { Zap, ArrowRight, CheckCircle2, DollarSign, Leaf, Cpu, Sun, Moon, ChevronDown, ChevronUp, Globe, Sparkles, BarChart2, Server, Sliders, Menu, X, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCountry } from '../context/CountryContext';
import { ENERGIA_POR_PAIS } from '../utils/country';
import heroPreviewImg from '../assets/hero_preview_full.png';
import ecoIllustrationImg from '../assets/eco_illustration.png';
import aiDiagramImg from '../assets/ai_diagram.png';

interface LandingPageProps {
  onStartSimulation: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartSimulation, onOpenAuth }) => {
  const { theme, toggleTheme } = useTheme();
  const { pais, setPais, paisConfig, t } = useCountry();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [previewKwh, setPreviewKwh] = useState(280);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const previewCost = Math.round(previewKwh * 0.75 * 100) / 100;

  const faqs = [
    {
      q: t('landing.faq.q1'),
      a: t('landing.faq.a1')
    },
    {
      q: t('landing.faq.q2'),
      a: t('landing.faq.a2')
    },
    {
      q: t('landing.faq.q3'),
      a: t('landing.faq.a3')
    },
    {
      q: t('landing.faq.q4'),
      a: t('landing.faq.a4')
    }
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      
      {/* 1. Header Landing flotante & Responsive */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{ background: 'var(--color-emerald-500)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <Zap size={20} color="#ffffff" fill="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Energi<span className="gradient-heading">AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Enterprise SaaS
            </span>
          </div>
        </div>

        {/* Links de Navegación Desktop */}
        <nav className="nav-links-desktop" style={{ display: 'flex', gap: '24px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          <a href="#problema" style={{ color: 'inherit' }}>{t('landing.nav.whatIs')}</a>
          <a href="#como-funciona" style={{ color: 'inherit' }}>{t('landing.nav.howItWorks')}</a>
          <a href="#beneficios" style={{ color: 'inherit' }}>{t('landing.nav.benefits')}</a>
          <a href="#tecnologias" style={{ color: 'inherit' }}>{t('landing.nav.tech')}</a>
          <a href="#faq" style={{ color: 'inherit' }}>{t('landing.nav.faq')}</a>
        </nav>

        {/* Acciones & Responsive Burger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Selector de País e Idioma Flotante */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="btn btn-secondary"
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
              title="Cambiar País / Idioma"
            >
              <Globe size={14} color="var(--color-emerald-500)" />
              <span className="country-fullname-desktop">{paisConfig.bandera} {paisConfig.nombre} · {paisConfig.moneda}</span>
              <span className="country-code-mobile" style={{ display: 'none' }}>{paisConfig.bandera} {paisConfig.moneda}</span>
              <ChevronDown size={13} style={{ opacity: 0.7 }} />
            </button>

            {langDropdownOpen && (
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
                      setLangDropdownOpen(false);
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

          {/* Toggle Modo Claro / Oscuro */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '7px 9px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
          >
            {theme === 'light' ? <Moon size={17} color="var(--text-secondary)" /> : <Sun size={17} color="#f59e0b" />}
          </button>

          {/* Botón Ingresar */}
          <button onClick={onOpenAuth} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            <span className="auth-btn-text-desktop">{t('auth.login')}</span>
            <span className="country-code-mobile" style={{ display: 'none' }}>{t('auth.login')}</span>
          </button>

          {/* Botón Menú Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary landing-hamburger-btn"
            style={{ padding: '7px 9px', borderRadius: '10px' }}
            title="Menú móvil"
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="saas-card" style={{ position: 'fixed', top: '64px', left: '16px', right: '16px', zIndex: 45, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: 'var(--shadow-lg)' }}>
          <a href="#problema" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('landing.nav.whatIs')}</a>
          <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('landing.nav.howItWorks')}</a>
          <a href="#beneficios" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('landing.nav.benefits')}</a>
          <a href="#tecnologias" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('landing.nav.tech')}</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('landing.nav.faq')}</a>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {t('country.select')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {Object.values(ENERGIA_POR_PAIS).map((c) => (
                <button
                  key={c.codigo}
                  onClick={() => {
                    setPais(c.codigo);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: pais === c.codigo ? 'var(--badge-success-bg)' : 'var(--bg-surface)',
                    color: pais === c.codigo ? 'var(--color-emerald-600)' : 'var(--text-primary)',
                    fontWeight: pais === c.codigo ? 700 : 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{c.bandera}</span>
                  <span>{c.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Section Adaptado & Sin Recortes */}
      <section style={{ padding: '60px 20px 40px', maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '99px', background: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)', color: 'var(--badge-success-text)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px', maxWidth: '100%' }}>
          <Sparkles size={14} /> {t('landing.hero.badge')}
        </div>

        <h1 className="hero-title" style={{ fontSize: '3.4rem', lineHeight: 1.15, fontWeight: 800, maxWidth: '940px', margin: '0 auto 20px' }}>
          {t('landing.hero.title1')} <br />
          <span className="gradient-heading">{t('landing.hero.title2')}</span>
        </h1>

        <p className="hero-subtitle" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '740px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          {t('landing.hero.subtitle')} <strong>{paisConfig.nombre} ({paisConfig.moneda})</strong>.
        </p>

        <div className="btn-group-responsive" style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '40px' }}>
          <button onClick={onStartSimulation} className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1.05rem', borderRadius: '12px' }}>
            <Zap size={20} /> {t('landing.hero.startBtn')} <ArrowRight size={20} />
          </button>
        </div>

        {/* Imagen del Hero 16:9 Completa e Integrada */}
        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
          <div className="hero-img-box">
            <img 
              src={heroPreviewImg} 
              alt="EnergiAI Dashboard SaaS Preview Complete 16:9" 
            />
          </div>

          {/* Insignia de Cálculo Tarifario flotante */}
          <div className="saas-card hero-overlay-badge" style={{
            position: 'absolute',
            bottom: '-20px',
            right: '20px',
            maxWidth: '320px',
            padding: '14px 18px',
            borderRadius: '14px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'left',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-focus)',
            zIndex: 10
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-emerald-500)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={13} /> {t('landing.hero.cardTitle')}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('landing.hero.consumption')}</span>
              <span className="font-mono" style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{previewKwh} kWh</span>
            </div>
            <input 
              type="range" min="50" max="600" step="10" value={previewKwh} 
              onChange={(e) => setPreviewKwh(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-emerald-500)', marginBottom: '6px', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('landing.hero.estCost')}</span>
              <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-emerald-500)' }}>{paisConfig.simboloMoneda} {previewCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sección: El Problema y La Solución */}
      <section id="problema" style={{ padding: '80px 20px 60px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px' }}>
              {t('landing.prob.title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
              {t('landing.prob.subtitle')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="saas-card" style={{ borderColor: 'var(--badge-error-border)' }}>
                <div style={{ color: 'var(--color-rose-500)', background: 'var(--badge-error-bg)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <DollarSign size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>{t('landing.prob.card1Title')}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {t('landing.prob.card1Body')}
                </p>
              </div>

              <div className="saas-card" style={{ borderColor: 'var(--badge-success-border)' }}>
                <div style={{ color: 'var(--color-emerald-500)', background: 'var(--badge-success-bg)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Cpu size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>{t('landing.prob.card2Title')}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {t('landing.prob.card2Body')}
                </p>
              </div>
            </div>

            {/* Eco Illustration Image */}
            <div className="saas-card" style={{ padding: '10px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
              <img 
                src={ecoIllustrationImg} 
                alt="Smart Eco Energy 3D Illustration" 
                style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sección: ¿Cómo Funciona Paso a Paso? */}
      <section id="como-funciona" style={{ padding: '70px 20px', maxWidth: '1140px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px' }}>
            {t('landing.steps.title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {t('landing.steps.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div className="saas-card" style={{ position: 'relative' }}>
            <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-emerald-500)', opacity: 0.3, marginBottom: '6px' }}>01</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>{t('landing.step1Title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {t('landing.step1Body')}
            </p>
          </div>

          <div className="saas-card" style={{ position: 'relative' }}>
            <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-cyan-500)', opacity: 0.3, marginBottom: '6px' }}>02</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>{t('landing.step2Title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {t('landing.step2Body')}
            </p>
          </div>

          <div className="saas-card" style={{ position: 'relative' }}>
            <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-amber-500)', opacity: 0.3, marginBottom: '6px' }}>03</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>{t('landing.step3Title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {t('landing.step3Body').replace('{currency}', paisConfig.moneda)}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Sección: Beneficios Económicos y Ambientales */}
      <section id="beneficios" style={{ padding: '70px 20px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px' }}>
              {t('landing.impact.title')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            <div className="saas-card">
              <div style={{ color: 'var(--color-emerald-500)', marginBottom: '14px' }}>
                <DollarSign size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>{t('landing.impact.ecoTitle')}</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-emerald-500)" /> {t('landing.impact.eco1')}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-emerald-500)" /> {t('landing.impact.eco2')}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-emerald-500)" /> {t('landing.impact.eco3').replace('{currency}', paisConfig.moneda)}</li>
              </ul>
            </div>

            <div className="saas-card">
              <div style={{ color: 'var(--color-cyan-500)', marginBottom: '14px' }}>
                <Leaf size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>{t('landing.impact.envTitle')}</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-cyan-500)" /> {t('landing.impact.env1')}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-cyan-500)" /> {t('landing.impact.env2')}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-cyan-500)" /> {t('landing.impact.env3').replace('{country}', paisConfig.nombre)}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Sección: Stack Tecnológico */}
      <section id="tecnologias" style={{ padding: '70px 20px', maxWidth: '1140px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px' }}>
            {t('landing.tech.title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {t('landing.tech.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'center' }}>
          <div className="saas-card" style={{ padding: '10px', borderRadius: '16px' }}>
            <img 
              src={aiDiagramImg} 
              alt="AI Analytics Neural Network Diagram" 
              style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="saas-card" style={{ textAlign: 'center', padding: '16px' }}>
              <Cpu size={24} color="var(--color-emerald-500)" style={{ margin: '0 auto 6px' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Python ML</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Scikit-Learn</p>
            </div>

            <div className="saas-card" style={{ textAlign: 'center', padding: '16px' }}>
              <Server size={24} color="var(--color-cyan-500)" style={{ margin: '0 auto 6px' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Spring Boot 3</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Java REST API</p>
            </div>

            <div className="saas-card" style={{ textAlign: 'center', padding: '16px' }}>
              <BarChart2 size={24} color="var(--color-amber-500)" style={{ margin: '0 auto 6px' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>React + Vite</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>TypeScript</p>
            </div>

            <div className="saas-card" style={{ textAlign: 'center', padding: '16px' }}>
              <Globe size={24} color="#818cf8" style={{ margin: '0 auto 6px' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>OCI Ready</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Oracle Cloud</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Sección: Preguntas Frecuentes (FAQ) */}
      <section id="faq" style={{ padding: '70px 20px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px' }}>
              {t('landing.faq.title')}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="saas-card" style={{ padding: '18px', cursor: 'pointer' }} onClick={() => setOpenFaq(isOpen ? null : idx)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--color-emerald-500)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Pie de Página (Footer) */}
      <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', padding: '36px 20px 20px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--color-emerald-500)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <Zap size={14} color="#ffffff" fill="#ffffff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>EnergiAI</span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © 2026 EnergiAI Enterprise SaaS. Grupo 9 (Equipo 60) — Hackathon OCI LATAM.
          </div>
        </div>
      </footer>

    </div>
  );
};
