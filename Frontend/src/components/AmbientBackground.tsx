import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      {/* 1. Malla de Orbes de Gradiente Flotantes y Animados */}
      <div
        className="ambient-orb orb-emerald"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          maxHeight: '600px',
          maxWidth: '600px',
          borderRadius: '50%',
          filter: 'blur(90px)',
          opacity: 'var(--ambient-orb-opacity, 0.45)',
          animation: 'floatOrb1 24s ease-in-out infinite alternate',
          willChange: 'transform'
        }}
      />

      <div
        className="ambient-orb orb-cyan"
        style={{
          position: 'absolute',
          top: '20%',
          right: '-12%',
          width: '50vw',
          height: '50vw',
          maxHeight: '550px',
          maxWidth: '550px',
          borderRadius: '50%',
          filter: 'blur(95px)',
          opacity: 'var(--ambient-orb-opacity, 0.40)',
          animation: 'floatOrb2 28s ease-in-out infinite alternate-reverse',
          willChange: 'transform'
        }}
      />

      <div
        className="ambient-orb orb-amber"
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '25%',
          width: '45vw',
          height: '45vw',
          maxHeight: '500px',
          maxWidth: '500px',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 'var(--ambient-orb-opacity, 0.35)',
          animation: 'floatOrb3 22s ease-in-out infinite alternate',
          willChange: 'transform'
        }}
      />

      {/* 2. Patrón de Cuadrícula Tech Telemetría con Máscara Radial */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(var(--grid-dot-color, rgba(16, 185, 129, 0.15)) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          opacity: 'var(--grid-pattern-opacity, 0.6)'
        }}
      />

      {/* 3. Micro-partículas de Energía Flotantes */}
      <div className="energy-particles">
        <div className="particle p1" />
        <div className="particle p2" />
        <div className="particle p3" />
        <div className="particle p4" />
        <div className="particle p5" />
      </div>
    </div>
  );
};
