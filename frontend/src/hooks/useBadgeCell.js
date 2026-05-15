// Canvas-based single-cell extractor for badge batch sheets.
// Crops the text label area, removes white/near-white background, caches result.
import { useState, useEffect } from 'react';

const _cache = new Map();

export function useBadgeCell(
  imagePath,
  cellCol,
  cellRow,
  batchCols,
  batchRows,
  textRatio = 0.28,
  whiteTol  = 210,
) {
  const key = `${imagePath}|${cellCol}|${cellRow}|${batchCols}|${batchRows}|${textRatio}|${whiteTol}`;
  const [dataUrl, setDataUrl] = useState(() => _cache.get(key) ?? null);

  useEffect(() => {
    if (_cache.has(key)) { setDataUrl(_cache.get(key)); return; }

    // Individual pre-processed badge — return the URL directly, no canvas work needed
    if (batchCols === 1 && batchRows === 1) {
      _cache.set(key, imagePath);
      setDataUrl(imagePath);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (cancelled) return;
      const cellW = img.naturalWidth  / batchCols;
      const cellH = img.naturalHeight / batchRows;
      const artH  = Math.floor(cellH * (1 - textRatio));

      const cvs = document.createElement('canvas');
      cvs.width  = Math.ceil(cellW);
      cvs.height = artH;
      const ctx  = cvs.getContext('2d');

      ctx.drawImage(
        img,
        cellCol * cellW, cellRow * cellH,
        cellW, artH,
        0, 0,
        cvs.width, artH,
      );

      const px = ctx.getImageData(0, 0, cvs.width, artH);
      const d  = px.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > whiteTol && d[i + 1] > whiteTol && d[i + 2] > whiteTol) {
          d[i + 3] = 0;
        }
      }
      ctx.putImageData(px, 0, 0);

      const url = cvs.toDataURL();
      _cache.set(key, url);
      if (!cancelled) setDataUrl(url);
    };

    img.onerror = () => { if (!cancelled) setDataUrl(null); };
    img.src = imagePath;

    return () => { cancelled = true; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return dataUrl;
}
