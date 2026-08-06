import type { AnalisisResponse } from '../types';
import { ENERGIA_POR_PAIS } from './country';
import { TRANSLATIONS } from './i18n';
import { CURRENCIES, convertFromBaseCost } from './currency';

/**
 * Genera un Comprobante Oficial de Diagnóstico Energético en formato PDF/Imprimible
 * con diseño profesional corporativo.
 */
export const generarComprobantePDF = (analisis: AnalisisResponse) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups / Permite las ventanas emergentes para descargar el comprobante PDF.');
    return;
  }

  // Determinar país y traducciones
  const savedPais = localStorage.getItem('energiAI_pais') || 'CL';
  const paisConfig = ENERGIA_POR_PAIS[savedPais] || ENERGIA_POR_PAIS.CL;
  const locale = paisConfig.locale || 'es-CL';
  const lang = paisConfig.idioma || 'es';
  const tr = TRANSLATIONS[lang] || TRANSLATIONS.es;
  const t = (key: string) => tr[key] || TRANSLATIONS.es[key] || key;

  // Moneda y costo (sin decimales, con salvaguarda anti-doble conversión)
  const monedaCode = paisConfig.moneda;
  const curr = CURRENCIES[monedaCode] || CURRENCIES.CLP;
  const rawCost = analisis.costo_estimado_mensual || 0;
  // Si rawCost es mayor a 5000 (significa que fue convertido previamente), se desconvierte para calcular limpiamente
  const costoBase = rawCost > 5000 ? (rawCost / curr.exchangeRateFromBase) : rawCost;
  const costoConvertido = Math.round(convertFromBaseCost(costoBase, monedaCode));
  const costoStr = `${curr.symbol} ${costoConvertido.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // Parámetros capturados de la simulación
  const consumoKwh = analisis.consumo_kwh ?? analisis.request?.consumo_kwh ?? 240;
  const tipoInmueble = analisis.tipo_inmueble ?? analisis.request?.tipo_inmueble ?? 'Casa';
  const cantidadEquipos = analisis.cantidad_equipos ?? analisis.request?.cantidad_equipos ?? 6;
  const usoHorarioPico = (analisis.uso_horario_pico ?? analisis.request?.uso_horario_pico) ?? false;
  const horasAltoConsumo = analisis.horas_alto_consumo ?? analisis.request?.horas_alto_consumo ?? 4;
  const region = analisis.region ?? analisis.request?.region ?? 'Centro';

  // CO2
  const co2Total = Math.round(consumoKwh * paisConfig.factorCO2 * 10) / 10;
  const co2Str = `${co2Total.toLocaleString(locale)} ${paisConfig.unidad}`;

  const fechaFormateada = analisis.fecha
    ? new Date(analisis.fecha).toLocaleString(locale, { dateStyle: 'full', timeStyle: 'medium' })
    : new Date().toLocaleString(locale, { dateStyle: 'full', timeStyle: 'medium' });

  const isEfi = analisis.categoria.toLowerCase().includes('efi');
  const isMod = analisis.categoria.toLowerCase().includes('mod');
  
  const badgeColor = isEfi ? '#10b981' : isMod ? '#f59e0b' : '#f43f5e';
  const badgeBg = isEfi ? '#ecfdf5' : isMod ? '#fffbe6' : '#fff1f2';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <title>${t('pdf.certified')}_${analisis.identificador}.pdf</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@600;800&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          background: #ffffff;
          padding: 40px;
          line-height: 1.5;
        }

        .certificate-container {
          max-width: 800px;
          margin: 0 auto;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 40px;
          position: relative;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 24px;
          margin-bottom: 32px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          background: #10b981;
          color: #ffffff;
          font-weight: 800;
          font-size: 22px;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-title {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }

        .brand-title span {
          color: #10b981;
        }

        .doc-type {
          text-align: right;
        }

        .doc-title {
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
        }

        .doc-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
          font-weight: 800;
          color: #10b981;
          margin-top: 4px;
        }

        .kpi-banner {
          background: ${badgeBg};
          border: 2px solid ${badgeColor};
          border-radius: 14px;
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          text-align: center;
          margin-bottom: 32px;
        }

        .kpi-item {
          display: flex;
          flex-direction: column;
        }

        .kpi-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 6px;
        }

        .kpi-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }

        .badge-status {
          color: ${badgeColor};
          text-transform: uppercase;
        }

        .section-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .table-custom {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
        }

        .table-custom th, .table-custom td {
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
          font-size: 14px;
        }

        .table-custom th {
          background: #f8fafc;
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 700;
        }

        .rec-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 32px;
        }

        .rec-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 10px;
          font-size: 13.5px;
          color: #334155;
        }

        .rec-item:last-child {
          margin-bottom: 0;
        }

        .footer {
          border-top: 2px solid #f1f5f9;
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #94a3b8;
        }

        .verification-seal {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: #10b981;
        }

        @media print {
          body {
            padding: 0;
          }
          .certificate-container {
            border: none;
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate-container">
        <!-- Header -->
        <div class="header">
          <div class="brand">
            <div class="logo-icon">⚡</div>
            <div class="brand-title">Energi<span>AI</span></div>
          </div>
          <div class="doc-type">
            <div class="doc-title">${t('pdf.certified')}</div>
            <div class="doc-id">${analisis.identificador}</div>
          </div>
        </div>

        <!-- KPI Resumen -->
        <div class="kpi-banner">
          <div class="kpi-item">
            <span class="kpi-label">${t('pdf.category')}</span>
            <span class="kpi-val badge-status">${analisis.categoria}</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-label">${t('pdf.confidence')}</span>
            <span class="kpi-val">${(analisis.probabilidad * 100).toFixed(1)}%</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-label">${t('pdf.monthlyCost')} (${monedaCode})</span>
            <span class="kpi-val">${costoStr}</span>
          </div>
          <div class="kpi-item" style="grid-column: span 3; border-top: 1px solid ${badgeColor}30; padding-top: 12px; margin-top: 4px;">
            <span class="kpi-label">${t('pdf.co2')} — ${paisConfig.bandera} ${paisConfig.nombre}</span>
            <span class="kpi-val" style="color: #10b981; font-size: 16px;">🌿 ${co2Str}</span>
          </div>
        </div>

        <!-- Parámetros Evaluados -->
        <div class="section-title">📋 ${t('pdf.inputData')}</div>
        <table class="table-custom">
          <thead>
            <tr>
              <th>Parámetro Evaluado</th>
              <th>Valor Registrado</th>
              <th>Detalle / Referencia</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${t('pdf.consumption')}</td>
              <td><strong>${consumoKwh} kWh</strong></td>
              <td>Base IA 0.75 R$/kWh × ${monedaCode}</td>
            </tr>
            <tr>
              <td>${t('pdf.propertyType')}</td>
              <td><strong>${tipoInmueble}</strong></td>
              <td>Sector Residencial / Comercial</td>
            </tr>
            <tr>
              <td>${t('pdf.appliances')}</td>
              <td><strong>${cantidadEquipos}</strong></td>
              <td>Demanda Simultánea</td>
            </tr>
            <tr>
              <td>${t('pdf.highConsumptionHours')}</td>
              <td><strong>${horasAltoConsumo} hrs/día</strong></td>
              <td>Patrón Diario</td>
            </tr>
            <tr>
              <td>${t('pdf.peakHours')}</td>
              <td><strong>${usoHorarioPico ? t('pdf.yes') : t('pdf.no')}</strong></td>
              <td>Tarifa Alta Demanda (18h-22h)</td>
            </tr>
            <tr>
              <td>${t('pdf.region')}</td>
              <td><strong>${region}</strong></td>
              <td>${paisConfig.bandera} ${paisConfig.nombre}</td>
            </tr>
          </tbody>
        </table>

        <!-- Recomendaciones Directivas -->
        <div class="section-title">💡 ${t('pdf.recommendations')}</div>
        <div class="rec-box">
          ${analisis.recomendaciones?.map(r => `
            <div class="rec-item">
              <span>⚡</span>
              <span>${r}</span>
            </div>
          `).join('') || `<div class="rec-item">${t('res.noRecommendations')}</div>`}
        </div>

        <!-- Footer Oficial -->
        <div class="footer">
          <div>
            ${t('pdf.date')}: <strong>${fechaFormateada}</strong><br>
            ${t('pdf.poweredBy')}
          </div>
          <div class="verification-seal">
            ✔ ${t('pdf.certified')} — OCI
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

/**
 * Genera una Cartola Energética Oficial en formato PDF/Imprimible
 * con diseño de estado de cuenta bancario corporativo.
 */
export const generarCartolaPDF = (list: AnalisisResponse[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups / Permite las ventanas emergentes para descargar la Cartola PDF.');
    return;
  }

  const savedPais = localStorage.getItem('energiAI_pais') || 'CL';
  const paisConfig = ENERGIA_POR_PAIS[savedPais] || ENERGIA_POR_PAIS.CL;
  const locale = paisConfig.locale || 'es-CL';
  const lang = paisConfig.idioma || 'es';
  const tr = TRANSLATIONS[lang] || TRANSLATIONS.es;
  const t = (key: string) => tr[key] || TRANSLATIONS.es[key] || key;

  const monedaCode = paisConfig.moneda;
  const curr = CURRENCIES[monedaCode] || CURRENCIES.CLP;

  const totalOperaciones = list.length;
  const consumoTotal = list.reduce((sum, item) => sum + (item.consumo_kwh ?? item.request?.consumo_kwh ?? 240), 0);
  const consumoPromedio = totalOperaciones > 0 ? Math.round(consumoTotal / totalOperaciones) : 0;
  
  const costoTotalBase = list.reduce((sum, item) => sum + (item.costo_estimado_mensual || 0), 0);
  const costoTotalConvertido = Math.round(convertFromBaseCost(costoTotalBase, monedaCode));
  const costoTotalStr = `${curr.symbol} ${costoTotalConvertido.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const co2Promedio = Math.round(consumoPromedio * paisConfig.factorCO2 * 10) / 10;
  const co2Str = `${co2Promedio.toLocaleString(locale)} ${paisConfig.unidad}`;

  const fechaEmision = new Date().toLocaleString(locale, { dateStyle: 'full', timeStyle: 'medium' });

  const rowsHtml = list.map((item, idx) => {
    const rawCost = item.costo_estimado_mensual || 0;
    const costoBase = rawCost > 5000 ? (rawCost / curr.exchangeRateFromBase) : rawCost;
    const costoConv = Math.round(convertFromBaseCost(costoBase, monedaCode));
    const costoFormatted = `${curr.symbol} ${costoConv.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    
    const fechaRow = item.fecha ? new Date(item.fecha).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' }) : '—';
    const consumoRow = item.consumo_kwh ?? item.request?.consumo_kwh ?? 240;
    const inmuebleRow = item.tipo_inmueble ?? item.request?.tipo_inmueble ?? 'Casa';

    const isEfi = item.categoria.toLowerCase().includes('efi');
    const isMod = item.categoria.toLowerCase().includes('mod');
    const catColor = isEfi ? '#059669' : isMod ? '#d97706' : '#dc2626';

    return `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${fechaRow}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #0284c7; font-size: 13px;">${item.identificador}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${inmuebleRow}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-size: 13px;">${consumoRow} kWh</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: ${catColor}; font-size: 13px;">${item.categoria}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 13px;">${(item.probabilidad * 100).toFixed(1)}%</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; text-align: right; color: #059669; font-size: 13px;">${costoFormatted}</td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <title>Cartola_Historica_EnergiaAI_${paisConfig.codigo}_${new Date().toISOString().slice(0,10)}.pdf</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@600;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; background: #ffffff; padding: 36px; line-height: 1.5; }
        .statement-container { max-width: 900px; margin: 0 auto; border: 2px solid #e2e8f0; border-radius: 16px; padding: 36px; position: relative; }
        
        .bank-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 24px; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .logo-icon { background: #10b981; color: #ffffff; font-weight: 800; font-size: 22px; width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .brand-title { font-size: 24px; font-weight: 800; color: #0f172a; }
        .brand-title span { color: #10b981; }

        .statement-title { text-align: right; }
        .st-name { font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; }
        .st-sub { font-size: 12px; color: #64748b; margin-top: 2px; }

        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 28px; font-size: 13px; }
        .info-cell span { display: block; }
        .info-label { color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
        .info-val { font-weight: 700; color: #0f172a; }

        .summary-banner { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #ecfdf5; border: 1.5px solid #10b981; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 28px; }
        .sum-item { display: flex; flex-direction: column; }
        .sum-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #047857; margin-bottom: 4px; }
        .sum-val { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: #064e3b; }

        .table-title { font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px; }
        .statement-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
        .statement-table th { background: #0f172a; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 10px 12px; text-align: left; }
        .statement-table th:last-child { text-align: right; }

        .footer { border-top: 2px solid #f1f5f9; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; }
        .seal { display: flex; align-items: center; gap: 6px; font-weight: 700; color: #10b981; font-size: 12px; }

        @media print {
          body { padding: 0; }
          .statement-container { border: none; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="statement-container">
        <!-- Banner Banco / Empresa -->
        <div class="bank-header">
          <div class="brand">
            <div class="logo-icon">⚡</div>
            <div>
              <div class="brand-title">Energi<span>AI</span></div>
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">Plataforma de Diagnóstico Energético LATAM</div>
            </div>
          </div>
          <div class="statement-title">
            <div class="st-name">${t('history.downloadCartola')} — ${paisConfig.nombre}</div>
            <div class="st-sub">${t('history.subtitle')}</div>
          </div>
        </div>

        <!-- Info Cuenta -->
        <div class="info-grid">
          <div class="info-cell">
            <span class="info-label">${t('country.select')}</span>
            <span class="info-val">${paisConfig.bandera} ${paisConfig.nombre} (${monedaCode})</span>
          </div>
          <div class="info-cell">
            <span class="info-label">${t('pdf.date')}</span>
            <span class="info-val">${fechaEmision}</span>
          </div>
          <div class="info-cell">
            <span class="info-label">${t('config.rateBase')}</span>
            <span class="info-val">Base ML R$ 0.75 / kWh × T.C. ${monedaCode}</span>
          </div>
          <div class="info-cell">
            <span class="info-label">${t('config.co2Factor')}</span>
            <span class="info-val">${paisConfig.factorCO2} ${paisConfig.unidad}</span>
          </div>
        </div>

        <!-- Banner KPIs Resumen -->
        <div class="summary-banner">
          <div class="sum-item">
            <span class="sum-label">${t('dash.totalDiagnostics')}</span>
            <span class="sum-val">${totalOperaciones}</span>
          </div>
          <div class="sum-item">
            <span class="sum-label">${t('dash.avgConsumption')}</span>
            <span class="sum-val">${consumoPromedio} kWh</span>
          </div>
          <div class="sum-item">
            <span class="sum-label">${t('dash.accumulatedCost')}</span>
            <span class="sum-val">${costoTotalStr}</span>
          </div>
          <div class="sum-item">
            <span class="sum-label">${t('dash.carbonFootprint')}</span>
            <span class="sum-val">🌿 ${co2Str}</span>
          </div>
        </div>

        <!-- Tabla Histórica de Consumos -->
        <div class="table-title">📄 Detalle de Movimientos Energéticos</div>
        <table class="statement-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>ID Operación</th>
              <th>Inmueble</th>
              <th>Consumo</th>
              <th>Diagnóstico</th>
              <th>Confianza</th>
              <th>Cargo Estimado (${monedaCode})</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="7" style="text-align: center; padding: 20px; color: #64748b;">Sin movimientos registrados.</td></tr>`}
          </tbody>
        </table>

        <!-- Footer -->
        <div class="footer">
          <div>
            Documento Oficial Emitido por <strong>EnergiAI LATAM</strong><br>
            Algoritmo de Inferencia Machine Learning · Oracle Cloud Infrastructure (OCI)
          </div>
          <div class="seal">
            ✔ CARTOLA OFICIAL CERTIFICADA
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
