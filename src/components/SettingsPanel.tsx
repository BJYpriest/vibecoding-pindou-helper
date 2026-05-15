import { useState } from 'react';
import { Sliders } from 'lucide-react';
import { beadBrands } from '@/data/beadColors';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { QuantAlgorithm } from '@/lib/pixelUtils';

export interface Settings {
  brandId: string;
  gridWidth: number;
  gridHeight: number;
  maxColors: number;
  algorithm: QuantAlgorithm;
  dithering: boolean;
  customSize: boolean;
}

interface SettingsPanelProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
  onConvert: () => void;
}

const gridPresets = [
  { label: '29×29', w: 29, h: 29 },
  { label: '40×40', w: 40, h: 40 },
  { label: '58×58', w: 58, h: 58 },
];

const algorithmOptions: { value: QuantAlgorithm; label: string; desc: string }[] = [
  { value: 'median', label: 'Median Cut（推荐）', desc: '保留主要颜色，效果均衡' },
  { value: 'kmeans', label: 'K-Means', desc: '颜色分布更均匀' },
  { value: 'nearest', label: '最近匹配', desc: '每个像素独立匹配，颜色最精确' },
];

function getColorLevelColors(maxColors: number): { easy: string; medium: string; complex: string } {
  return {
    easy: maxColors <= 8 ? '#4ADE80' : '#A8A29E',
    medium: maxColors > 8 && maxColors <= 15 ? '#FFB347' : '#A8A29E',
    complex: maxColors > 15 ? '#FF6B9D' : '#A8A29E',
  };
}

export default function SettingsPanel({ settings, onChange, onConvert }: SettingsPanelProps) {
  const [showCustom, setShowCustom] = useState(settings.customSize);

  const brand = beadBrands.find((b) => b.id === settings.brandId);
  const levelColors = getColorLevelColors(settings.maxColors);

  const update = (partial: Partial<Settings>) => {
    onChange({ ...settings, ...partial });
  };

  const handlePresetClick = (w: number, h: number) => {
    setShowCustom(false);
    update({ gridWidth: w, gridHeight: h, customSize: false });
  };

  const handleCustomClick = () => {
    setShowCustom(true);
    update({ customSize: true });
  };

  const getEstimatedSize = () => {
    const w = (settings.gridWidth * 5) / 10;
    const h = (settings.gridHeight * 5) / 10;
    return `约 ${w.toFixed(1)}×${h.toFixed(1)} cm`;
  };

  return (
    <div className="bg-bg-surface border border-border-custom rounded-xl p-6 md:p-8 shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <Sliders size={18} className="text-brand-primary" />
        <h3 className="text-lg font-semibold text-text-primary">转换设置</h3>
      </div>

      <div className="space-y-6">
        {/* Brand Selection */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">
            拼豆品牌
          </label>
          <p className="text-xs text-text-muted mb-3">
            不同品牌的拼豆颜色略有差异，请选择你使用的品牌
          </p>
          <select
            value={settings.brandId}
            onChange={(e) => update({ brandId: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-border-custom bg-bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          >
            {beadBrands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.colors.length}色
              </option>
            ))}
          </select>
          {brand && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {brand.colors.slice(0, 16).map((color) => (
                <div
                  key={color.code}
                  className="w-5 h-5 rounded-full border border-border-custom/50"
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name} ${color.code}`}
                />
              ))}
              {brand.colors.length > 16 && (
                <span className="text-xs text-text-muted self-center ml-1">
                  +{brand.colors.length - 16}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border-custom/60" />

        {/* Grid Size */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">
            网格尺寸
          </label>
          <p className="text-xs text-text-muted mb-3">
            拼豆板的钉数，决定最终作品的精细度
          </p>
          <div className="flex gap-2 mb-3">
            {gridPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset.w, preset.h)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  !showCustom &&
                  settings.gridWidth === preset.w &&
                  settings.gridHeight === preset.h
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-bg-surface text-text-secondary border-border-custom hover:border-brand-primary/50'
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={handleCustomClick}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                showCustom
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-bg-surface text-text-secondary border-border-custom hover:border-brand-primary/50'
              }`}
            >
              自定义
            </button>
          </div>
          {showCustom && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">宽</span>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={settings.gridWidth}
                  onChange={(e) => update({ gridWidth: Math.min(200, Math.max(5, Number(e.target.value))) })}
                  className="w-16 h-9 px-2 rounded-lg border border-border-custom text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
              <span className="text-text-muted">×</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">高</span>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={settings.gridHeight}
                  onChange={(e) => update({ gridHeight: Math.min(200, Math.max(5, Number(e.target.value))) })}
                  className="w-16 h-9 px-2 rounded-lg border border-border-custom text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>
          )}
          <p className="text-xs text-text-muted mt-2">{getEstimatedSize()}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-border-custom/60" />

        {/* Max Colors */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-semibold text-text-primary">最大颜色数</label>
            <span className="text-2xl font-bold text-brand-primary tabular-nums">
              {settings.maxColors}
            </span>
          </div>
          <p className="text-xs text-text-muted mb-3">
            限制使用的颜色数量，颜色越少制作越简单
          </p>
          <Slider
            value={[settings.maxColors]}
            onValueChange={(v) => update({ maxColors: v[0] })}
            min={4}
            max={30}
            step={1}
            className="mb-3"
          />
          <div className="flex gap-2">
            {[
              { label: '简单', range: '4-8色', value: 6, color: levelColors.easy },
              { label: '适中', range: '9-15色', value: 12, color: levelColors.medium },
              { label: '复杂', range: '16-30色', value: 23, color: levelColors.complex },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => update({ maxColors: chip.value })}
                className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: chip.color + '20',
                  color: chip.color,
                }}
              >
                {chip.label} ({chip.range})
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border-custom/60" />

        {/* Algorithm */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">
            颜色匹配算法
          </label>
          <p className="text-xs text-text-muted mb-3">
            选择颜色量化的方式，影响最终效果
          </p>
          <div className="space-y-2">
            {algorithmOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  settings.algorithm === opt.value
                    ? 'border-brand-primary bg-brand-primary-light/30'
                    : 'border-border-custom hover:border-border-hover'
                }`}
              >
                <div className="mt-0.5">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      settings.algorithm === opt.value
                        ? 'border-brand-primary'
                        : 'border-border-custom'
                    }`}
                  >
                    {settings.algorithm === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-brand-primary" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">{opt.label}</div>
                  <div className="text-xs text-text-muted">{opt.desc}</div>
                </div>
                <input
                  type="radio"
                  name="algorithm"
                  value={opt.value}
                  checked={settings.algorithm === opt.value}
                  onChange={() => update({ algorithm: opt.value })}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border-custom/60" />

        {/* Dithering */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold text-text-primary">启用抖动</label>
            <p className="text-xs text-text-muted">通过抖动模拟更多颜色</p>
          </div>
          <Switch
            checked={settings.dithering}
            onCheckedChange={(checked) => update({ dithering: checked })}
          />
        </div>

        {/* Convert Button */}
        <button
          onClick={onConvert}
          className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
        >
          开始转换 →
        </button>
      </div>
    </div>
  );
}
