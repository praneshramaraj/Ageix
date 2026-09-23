var e=class{static exportToCsv(e,t){if(!t||!t.length)return;let n=Object.keys(t[0]),r=[n.join(`,`)];for(let e of t){let t=n.map(t=>`"${(``+(e[t]===void 0||e[t]===null?``:e[t])).replace(/"/g,`""`)}"`);r.push(t.join(`,`))}let i=`data:text/csv;charset=utf-8,`+encodeURIComponent(r.join(`
`)),a=document.createElement(`a`);a.setAttribute(`href`,i),a.setAttribute(`download`,`${e}_${new Date().toISOString().substring(0,10)}.csv`),document.body.appendChild(a),a.click(),document.body.removeChild(a)}static exportToExcel(e,t){this.exportToCsv(e,t)}static exportToPdf(e,t){let n=window.open(``,`_blank`);n&&(n.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${e} - AEGISX EOC Report</title>
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
          <h1>AEGISX Disaster Response Platform - ${e}</h1>
          <div class="header-meta">
            Generated Date: ${new Date().toLocaleString()} | EOC Node: Supreme Command Center | DEFCON: Active
          </div>
          ${t}
          <script>
            window.onload = function() { window.print(); };
          <\/script>
        </body>
      </html>
    `),n.document.close())}};export{e as t};