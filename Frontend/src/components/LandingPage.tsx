import React, { useState } from 'react';
import { Zap, ArrowRight, CheckCircle2, DollarSign, Leaf, Cpu, Sun, Moon, ChevronDown, ChevronUp, Globe, Sparkles, BarChart2, Server, Sliders, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import heroPreviewImg from '../assets/hero_preview_full.png';
import ecoIllustrationImg from '../assets/eco_illustration.png';
import aiDiagramImg from '../assets/ai_diagram.png';

interface LandingPageProps {
  onStartSimulation: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartSimulation, onOpenAuth }) => {
  const { theme, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [previewKwh, setPreviewKwh] = useState(280);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const previewCost = Math.round(previewKwh * 0.75 * 100) / 100;

  const faqs = [
    {
      q: '¿Cómo predice EnergiAI mi perfil de consumo energético?',
      a: 'Utilizamos algoritmos supervisados de Regresión Logística y Random Forest entrenados con patrones de consumo residencial y comercial en LATAM. El sistema evalúa kWh, horas pico y equipamiento para categorizar la eficiencia con más del 93% de precisión.'
    },
    {
      q: '¿Cuál es la tarifa utilizada para el cálculo financiero?',
      a: 'Por defecto aplicamos la tarifa regulada de R$ 0.75 por kWh (equivalente a tarifas estándar LATAM), calculando el costo mensual proyectado y el ahorro directo al implementar las recomendaciones de la IA.'
    },
    {
      q: '¿Requiere la instalación de sensores físicos o medidores inteligentes?',
      a: 'No. EnergiAI funciona como una plataforma SaaS analítica. Puedes ingresar tus datos manualmente en el simulador o conectar lecturas mediante nuestra API REST corporativa.'
    },
    {
      q: '¿Cómo se garantiza la seguridad e integración empresarial?',
      a: 'La arquitectura backend está desarrollada en Java Spring Boot 3 con tokens JWT y migración de esquemas Flyway en base de datos PostgreSQL, desplegable en la infraestructura de Oracle Cloud Infrastructure (OCI).'
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
          <a href="#problema" style={{ color: 'inherit' }}>¿Qué es?</a>
          <a href="#como-funciona" style={{ color: 'inherit' }}>¿Cómo funciona?</a>
          <a href="#beneficios" style={{ color: 'inherit' }}>Beneficios</a>
          <a href="#tecnologias" style={{ color: 'inherit' }}>Tecnología</a>
          <a href="#faq" style={{ color: 'inherit' }}>FAQ</a>
        </nav>

        {/* Acciones & Responsive Burger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', borderRadius: '10px' }}
            title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
          >
            {theme === 'light' ? <Moon size={18} color="var(--text-secondary)" /> : <Sun size={18} color="#f59e0b" />}
          </button>

          <button onClick={onOpenAuth} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Iniciar Sesión
          </button>

          {/* Botón Menú Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary"
            style={{ padding: '8px', display: 'none' }}
            title="Menú móvil"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="saas-card" style={{ position: 'fixed', top: '64px', left: '16px', right: '16px', zIndex: 45, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: 'var(--shadow-lg)' }}>
          <a href="#problema" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>¿Qué es EnergiAI?</a>
          <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>¿Cómo funciona?</a>
          <a href="#beneficios" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Beneficios</a>
          <a href="#tecnologias" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Tecnología</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>FAQ</a>
        </div>
      )}

      {/* 2. Hero Section Adaptado & Sin Recortes */}
      <section style={{ padding: '60px 20px 40px', maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '99px', background: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)', color: 'var(--badge-success-text)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px', maxWidth: '100%' }}>
          <Sparkles size={14} /> Optimización Energética IA • Hackathon OCI LATAM
        </div>

        <h1 className="hero-title" style={{ fontSize: '3.4rem', lineHeight: 1.15, fontWeight: 800, maxWidth: '940px', margin: '0 auto 20px' }}>
          Inteligencia Artificial para un Consumo Energético <br />
          <span className="gradient-heading">Eficiente, Sostenible y Rentable</span>
        </h1>

        <p className="hero-subtitle" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '740px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          Optimiza la gestión eléctrica residencial e industrial mediante modelos analíticos de <strong>Scikit-Learn</strong> e indicadores financieros a tarifa normada de R$ 0.75/kWh.
        </p>

        <div className="btn-group-responsive" style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '40px' }}>
          <button onClick={onStartSimulation} className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1.05rem', borderRadius: '12px' }}>
            <Zap size={20} /> Comenzar Simulación <ArrowRight size={20} />
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
              <Sliders size={13} /> Tarifa Interactivas en Tiempo Real
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Consumo:</span>
              <span className="font-mono" style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{previewKwh} kWh</span>
            </div>
            <input 
              type="range" min="50" max="600" step="10" value={previewKwh} 
              onChange={(e) => setPreviewKwh(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-emerald-500)', marginBottom: '6px', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Costo est:</span>
              <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-emerald-500)' }}>R$ {previewCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sección: El Problema y La Solución */}
      <section id="problema" style={{ padding: '80px 20px 60px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px' }}>
              ¿Qué problema resuelve EnergiAI?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
              En América Latina, más del 30% de la energía eléctrica se desperdicia por falta de visibilidad en horarios pico y hábitos ineficientes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="saas-card" style={{ borderColor: 'var(--badge-error-border)' }}>
                <div style={{ color: 'var(--color-rose-500)', background: 'var(--badge-error-bg)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <DollarSign size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Sobrecosto Descontrolado</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Sin una herramienta analítica, los usuarios ignoran el impacto financiero del consumo en horario punta (18:00 - 22:00), sufriendo facturas elevadas y penalizaciones.
                </p>
              </div>

              <div className="saas-card" style={{ borderColor: 'var(--badge-success-border)' }}>
                <div style={{ color: 'var(--color-emerald-500)', background: 'var(--badge-success-bg)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Cpu size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Diagnóstico Basado en Datos</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  EnergiAI aplica modelos de Machine Learning para clasificar el consumo en <strong>Eficiente</strong>, <strong>Moderado</strong> o <strong>Ineficiente</strong>, generando recomendaciones automáticas para reducir la tarifa.
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
            ¿Cómo funciona EnergiAI en 3 simples pasos?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Sin configuraciones complejas ni hardware adicional.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div className="saas-card" style={{ position: 'relative' }}>
            <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-emerald-500)', opacity: 0.3, marginBottom: '6px' }}>01</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>Ingresa tus Parámetros</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Selecciona tu tipo de inmueble (Residencial, Oficina, Comercio), consumo mensual aproximado en kWh y uso en horas pico.
            </p>
          </div>

          <div className="saas-card" style={{ position: 'relative' }}>
            <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-cyan-500)', opacity: 0.3, marginBottom: '6px' }}>02</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>Inferencia del Modelo ML</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Nuestro algoritmo procesa las variables de consumo y determina la probabilidad de eficiencia energética con métricas de alta precisión.
            </p>
          </div>

          <div className="saas-card" style={{ position: 'relative' }}>
            <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-amber-500)', opacity: 0.3, marginBottom: '6px' }}>03</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>Dictamen y Plan de Ahorro</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Recibe el desglose financiero en R$, nivel de confianza y recomendaciones personalizadas para optimizar tus hábitos eléctricos.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Sección: Beneficios Económicos y Ambientales */}
      <section id="beneficios" style={{ padding: '70px 20px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px' }}>
              Impacto Económico y Sostenible
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            <div className="saas-card">
              <div style={{ color: 'var(--color-emerald-500)', marginBottom: '14px' }}>
                <DollarSign size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>Ahorro Económico Directo</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-emerald-500)" /> Reducción proyectada de hasta 24% en la factura eléctrica.</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-emerald-500)" /> Prevención de penalizaciones por sobreconsumo en horario punta.</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-emerald-500)" /> Monitoreo constante a tarifa normada de R$ 0.75/kWh.</li>
              </ul>
            </div>

            <div className="saas-card">
              <div style={{ color: 'var(--color-cyan-500)', marginBottom: '14px' }}>
                <Leaf size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>Sostenibilidad Ambiental</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-cyan-500)" /> Disminución de la huella de carbono individual y corporativa.</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-cyan-500)" /> Fomento de hábitos de consumo responsable alineados a ESG.</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--color-cyan-500)" /> Alivio de la carga operativa sobre la red eléctrica LATAM.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Sección: Stack Tecnológico */}
      <section id="tecnologias" style={{ padding: '70px 20px', maxWidth: '1140px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px' }}>
            Arquitectura de Nivel Empresarial
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Construido con las tecnologías líderes de la industria.
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
              Preguntas Frecuentes (FAQ)
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
