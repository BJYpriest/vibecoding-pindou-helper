import { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Grid3X3, Type, Maximize } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { ConversionResult, ColorStat } from '@/lib/pixelUtils';

interface PixelGridPreviewProps {
  result: ConversionResult | null;
  isConverting: boolean;
  exportCanvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export default function PixelGridPreview({ result, isConverting, exportCanvasRef }: PixelGridPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showEncoding, setShowEncoding] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  // Get cell size in pixels at current zoom
  const getCellSize = useCallback(() => {
    if (!result) return 20;
    const baseSize = Math.max(8, Math.min(32, Math.floor(480 / Math.max(result.width, result.height))));
    return Math.max(4, Math.floor(baseSize * (zoom / 100)));
  }, [result, zoom]);

  // Draw the grid on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = getCellSize();
    const gridWidth = result.width * cellSize;
    const gridHeight = result.height * cellSize;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = gridWidth * dpr;
    canvas.height = gridHeight * dpr;
    canvas.style.width = `${gridWidth}px`;
    canvas.style.height = `${gridHeight}px`;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, gridWidth, gridHeight);

    // Build lookup from letter -> color
    const letterToColor = new Map<string, string>();
    for (const stat of result.statistics) {
      letterToColor.set(stat.letter, stat.color.hex);
    }

    // Draw cells
    for (let y = 0; y < result.height; y++) {
      for (let x = 0; x < result.width; x++) {
        const letter = result.grid[y]?.[x] || '?';
        const color = letterToColor.get(letter) || '#FFFFFF';
        const xPos = x * cellSize;
        const yPos = y * cellSize;

        // Highlight hovered color
        if (hoveredColor && hoveredCell?.x === x && hoveredCell?.y === y) {
          ctx.fillStyle = '#FF6B9D';
          ctx.fillRect(xPos - 1, yPos - 1, cellSize + 2, cellSize + 2);
        }

        ctx.fillStyle = color;
        ctx.fillRect(xPos, yPos, cellSize, cellSize);

        // Highlight cells of same color on hover
        if (hoveredColor && hoveredCell) {
          const hoveredLetter = result.grid[hoveredCell.y]?.[hoveredCell.x];
          if (letter === hoveredLetter && !(x === hoveredCell.x && y === hoveredCell.y)) {
            ctx.fillStyle = 'rgba(255, 107, 157, 0.15)';
            ctx.fillRect(xPos, yPos, cellSize, cellSize);
          }
        }
      }
    }

    // Grid lines
    if (showGrid && cellSize >= 6) {
      ctx.strokeStyle = '#D4C8BC';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= result.width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, gridHeight);
        ctx.stroke();
      }
      for (let y = 0; y <= result.height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(gridWidth, y * cellSize);
        ctx.stroke();
      }
    }

    // Encoding labels
    if (showEncoding && cellSize >= 14) {
      ctx.font = `bold ${Math.max(7, Math.min(11, cellSize - 4))}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < result.height; y++) {
        for (let x = 0; x < result.width; x++) {
          const letter = result.grid[y]?.[x] || '?';
          const xPos = x * cellSize + cellSize / 2;
          const yPos = y * cellSize + cellSize / 2;

          // Text shadow for readability
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillText(letter, xPos + 0.5, yPos + 0.5);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(letter, xPos, yPos);
        }
      }
    }

    // Hover highlight border
    if (hoveredCell && hoveredCell.x >= 0 && hoveredCell.x < result.width && hoveredCell.y >= 0 && hoveredCell.y < result.height) {
      ctx.strokeStyle = '#FF6B9D';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        hoveredCell.x * cellSize,
        hoveredCell.y * cellSize,
        cellSize,
        cellSize
      );
    }
  }, [result, zoom, showGrid, showEncoding, hoveredCell, hoveredColor, getCellSize]);

  // Draw export canvas (high-res, fixed size, no hover effects)
  useEffect(() => {
    if (!exportCanvasRef?.current || !result) return;
    const canvas = exportCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const exportCellSize = 20; // Fixed high-res cell size
    const gridWidth = result.width * exportCellSize;
    const gridHeight = result.height * exportCellSize;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = gridWidth * dpr;
    canvas.height = gridHeight * dpr;
    canvas.style.width = `${gridWidth}px`;
    canvas.style.height = `${gridHeight}px`;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, gridWidth, gridHeight);

    const letterToColor = new Map<string, string>();
    for (const stat of result.statistics) {
      letterToColor.set(stat.letter, stat.color.hex);
    }

    // Draw cells
    for (let y = 0; y < result.height; y++) {
      for (let x = 0; x < result.width; x++) {
        const letter = result.grid[y]?.[x] || '?';
        const color = letterToColor.get(letter) || '#FFFFFF';
        ctx.fillStyle = color;
        ctx.fillRect(x * exportCellSize, y * exportCellSize, exportCellSize, exportCellSize);
      }
    }

    // Grid lines
    ctx.strokeStyle = '#D4C8BC';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= result.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * exportCellSize, 0);
      ctx.lineTo(x * exportCellSize, gridHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= result.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * exportCellSize);
      ctx.lineTo(gridWidth, y * exportCellSize);
      ctx.stroke();
    }

    // Encoding labels
    ctx.font = `bold ${Math.max(8, exportCellSize - 6)}px "Space Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let y = 0; y < result.height; y++) {
      for (let x = 0; x < result.width; x++) {
        const letter = result.grid[y]?.[x] || '?';
        const xPos = x * exportCellSize + exportCellSize / 2;
        const yPos = y * exportCellSize + exportCellSize / 2;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillText(letter, xPos + 0.5, yPos + 0.5);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(letter, xPos, yPos);
      }
    }
  }, [result, exportCanvasRef]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !result) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const cellSize = getCellSize();
      const x = Math.floor((e.clientX - rect.left) / cellSize);
      const y = Math.floor((e.clientY - rect.top) / cellSize);
      if (x >= 0 && x < result.width && y >= 0 && y < result.height) {
        setHoveredCell({ x, y });
        const letter = result.grid[y]?.[x];
        const stat = result.statistics.find((s) => s.letter === letter);
        setHoveredColor(stat?.color.hex || null);
      }
    },
    [result, getCellSize]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
    setHoveredColor(null);
  }, []);

  // Get tooltip info
  const getTooltipInfo = (): ColorStat | null => {
    if (!hoveredCell || !result) return null;
    const letter = result.grid[hoveredCell.y]?.[hoveredCell.x];
    return result.statistics.find((s) => s.letter === letter) || null;
  };

  const tooltipInfo = getTooltipInfo();

  if (isConverting) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="flex gap-1.5">
          {['#FF6B9D', '#FFB347', '#4ADE80', '#60A5FA'].map((color, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full animate-bounce"
              style={{ backgroundColor: color, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-sm text-text-secondary">正在匹配拼豆颜色...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Grid3X3 size={48} className="text-text-muted/30" />
        <p className="text-sm text-text-muted">上传图片并设置参数后，预览将显示在这里</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-bg-surface rounded-full border border-border-custom self-start">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-1.5 rounded-full transition-colors ${showGrid ? 'bg-brand-primary-light text-brand-primary' : 'text-text-muted hover:text-text-secondary'}`}
          title="切换网格线"
        >
          <Grid3X3 size={16} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(50, z - 25))}
          className="p-1.5 rounded-full text-text-muted hover:text-text-secondary transition-colors"
          title="缩小"
        >
          <ZoomOut size={16} />
        </button>
        <div className="w-24">
          <Slider
            value={[zoom]}
            onValueChange={(v) => setZoom(v[0])}
            min={50}
            max={400}
            step={25}
          />
        </div>
        <button
          onClick={() => setZoom((z) => Math.min(400, z + 25))}
          className="p-1.5 rounded-full text-text-muted hover:text-text-secondary transition-colors"
          title="放大"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => setZoom(100)}
          className="p-1.5 rounded-full text-text-muted hover:text-text-secondary transition-colors"
          title="适应宽度"
        >
          <Maximize size={16} />
        </button>
        <div className="w-px h-4 bg-border-custom mx-1" />
        <button
          onClick={() => setShowEncoding(!showEncoding)}
          className={`p-1.5 rounded-full transition-colors ${showEncoding ? 'bg-brand-primary-light text-brand-primary' : 'text-text-muted hover:text-text-secondary'}`}
          title="切换编码显示"
        >
          <Type size={16} />
        </button>
        <span className="text-xs text-text-muted font-mono ml-1">{zoom}%</span>
      </div>

      {/* Grid Canvas */}
      <div
        ref={containerRef}
        className="relative overflow-auto rounded-lg border border-border-custom bg-white"
        style={{ maxHeight: '600px' }}
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="cursor-crosshair block"
        />

        {/* Tooltip */}
        {tooltipInfo && hoveredCell && (
          <div
            className="absolute pointer-events-none z-10 bg-bg-dark text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap"
            style={{
              left: hoveredCell.x * getCellSize() + getCellSize() + 8,
              top: hoveredCell.y * getCellSize(),
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white/30"
                style={{ backgroundColor: tooltipInfo.color.hex }}
              />
              <span className="font-medium">
                {tooltipInfo.color.name} · {tooltipInfo.color.code}
              </span>
            </div>
            <div className="text-text-muted mt-0.5 pl-5">
              已用 {tooltipInfo.count} 颗 ({tooltipInfo.percentage.toFixed(1)}%)
            </div>
          </div>
        )}
      </div>

      {/* Scale indicator */}
      <p className="text-xs text-text-muted font-mono">
        {result.width}×{result.height} 格 · 预估 {((result.width * 5) / 10).toFixed(1)}×{((result.height * 5) / 10).toFixed(1)} cm
      </p>

      {/* Hidden export canvas */}
      {exportCanvasRef && (
        <canvas ref={exportCanvasRef} className="hidden" />
      )}
    </div>
  );
}
