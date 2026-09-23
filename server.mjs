import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const PORT = 8080;
const ZURICH_MBTILES = '/Users/pranesh/Desktop/GIS-Server/tiles/zurich_switzerland.mbtiles';

let db = null;
try {
  if (fs.existsSync(ZURICH_MBTILES)) {
    db = new DatabaseSync(ZURICH_MBTILES);
    console.log(`[TileServer] Opened MBTiles: ${ZURICH_MBTILES}`);
  }
} catch (err) {
  console.error('[TileServer] Error opening MBTiles:', err);
}

// Prepared statements for MBTiles retrieval
const getTileStmt = db ? db.prepare('SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?') : null;
const getMetadataStmt = db ? db.prepare('SELECT name, value FROM metadata') : null;

function getMetadataMap() {
  if (!getMetadataStmt) return {};
  const rows = getMetadataStmt.all();
  const meta = {};
  for (const r of rows) {
    meta[r.name] = r.value;
  }
  return meta;
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Root landing page
  if (pathname === '/' || pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AEGISX GIS Vector TileServer</title>
        <style>
          body { font-family: monospace; background: #07161E; color: #00D4FF; padding: 2rem; }
          h1 { color: #fff; border-bottom: 1px solid #1E3440; padding-bottom: 0.5rem; }
          a { color: #3DDC84; }
          .card { background: #10232C; border: 1px solid #1E3440; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
        </style>
      </head>
      <body>
        <h1>AEGISX / ResQLink v2 Vector TileServer</h1>
        <div class="card">
          <p><strong>Status:</strong> Active & Serving Vector Tiles</p>
          <p><strong>MBTiles:</strong> ${db ? 'Loaded (zurich_switzerland.mbtiles)' : 'Fallback Mode'}</p>
          <ul>
            <li><a href="/styles/basic/style.json">/styles/basic/style.json</a> (Style Specification)</li>
            <li><a href="/data/v3.json">/data/v3.json</a> (TileJSON Metadata)</li>
            <li><a href="/data/v3/10/527/362.pbf">/data/v3/10/527/362.pbf</a> (Sample Vector Tile)</li>
          </ul>
        </div>
      </body>
      </html>
    `);
    return;
  }

  // TileJSON Metadata Endpoint: /data/v3.json
  if (pathname === '/data/v3.json' || pathname === '/data/v3') {
    const meta = getMetadataMap();
    const tileJson = {
      tilejson: '2.2.0',
      name: meta.name || 'OpenMapTiles Vector Tiles',
      description: meta.description || 'AEGISX Vector Tile Server',
      version: meta.version || '3.14.0',
      attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      scheme: 'xyz',
      tiles: [`http://localhost:${PORT}/data/v3/{z}/{x}/{y}.pbf`],
      minzoom: parseInt(meta.minzoom || '0', 10),
      maxzoom: parseInt(meta.maxzoom || '19', 10),
      bounds: meta.bounds ? meta.bounds.split(',').map(Number) : [-180, -85.0511, 180, 85.0511],
      center: meta.center ? meta.center.split(',').map(Number) : [8.5375, 47.379, 10],
      format: meta.format || 'pbf',
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tileJson, null, 2));
    return;
  }

  // Style Specification Endpoint: /styles/basic/style.json
  if (pathname === '/styles/basic/style.json' || pathname === '/style.json') {
    const styleObj = {
      version: 8,
      name: 'AEGISX Basic OSM Style',
      sources: {
        openmaptiles: {
          type: 'vector',
          url: `http://localhost:${PORT}/data/v3.json`,
        },
      },
      glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#07161E',
          },
        },
        {
          id: 'water',
          type: 'fill',
          source: 'openmaptiles',
          'source-layer': 'water',
          paint: {
            'fill-color': '#00D4FF',
            'fill-opacity': 0.6,
          },
        },
        {
          id: 'landuse-park',
          type: 'fill',
          source: 'openmaptiles',
          'source-layer': 'landcover',
          paint: {
            'fill-color': '#3DDC84',
            'fill-opacity': 0.4,
          },
        },
        {
          id: 'building-3d',
          type: 'fill-extrusion',
          source: 'openmaptiles',
          'source-layer': 'building',
          minzoom: 12,
          paint: {
            'fill-extrusion-color': '#3182ce',
            'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 15],
            'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0],
            'fill-extrusion-opacity': 0.85,
          },
        },
        {
          id: 'road-primary',
          type: 'line',
          source: 'openmaptiles',
          'source-layer': 'transportation',
          paint: {
            'line-color': '#00D4FF',
            'line-width': 2.5,
          },
        },
        {
          id: 'road-secondary',
          type: 'line',
          source: 'openmaptiles',
          'source-layer': 'transportation',
          filter: ['!=', 'class', 'motorway'],
          paint: {
            'line-color': '#AAB6C3',
            'line-width': 1.5,
          },
        },
        {
          id: 'admin-boundary',
          type: 'line',
          source: 'openmaptiles',
          'source-layer': 'boundary',
          paint: {
            'line-color': '#FFB000',
            'line-width': 1.5,
            'line-dasharray': [2, 2],
          },
        },
        {
          id: 'place-label',
          type: 'symbol',
          source: 'openmaptiles',
          'source-layer': 'place',
          layout: {
            'text-field': '{name}',
            'text-size': 12,
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#07161E',
            'text-halo-width': 1,
          },
        },
      ],
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(styleObj, null, 2));
    return;
  }

  // Vector Tile Endpoint: /data/v3/:z/:x/:y.pbf
  const tileMatch = pathname.match(/^\/data\/v3\/(\d+)\/(\d+)\/(\d+)\.(pbf|mvt)$/);
  if (tileMatch) {
    const z = parseInt(tileMatch[1], 10);
    const x = parseInt(tileMatch[2], 10);
    const y = parseInt(tileMatch[3], 10);

    // Convert XYZ to TMS tile row
    const tmsY = (1 << z) - 1 - y;

    if (getTileStmt) {
      try {
        const row = getTileStmt.get(z, x, tmsY);
        if (row && row.tile_data) {
          res.writeHead(200, {
            'Content-Type': 'application/x-protobuf',
            'Content-Encoding': 'gzip',
            'Cache-Control': 'public, max-age=86400',
          });
          res.end(row.tile_data);
          return;
        }
      } catch (err) {
        console.error(`[TileServer] Error fetching tile z=${z} x=${x} y=${y}:`, err);
      }
    }

    // Empty PBF Vector Tile fallback for unmapped tiles
    res.writeHead(200, {
      'Content-Type': 'application/x-protobuf',
      'Cache-Control': 'public, max-age=3600',
    });
    res.end(Buffer.alloc(0));
    return;
  }

  // 404 Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint Not Found', pathname }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[AEGISX TileServer] Running on http://localhost:${PORT}`);
  console.log(` -> Style: http://localhost:${PORT}/styles/basic/style.json`);
  console.log(` -> TileJSON: http://localhost:${PORT}/data/v3.json`);
});
