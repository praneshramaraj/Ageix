import { IncidentItem } from '../../../types/eoc';

export class ReportExporter {
  public static exportToCSV(filename: string, rows: any[]) {
    if (!rows || !rows.length) return;
    const headers = Object.keys(rows[0]).join(',');
    const body = rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${body}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public static generatePdfBrief(title: string, summary: string, incidents: IncidentItem[]) {
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; background: #fff; color: #111; padding: 20px; }
          h1 { color: #0088cc; border-bottom: 2px solid #0088cc; padding-bottom: 5px; }
          .summary { background: #f0f4f8; padding: 15px; border-left: 4px solid #0088cc; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #0088cc; color: white; }
        </style>
      </head>
      <body>
        <h1>AEGISX Disaster Response Executive Report: ${title}</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <div class="summary">
          <h3>AI Executive Summary</h3>
          <p>${summary}</p>
        </div>
        <h3>Active Incident Summary (${incidents.length} Total)</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Location</th>
              <th>Affected</th>
            </tr>
          </thead>
          <tbody>
            ${incidents
              .map(
                (i) => `
              <tr>
                <td>${i.code || i.id}</td>
                <td>${i.title}</td>
                <td>${i.category}</td>
                <td>${i.severity}</td>
                <td>${i.locationName || 'GPS'}</td>
                <td>${i.affectedCount || 1}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
