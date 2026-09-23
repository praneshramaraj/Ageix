// EOC Report Exporter Utility (PDF, Excel, CSV)

export class ExportUtils {
  /**
   * Export array of JSON objects to CSV file download
   */
  public static exportToCsv(filename: string, rows: Record<string, any>[]): void {
    if (!rows || !rows.length) return;

    const headers = Object.keys(rows[0]);
    const csvLines = [headers.join(',')];

    for (const row of rows) {
      const values = headers.map((header) => {
        const val = row[header] === undefined || row[header] === null ? '' : row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvLines.push(values.join(','));
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvLines.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${filename}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export JSON data to Excel (.xlsx format fallback via CSV Blob)
   */
  public static exportToExcel(filename: string, rows: Record<string, any>[]): void {
    this.exportToCsv(filename, rows);
  }

  /**
   * Export current EOC summary view to printable PDF view
   */
  public static exportToPdf(title: string, htmlContent: string): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - AEGISX EOC Report</title>
          <style>
            body { font-family: monospace, sans-serif; background: #fff; color: #000; padding: 20px; }
            h1 { color: #005F73; border-bottom: 2px solid #005F73; padding-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #f0f0f0; font-weight: bold; }
            .header-meta { font-size: 11px; color: #555; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>AEGISX Disaster Response Platform - ${title}</h1>
          <div class="header-meta">
            Generated Date: ${new Date().toLocaleString()} | EOC Node: Supreme Command Center | DEFCON: Active
          </div>
          ${htmlContent}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
