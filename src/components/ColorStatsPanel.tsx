import { useMemo } from 'react';
import { getPegboardCount, getRealSizeCm } from '@/lib/pixelUtils';
import type { ConversionResult } from '@/lib/pixelUtils';

interface ColorStatsPanelProps {
  result: ConversionResult | null;
}

export default function ColorStatsPanel({ result }: ColorStatsPanelProps) {
  const totalBeads = useMemo(() => {
    if (!result) return 0;
    return result.statistics.reduce((sum, s) => sum + s.count, 0);
  }, [result]);

  const maxCount = useMemo(() => {
    if (!result || result.statistics.length === 0) return 1;
    return Math.max(...result.statistics.map((s) => s.count));
  }, [result]);

  if (!result) {
    return (
      <div className="bg-bg-surface border border-border-custom rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">颜色统计</h3>
        <p className="text-xs text-text-muted">转换完成后将显示颜色使用统计</p>
      </div>
    );
  }

  const pegboards = getPegboardCount(result.width, result.height);
  const realSize = getRealSizeCm(result.width, result.height);

  return (
    <div className="bg-bg-surface border border-border-custom rounded-xl p-5 shadow-card">
      <h3 className="text-lg font-semibold text-text-primary mb-0.5">颜色统计</h3>
      <p className="text-xs text-text-muted mb-4">
        共使用 {result.statistics.length} 种颜色，约 {totalBeads} 颗拼豆
      </p>

      {/* Color list */}
      <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
        {result.statistics.map((stat) => (
          <div
            key={stat.code}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-warm/50 transition-colors group"
          >
            {/* Color swatch */}
            <div
              className="w-8 h-8 rounded-full border-2 border-border-custom flex-shrink-0 group-hover:scale-110 group-hover:border-brand-primary transition-all"
              style={{ backgroundColor: stat.color.hex }}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-text-muted w-5 text-center">
                  {stat.letter}
                </span>
                <span className="text-sm font-medium text-text-primary truncate">
                  {stat.color.name}
                </span>
                <span className="text-xs font-mono text-text-muted ml-auto flex-shrink-0">
                  {stat.code}
                </span>
              </div>
              {/* Percentage bar */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-bg-warm rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-600"
                    style={{
                      width: `${(stat.count / maxCount) * 100}%`,
                      backgroundColor: stat.color.hex,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-text-secondary tabular-nums flex-shrink-0 w-10 text-right">
                  {stat.count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="mt-4 pt-4 border-t border-border-custom space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">总计</span>
          <span className="font-semibold text-text-primary">{totalBeads} 颗</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">预估尺寸</span>
          <span className="font-semibold text-text-primary">约 {realSize} cm</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">拼豆板</span>
          <span className="font-semibold text-text-primary">
            需 {pegboards} 块 29×29 板
          </span>
        </div>
      </div>
    </div>
  );
}
