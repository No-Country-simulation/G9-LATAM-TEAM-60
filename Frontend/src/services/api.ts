import type { AnalisisRequest, AnalisisResponse, DashboardStats, UserProfile } from '../types';

const BASE_URL = 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('energiai_jwt');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  async analizarConsumo(data: AnalisisRequest): Promise<AnalisisResponse> {
    // 1. Enviar la simulación al Backend Java (port 8080), el cual llama a Python ML y guarda en H2
    try {
      const response = await fetch(`${BASE_URL}/analisis-energetico`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Error llamando al backend Java (8080), intentando fallback:', err);
    }

    // 2. Fallback a Python ML directo si el backend Java no estuviera disponible
    try {
      const mlResponse = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (mlResponse.ok) {
        return await mlResponse.json();
      }
    } catch (mlErr) {
      // Ignorar e ir al fallback resiliente local
    }

    // Fallback resiliente offline local
    const costo = Math.round(data.consumo_kwh * 0.75 * 100) / 100;
    let cat = 'Eficiente';
    let prob = 0.93;
    const recs: string[] = [];
    if (data.consumo_kwh > 400 || data.horas_alto_consumo > 7) {
      cat = 'Ineficiente';
      prob = 0.89;
      recs.push('Alerta de consumo crítico: Desconecta electrodomésticos en modo espera y revisa la instalación eléctrica.');
      recs.push('Evita utilizar línea blanca durante el horario pico (18:00 - 22:00).');
    } else if (data.consumo_kwh > 200) {
      cat = 'Moderado';
      prob = 0.81;
      recs.push('Optimiza la iluminación cambiando bombillas tradicionales a tecnología LED.');
      recs.push('Aprovecha la luz natural y programa termostatos o sistemas de climatización.');
    } else {
      recs.push('¡Felicidades! Mantienes un consumo sostenible. Sigue con tus buenos hábitos de ahorro.');
    }
    return {
      identificador: 'IA-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      categoria: cat,
      probabilidad: prob,
      costo_estimado_mensual: costo,
      recomendaciones: recs,
      fecha: new Date().toISOString()
    };
  },

  async obtenerHistorial(): Promise<AnalisisResponse[]> {
    try {
      const response = await fetch(`${BASE_URL}/analisis/historial`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Error al obtener historial');
      return await response.json();
    } catch (err) {
      console.warn('Usando historial de prueba en modo offline:', err);
      return [
        {
          id: 1,
          identificador: 'IA-DEMO001',
          categoria: 'Eficiente',
          probabilidad: 0.94,
          costo_estimado_mensual: 135.38,
          recomendaciones: ['Mantienes un perfil energético óptimo y sostenible.'],
          fecha: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 2,
          identificador: 'IA-DEMO002',
          categoria: 'Moderado',
          probabilidad: 0.78,
          costo_estimado_mensual: 217.50,
          recomendaciones: ['Desplazar el uso de electrodomésticos fuera del horario pico (18:00 - 22:00).'],
          fecha: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          identificador: 'IA-DEMO003',
          categoria: 'Ineficiente',
          probabilidad: 0.91,
          costo_estimado_mensual: 390.00,
          recomendaciones: ['Alerta crítica: revisa equipos fantasma y distribuye cargas.'],
          fecha: new Date().toISOString()
        }
      ];
    }
  },

  async obtenerDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${BASE_URL}/dashboard`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Error al obtener stats del dashboard');
      return await response.json();
    } catch (err) {
      console.warn('Usando stats de prueba en modo offline:', err);
      const historial = await this.obtenerHistorial();
      return {
        totalConsultas: historial.length,
        consumoPromedioKwh: historial.length > 0 ? Number((historial.reduce((acc, curr) => acc + (curr.consumo_kwh || 0), 0) / historial.length).toFixed(1)) : 0,
        costoTotalEstimado: Number(historial.reduce((acc, curr) => acc + (curr.costo_estimado_mensual || 0), 0).toFixed(2)),
        distribucionCategorias: {
          Eficiente: historial.filter(h => h.categoria === 'Eficiente').length,
          Moderado: historial.filter(h => h.categoria === 'Moderado').length,
          Ineficiente: historial.filter(h => h.categoria === 'Ineficiente').length
        },
        analisisRecientes: historial
      };
    }
  },

  async login(username: string, pass: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });
      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }
      const data = await response.json();
      if (data.jwtToken) {
        localStorage.setItem('energiai_jwt', data.jwtToken);
      }
      return {
        username: data.username,
        nombreCompleto: data.nombreCompleto || data.username,
        role: data.role || 'USER',
        jwtToken: data.jwtToken
      };
    } catch (err: any) {
      if (err.message === 'Credenciales incorrectas' || err.message?.includes('403') || err.message?.includes('401')) {
        throw err;
      }
      console.warn('Usando login demo local offline (Servidor fuera de linea):', err);
      const isAdm = username.toLowerCase().includes('admin');
      const token = 'demo_offline_jwt_' + Math.random().toString(36).substring(2);
      localStorage.setItem('energiai_jwt', token);
      return {
        username: username || 'demo@energiai.com',
        nombreCompleto: isAdm ? 'Administrador EnergiAI' : (username.split('@')[0] || 'Usuario Demo'),
        role: isAdm ? 'ADMIN' : 'USER',
        jwtToken: token
      };
    }
  },

  async register(data: { username: string; password: string; nombreCompleto: string }): Promise<UserProfile> {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Error al registrar usuario');
      }
      const resData = await response.json();
      if (resData.jwtToken) {
        localStorage.setItem('energiai_jwt', resData.jwtToken);
      }
      return {
        username: resData.username || data.username,
        nombreCompleto: resData.nombreCompleto || data.nombreCompleto,
        role: resData.role || 'USER',
        jwtToken: resData.jwtToken
      };
    } catch (err: any) {
      if (err.message && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      console.warn('Registro local demo offline:', err);
      const token = 'demo_offline_jwt_' + Math.random().toString(36).substring(2);
      localStorage.setItem('energiai_jwt', token);
      return {
        username: data.username,
        nombreCompleto: data.nombreCompleto || 'Usuario Registrado',
        role: 'USER',
        jwtToken: token
      };
    }
  },

  async checkAuth(): Promise<UserProfile | null> {
    const token = localStorage.getItem('energiai_jwt');
    if (!token) return null;
    try {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Sesión expirada');
      return await response.json();
    } catch (err) {
      if (token.startsWith('demo_offline')) {
        return {
          username: 'demo@energiai.com',
          nombreCompleto: 'Usuario Demo',
          role: 'USER',
          jwtToken: token
        };
      }
      return null;
    }
  },

  logout() {
    localStorage.removeItem('energiai_jwt');
  }
};
