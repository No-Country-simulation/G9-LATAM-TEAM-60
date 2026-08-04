import React, { useState, useEffect } from 'react';
import { History, Download, Search, RefreshCw, ExternalLink, FileText, FileSpreadsheet } from 'lucide-react';
import type { AnalisisResponse } from '../types';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { generarComprobantePDF } from '../utils/pdfExporter';
import { formatMoney } from '../utils/currency';

interface HistoryViewProps {
  onSelectAnalisis: (res: AnalisisResponse) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectAnalisis }) => {
  const [list, setList] = useState<AnalisisResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await apiService.obtenerHistorial();
      setList(data);
    } catch (err) {
      showToast('Error cargando historial de auditoría', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filtered = list.filter(item =>
    item.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Exporta el historial en formato CSV configurado explícitamente con sep=;
   * para que Microsoft Excel lo abra automáticamente dividido en columnas independientes A, B, C, D...
   */
  const exportCSV = () => {
    if (list.length === 0) {
      showToast('No hay registros en el historial para exportar', 'info');
      return;
    }

    // Directiva explícita sep=; para Microsoft Excel en español/LATAM
    const sepDirective = 'sep=;\r\n';

    // Encabezados separados por punto y coma (;)
    const headers = [
      '"ID System"',
      '"ID Diagnóstico"',
      '"Categoría ML"',
      '"Confianza Modelo (%)"',
      '"Costo Mensual Proyectado ($)"',
      '"Consumo Evaluado (kWh)"',
      '"Tipo Inmueble"',
      '"Cantidad Equipos"',
      '"Uso Horario Pico"',
      '"Región LATAM"',
      '"Directivas Ahorro IA"',
      '"Fecha Auditoría"'
    ].join(';');

    // Filas separadas por punto y coma (;)
    const rows = list.map(i => {
      const id = i.id || '';
      const identificador = `"${i.identificador || ''}"`;
      const categoria = `"${i.categoria || ''}"`;
      const probabilidad = `"${(i.probabilidad * 100).toFixed(1)}%"`;
      const costo = `"$ ${i.costo_estimado_mensual.toFixed(2)}"`;
      const consumo = i.request ? `"${i.request.consumo_kwh} kWh"` : '"N/A"';
      const inmueble = i.request ? `"${i.request.tipo_inmueble}"` : '"N/A"';
      const equipos = i.request ? `"${i.request.cantidad_equipos}"` : '"N/A"';
      const pico = i.request ? `"${i.request.uso_horario_pico ? 'SÍ' : 'NO'}"` : '"N/A"';
      const region = i.request ? `"${i.request.region}"` : '"Centro"';
      const recomendaciones = i.recomendaciones 
        ? `"${i.recomendaciones.join('; ').replace(/"/g, '""')}"` 
        : '""';
      const fecha = i.fecha 
        ? `"${new Date(i.fecha).toLocaleString('es-ES')}"` 
        : `"${new Date().toLocaleString('es-ES')}"`;

      return [
        id,
        identificador,
        categoria,
        probabilidad,
        costo,
        consumo,
        inmueble,
        equipos,
        pico,
        region,
        recomendaciones,
        fecha
      ].join(';');
    }).join('\r\n');

    // UTF-8 BOM '\uFEFF' + sep=; + contenido
    const blob = new Blob(['\uFEFF' + sepDirective + headers + '\r\n' + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `auditoria_energiai_latam_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Archivo CSV exportado con separación de columnas para Excel', 'success');
  };

  /**
   * Exporta el historial como un libro de trabajo Excel (.xls) con diseño de tabla
   * corporativo, encabezados coloreados e indicadores de estado.
   */
  const exportExcel = () => {
    if (list.length === 0) {
      showToast('No hay registros en el historial para exportar', 'info');
      return;
    }

    const rowsHtml = list.map((i, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#f3f7f5' : '#e6ede9'};">
        <td style="border: 1px solid #cbdad3; padding: 8px; font-family: monospace; font-weight: bold;">${i.identificador}</td>
        <td style="border: 1px solid #cbdad3; padding: 8px;">${i.fecha ? new Date(i.fecha).toLocaleString('es-ES') : 'Hoy'}</td>
        <td style="border: 1px solid #cbdad3; padding: 8px; font-weight: bold; color: ${i.categoria.includes('Efi') ? '#059669' : i.categoria.includes('Mod') ? '#d97706' : '#dc2626'};">${i.categoria}</td>
        <td style="border: 1px solid #cbdad3; padding: 8px; font-family: monospace;">${(i.probabilidad * 100).toFixed(1)}%</td>
        <td style="border: 1px solid #cbdad3; padding: 8px; font-family: monospace; font-weight: bold; color: #059669;">$ ${i.costo_estimado_mensual.toFixed(2)}</td>
        <td style="border: 1px solid #cbdad3; padding: 8px;">${i.request?.tipo_inmueble || 'Casa'}</td>
        <td style="border: 1px solid #cbdad3; padding: 8px;">${i.request?.consumo_kwh || '240'} kWh</td>
        <td style="border: 1px solid #cbdad3; padding: 8px;">${i.recomendaciones?.join(' | ') || 'Sin observaciones'}</td>
      </tr>
    `).join('');

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Historial EnergiAI</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head>
      <body>
        <h2 style="font-family: Arial, sans-serif; color: #0f172a;">REPORTE DE AUDITORÍA DE CONSUMO ENERGÉTICO — ENERGIAI LATAM</h2>
        <p style="font-family: Arial, sans-serif; color: #64748b; font-size: 12px;">Fecha de Generación: ${new Date().toLocaleString('es-ES')}</p>
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 13px;">
          <thead>
            <tr style="background-color: #059669; color: #ffffff; font-weight: bold;">
              <th style="border: 1px solid #047857; padding: 10px; text-align: left;">ID DIAGNÓSTICO</th>
              <th style="border: 1px solid #047857; padding: 10px; text-align: left;">FECHA AUDITORÍA</th>
              <th style="border: 1px solid #047857; padding: 10px; text-align: left;">CATEGORÍA ML</th>
              <th style="border: 1px solid #047857; padding: 10px; text-align: left;">CONFIANZA (%)</th>
              <th style="border: 1px solid #047857; padding: 10px; text-align: left;">COSTO MENSUAL ($)</th>
              <th style="border: 1px solid #047857; padding: 10px; text-align: left;">INMUEBLE</th>
              <th style="border: 1px solid #047857; padding: 10px; text-align: left;">CONSUMO KWH</th>
              <th style="border: 1px solid #047857; padding: 10px; text-align: left;">DIRECTIVAS DE AHORRO IA</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_auditoria_energiai_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Reporte Excel estructurado generado correctamente', 'success');
  };

  const getBadgeClass = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('efi')) return 'badge-efficient';
    if (c.includes('mod')) return 'badge-moderate';
    return 'badge-inefficient';
  };

  return (
    <div className="view-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History color="var(--color-emerald-500)" /> Historial de Auditoría & Reportes
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Registro cronológico oficial de inferencias energéticas realizadas por EnergiAI.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={loadHistory} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <RefreshCw size={15} /> Refrescar
          </button>
          
          <button onClick={exportCSV} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <Download size={15} /> Exportar CSV
          </button>

          <button onClick={exportExcel} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <FileSpreadsheet size={15} /> Exportar Excel (.xls)
          </button>
        </div>
      </div>

      {/* Buscador Global */}
      <div className="saas-card" style={{ marginBottom: '20px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search color="var(--text-muted)" size={18} />
        <input 
          type="text"
          placeholder="Filtrar por identificador (ej. IA-DEMO001) o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="saas-input"
          style={{ border: 'none', background: 'transparent', padding: 0 }}
        />
      </div>

      {/* Tabla Responsiva con JetBrains Mono */}
      <div className="saas-card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div className="skeleton" style={{ width: '100%', height: '200px' }}></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px' }}>Identificador</th>
                  <th style={{ padding: '12px' }}>Fecha Auditoría</th>
                  <th style={{ padding: '12px' }}>Categoría ML</th>
                  <th style={{ padding: '12px' }}>Confianza</th>
                  <th style={{ padding: '12px' }}>Costo Proyectado</th>
                  <th style={{ padding: '12px' }}>Acciones & Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-cyan-600)' }}>{item.identificador}</td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {item.fecha ? new Date(item.fecha).toLocaleString('es-ES') : 'Hoy'}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={`badge ${getBadgeClass(item.categoria)}`}>{item.categoria}</span>
                    </td>
                    <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 600 }}>{(item.probabilidad * 100).toFixed(1)}%</td>
                    <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-emerald-600)' }}>{formatMoney(item.costo_estimado_mensual, item.moneda || item.request?.moneda, item.simboloMoneda || item.request?.simboloMoneda)}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => onSelectAnalisis(item)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} title="Ver detalles">
                          <ExternalLink size={12} /> Ver
                        </button>
                        <button onClick={() => generarComprobantePDF(item)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--color-emerald-500)' }} title="Exportar Comprobante PDF">
                          <FileText size={12} /> PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
