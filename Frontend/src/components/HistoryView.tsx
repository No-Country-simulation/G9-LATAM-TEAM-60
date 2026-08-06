import React, { useState, useEffect } from 'react';
import { History, Download, Search, RefreshCw, ExternalLink, FileText, FileSpreadsheet } from 'lucide-react';
import type { AnalisisResponse } from '../types';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCountry } from '../context/CountryContext';
import { generarComprobantePDF } from '../utils/pdfExporter';

interface HistoryViewProps {
  onSelectAnalisis: (res: AnalisisResponse) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectAnalisis }) => {
  const [list, setList] = useState<AnalisisResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();
  const { t, paisConfig, formatMoney, convertirDesdeBase, formatDate, locale } = useCountry();

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await apiService.obtenerHistorial();
      setList(data);
    } catch (err) {
      showToast(t('history.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const filtered = list.filter(item =>
    item.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /** Exporta CSV con separador ; y locale del país activo */
  const exportCSV = () => {
    if (list.length === 0) { showToast(t('history.noRecords'), 'info'); return; }
    const sepDirective = 'sep=;\r\n';
    const yesLabel = t('history.yes');
    const noLabel  = t('history.no');
    const naLabel  = t('history.na');

    const headers = [
      `"${t('excel.colId')}"`,
      `"${t('history.colDate')}"`,
      `"${t('history.colCategory')}"`,
      `"${t('history.colConfidence')}"`,
      `"${t('history.colCost')} (${paisConfig.moneda})"`,
      `"${t('sim.consumption')}"`,
      `"${t('sim.propertyType')}"`,
      `"${t('sim.appliances')}"`,
      `"${t('sim.peakHours')}"`,
      `"${t('sim.region')}"`,
      `"${t('excel.colRecommendations')}"`,
      `"${t('history.colDate')}"`,
    ].join(';');

    const rows = list.map(i => {
      const costo = convertirDesdeBase(i.costo_estimado_mensual);
      return [
        i.id || '',
        `"${i.identificador || ''}"`,
        `"${i.categoria || ''}"`,
        `"${(i.probabilidad * 100).toFixed(1)}%"`,
        `"${paisConfig.simboloMoneda} ${Math.round(costo).toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}"`,
        i.request ? `"${i.request.consumo_kwh} kWh"` : i.consumo_kwh ? `"${i.consumo_kwh} kWh"` : `"${naLabel}"`,
        i.request ? `"${i.request.tipo_inmueble}"` : i.tipo_inmueble ? `"${i.tipo_inmueble}"` : `"${naLabel}"`,
        i.request ? `"${i.request.cantidad_equipos}"` : i.cantidad_equipos ? `"${i.cantidad_equipos}"` : `"${naLabel}"`,
        i.request ? `"${i.request.uso_horario_pico ? yesLabel : noLabel}"` : i.uso_horario_pico !== undefined ? `"${i.uso_horario_pico ? yesLabel : noLabel}"` : `"${naLabel}"`,
        i.request ? `"${i.request.region}"` : i.region ? `"${i.region}"` : '"Centro"',
        i.recomendaciones ? `"${i.recomendaciones.join('; ').replace(/"/g, '""')}"` : '""',
        `"${formatDate(i.fecha, { dateStyle: 'short', timeStyle: 'short' })}"`,
      ].join(';');
    }).join('\r\n');

    const blob = new Blob(['\uFEFF' + sepDirective + headers + '\r\n' + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `auditoria_energiai_${paisConfig.codigo}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast(t('history.csvExported'), 'success');
  };

  /** Exporta Excel (.xls) con textos y moneda del país activo */
  const exportExcel = () => {
    if (list.length === 0) { showToast(t('history.noRecords'), 'info'); return; }
    const yesLabel = t('history.yes');
    const noLabel  = t('history.no');

    const rowsHtml = list.map((i, idx) => {
      const costo = convertirDesdeBase(i.costo_estimado_mensual);
      const costoStr = `${paisConfig.simboloMoneda} ${Math.round(costo).toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      return `
      <tr style="background-color: ${idx % 2 === 0 ? '#f3f7f5' : '#e6ede9'};">
        <td style="border: 1px solid #cbdad3; padding: 8px; font-family: monospace; font-weight: bold;">${i.identificador}</td>
        <td style="border: 1px solid #cbdad3; padding: 8px;">${formatDate(i.fecha, { dateStyle: 'short', timeStyle: 'short' })}</td>
        <td style="border: 1px solid #cbdad3; padding: 8px; font-weight: bold; color: ${i.categoria.includes('Efi') ? '#059669' : i.categoria.includes('Mod') ? '#d97706' : '#dc2626'};">${i.categoria}</td>
        <td style="border: 1px solid #cbdad3; padding: 8px; font-family: monospace;">${(i.probabilidad * 100).toFixed(1)}%</td>
        <td style="border: 1px solid #cbdad3; padding: 8px; font-family: monospace; font-weight: bold; color: #059669;">${costoStr}</td>
        <td style="border: 1px solid #cbdad3; padding: 8px;">${i.request?.tipo_inmueble || t('history.na')}</td>
        <td style="border: 1px solid #cbdad3; padding: 8px;">${i.request?.consumo_kwh || '240'} kWh</td>
        <td style="border: 1px solid #cbdad3; padding: 8px;">${i.request?.uso_horario_pico ? yesLabel : noLabel}</td>
        <td style="border: 1px solid #cbdad3; padding: 8px;">${i.recomendaciones?.join(' | ') || t('res.noRecommendations')}</td>
      </tr>`;
    }).join('');

    const generationDate = formatDate(new Date(), { dateStyle: 'full', timeStyle: 'short' });
    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8">
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${t('excel.sheetName')}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
      </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head>
      <body>
        <h2 style="font-family: Arial, sans-serif; color: #0f172a;">${t('excel.title')} — ${paisConfig.bandera} ${paisConfig.nombre}</h2>
        <p style="font-family: Arial, sans-serif; color: #64748b; font-size: 12px;">${t('excel.generated')}: ${generationDate}</p>
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 13px;">
          <thead>
            <tr style="background-color: #059669; color: #ffffff; font-weight: bold;">
              <th style="border: 1px solid #047857; padding: 10px;">${t('excel.colId')}</th>
              <th style="border: 1px solid #047857; padding: 10px;">${t('history.colDate')}</th>
              <th style="border: 1px solid #047857; padding: 10px;">${t('excel.colCategory')}</th>
              <th style="border: 1px solid #047857; padding: 10px;">${t('excel.colConfidence')}</th>
              <th style="border: 1px solid #047857; padding: 10px;">${t('excel.colCost')} (${paisConfig.moneda})</th>
              <th style="border: 1px solid #047857; padding: 10px;">${t('excel.colProperty')}</th>
              <th style="border: 1px solid #047857; padding: 10px;">${t('excel.colKwh')}</th>
              <th style="border: 1px solid #047857; padding: 10px;">${t('sim.peakHours')}</th>
              <th style="border: 1px solid #047857; padding: 10px;">${t('excel.colRecommendations')}</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body></html>`;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_auditoria_energiai_${paisConfig.codigo}_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast(t('history.excelExported'), 'success');
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
            <History color="var(--color-emerald-500)" /> {t('history.title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('history.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={loadHistory} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <RefreshCw size={15} /> {t('history.refresh')}
          </button>
          <button onClick={exportCSV} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <Download size={15} /> {t('history.exportCsv')}
          </button>
          <button onClick={exportExcel} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <FileSpreadsheet size={15} /> {t('history.exportExcel')}
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="saas-card" style={{ marginBottom: '20px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search color="var(--text-muted)" size={18} />
        <input
          type="text"
          placeholder={t('history.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="saas-input"
          style={{ border: 'none', background: 'transparent', padding: 0 }}
        />
      </div>

      {/* Tabla */}
      <div className="saas-card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div className="skeleton" style={{ width: '100%', height: '200px' }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px' }}>{t('history.empty')}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('history.emptyHint')}</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px' }}>{t('history.colId')}</th>
                  <th style={{ padding: '12px' }}>{t('history.colDate')}</th>
                  <th style={{ padding: '12px' }}>{t('history.colCategory')}</th>
                  <th style={{ padding: '12px' }}>{t('history.colConfidence')}</th>
                  <th style={{ padding: '12px' }}>{t('history.colCost')} ({paisConfig.moneda})</th>
                  <th style={{ padding: '12px' }}>{t('history.colActions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => {
                  const costo = convertirDesdeBase(item.costo_estimado_mensual);
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-cyan-600)' }}>{item.identificador}</td>
                      <td style={{ padding: '14px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {formatDate(item.fecha, { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <span className={`badge ${getBadgeClass(item.categoria)}`}>{item.categoria}</span>
                      </td>
                      <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 600 }}>{(item.probabilidad * 100).toFixed(1)}%</td>
                      <td className="font-mono" style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--color-emerald-600)' }}>
                        {formatMoney(costo)}
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => onSelectAnalisis(item)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} title={t('history.view')}>
                            <ExternalLink size={12} /> {t('history.view')}
                          </button>
                          <button onClick={() => generarComprobantePDF(item)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--color-emerald-500)' }} title={t('history.pdf')}>
                            <FileText size={12} /> {t('history.pdf')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};