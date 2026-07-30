export interface AnalisisRequest {
  region: string;
  consumo_kwh: number;
  uso_horario_pico: boolean;
  cantidad_equipos: number;
  tipo_inmueble: string;
  horas_alto_consumo: number;
}

export interface AnalisisResponse {
  id?: number;
  identificador: string;
  categoria: 'Eficiente' | 'Moderado' | 'Ineficiente' | string;
  probabilidad: number;
  costo_estimado_mensual: number;
  recomendaciones: string[];
  fecha?: string;
  request?: AnalisisRequest;
}

export interface DashboardStats {
  totalConsultas: number;
  consumoPromedioKwh: number;
  costoTotalEstimado: number;
  distribucionCategorias: {
    Eficiente: number;
    Moderado: number;
    Ineficiente: number;
    [key: string]: number;
  };
  analisisRecientes: AnalisisResponse[];
}

export interface UserProfile {
  id?: number;
  username: string;
  nombreCompleto: string;
  role: 'ADMIN' | 'USER' | string;
  jwtToken?: string;
}
