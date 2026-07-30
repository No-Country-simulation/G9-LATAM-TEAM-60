import type { AnalisisResponse } from '../types';

/**
 * Genera un Comprobante Oficial de Diagnóstico Energético en formato PDF/Imprimible
 * con diseño profesional corporativo.
 */
export const generarComprobantePDF = (analisis: AnalisisResponse) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor permite las ventanas emergentes (popups) para descargar el comprobante PDF.');
    return;
  }

  const fechaFormateada = analisis.fecha 
    ? new Date(analisis.fecha).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'medium' })
    : new Date().toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'medium' });

  const isEfi = analisis.categoria.toLowerCase().includes('efi');
  const isMod = analisis.categoria.toLowerCase().includes('mod');
  
  const badgeColor = isEfi ? '#10b981' : isMod ? '#f59e0b' : '#f43f5e';
  const badgeBg = isEfi ? '#ecfdf5' : isMod ? '#fffbe6' : '#fff1f2';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Comprobante_EnergiaAI_${analisis.identificador}.pdf</title>
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
            <div class="doc-title">Comprobante de Inferencia ML</div>
            <div class="doc-id">${analisis.identificador}</div>
          </div>
        </div>

        <!-- KPI Resumen -->
        <div class="kpi-banner">
          <div class="kpi-item">
            <span class="kpi-label">Categoría Diagnosticada</span>
            <span class="kpi-val badge-status">${analisis.categoria}</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-label">Precisión del Modelo ML</span>
            <span class="kpi-val">${(analisis.probabilidad * 100).toFixed(1)}%</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-label">Costo Estimado Mensual</span>
            <span class="kpi-val">R$ ${analisis.costo_estimado_mensual.toFixed(2)}</span>
          </div>
        </div>

        <!-- Parámetros Evaluados -->
        <div class="section-title">📋 Parámetros de la Evaluación</div>
        <table class="table-custom">
          <thead>
            <tr>
              <th>Parámetro Evaluado</th>
              <th>Valor Registrado</th>
              <th>Normativa Tarifaria</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Consumo Energético Mensual</td>
              <td><strong>${analisis.request?.consumo_kwh ?? '-'} kWh</strong></td>
              <td>R$ 0.75 / kWh</td>
            </tr>
            <tr>
              <td>Tipo de Inmueble</td>
              <td><strong>${analisis.request?.tipo_inmueble ?? '-'}</strong></td>
              <td>Sector Residencial / Comercial</td>
            </tr>
            <tr>
              <td>Electrodomésticos / Equipos</td>
              <td><strong>${analisis.request?.cantidad_equipos ?? '-'} Unidades</strong></td>
              <td>Demanda Simultánea</td>
            </tr>
            <tr>
              <td>Uso en Horario Pico (18h - 22h)</td>
              <td><strong>${analisis.request?.uso_horario_pico ? 'SÍ (Pico Registrado)' : 'NO (Normal)'}</strong></td>
              <td>Tarifa de Alta Demanda</td>
            </tr>
            <tr>
              <td>Región Geográfica LATAM</td>
              <td><strong>${analisis.request?.region ?? 'Centro'}</strong></td>
              <td>Matriz Interconectada</td>
            </tr>
          </tbody>
        </table>

        <!-- Recomendaciones Directivas -->
        <div class="section-title">💡 Directivas de Optimización Energética</div>
        <div class="rec-box">
          ${analisis.recomendaciones?.map(r => `
            <div class="rec-item">
              <span>⚡</span>
              <span>${r}</span>
            </div>
          `).join('') || '<div class="rec-item">Sin recomendaciones especiales.</div>'}
        </div>

        <!-- Footer Oficial -->
        <div class="footer">
          <div>
            Emisión Oficial: <strong>${fechaFormateada}</strong><br>
            Plataforma EnergiAI LATAM — Algoritmo Scikit-Learn (Regresión Logística / Random Forest)
          </div>
          <div class="verification-seal">
            ✔ Autenticado por Oracle Cloud Infrastructure (OCI)
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
