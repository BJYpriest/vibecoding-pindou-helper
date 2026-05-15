import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Settings as SettingsIcon, Palette, Download, Check, Sparkles, Image, Ruler } from 'lucide-react';
import UploadZone from '@/components/UploadZone';
import SettingsPanel, { type Settings } from '@/components/SettingsPanel';
import PixelGridPreview from '@/components/PixelGridPreview';
import ColorStatsPanel from '@/components/ColorStatsPanel';
import ExportPanel from '@/components/ExportPanel';
import FloatingBeads from '@/components/FloatingBeads';
import { beadBrands } from '@/data/beadColors';
import { pixelizeImage, quantizeColors } from '@/lib/pixelUtils';
import type { ConversionResult, QuantAlgorithm } from '@/lib/pixelUtils';

const defaultSettings: Settings = {
  brandId: 'simplified_24',
  gridWidth: 29,
  gridHeight: 29,
  maxColors: 12,
  algorithm: 'median',
  dithering: false,
  customSize: false,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const featureCards = [
  { icon: Upload, title: '一键上传', desc: '拖拽或点击上传图片，支持 PNG、JPG、WebP 格式' },
  { icon: SettingsIcon, title: '智能转换', desc: '多种颜色匹配算法，精准映射到拼豆颜色' },
  { icon: Palette, title: '颜色统计', desc: '自动生成颜色使用清单和数量统计' },
  { icon: Download, title: '导出图纸', desc: '支持 PNG 网格图和 PDF 制作指南导出' },
];

const howItWorks = [
  { step: '1', title: '上传图片', desc: '选择你喜欢的图片，拖拽或点击上传即可' },
  { step: '2', title: '调整设置', desc: '选择拼豆品牌、网格尺寸和颜色数量' },
  { step: '3', title: '导出制作', desc: '预览效果满意后，导出图纸开始制作' },
];

const brands = [
  { name: 'Perler', desc: '美国', count: 57 },
  { name: 'Hama', desc: '丹麦', count: 53 },
  { name: 'Artkal', desc: '中国', count: 156 },
  { name: 'MARD', desc: '', count: 168 },
];

const tips = [
  { icon: Sparkles, text: '新手建议：先从4-8色的简单图案开始' },
  { icon: Ruler, text: '标准拼豆板为29×29钉，约19cm见方' },
  { icon: Palette, text: '颜色越多效果越精细，制作也更复杂' },
];

// Placeholder example patterns
const examples = [
  { name: '小猫咪', colors: 8, bg: 'linear-gradient(135deg, #FFB347 0%, #FF6B9D 100%)' },
  { name: '像素马里奥', colors: 12, bg: 'linear-gradient(135deg, #F01820 0%, #3370C0 50%, #ECD800 100%)' },
  { name: '海边夕阳', colors: 10, bg: 'linear-gradient(135deg, #ED6120 0%, #F6B3DD 50%, #3370C0 100%)' },
  { name: '爱心图案', colors: 4, bg: 'linear-gradient(135deg, #F01820 0%, #FF6B9D 100%)' },
  { name: '闪亮星星', colors: 6, bg: 'linear-gradient(135deg, #ECD800 0%, #FFB347 100%)' },
];

export default function Home() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageLoad = useCallback((img: HTMLImageElement, file: File) => {
    setImage(img);
    setFileName(file.name);
    setResult(null);
  }, []);

  const handleClear = useCallback(() => {
    setImage(null);
    setFileName('');
    setResult(null);
  }, []);

  const handleConvert = useCallback(() => {
    if (!image) return;
    setIsConverting(true);
    setResult(null);

    // Use requestAnimationFrame to show loading state
    requestAnimationFrame(() => {
      try {
        const brand = beadBrands.find((b) => b.id === settings.brandId);
        if (!brand) return;

        // Use aspect ratio to determine actual grid dimensions
        const imgAspect = image.naturalWidth / image.naturalHeight;
        let targetW = settings.gridWidth;
        let targetH = settings.gridHeight;

        if (!settings.customSize) {
          // Maintain aspect ratio within the max dimension
          if (imgAspect > 1) {
            targetH = Math.round(targetW / imgAspect);
          } else {
            targetW = Math.round(targetH * imgAspect);
          }
          targetW = Math.max(5, Math.min(200, targetW));
          targetH = Math.max(5, Math.min(200, targetH));
        }

        const imageData = pixelizeImage(image, targetW, targetH);
        const conversionResult = quantizeColors(
          imageData,
          brand.colors,
          settings.maxColors,
          settings.algorithm as QuantAlgorithm
        );

        setResult(conversionResult);
      } catch (err) {
        console.error('Conversion error:', err);
        alert('转换失败，请重试');
      } finally {
        setIsConverting(false);
      }
    });
  }, [image, settings]);

  const scrollToUpload = () => {
    const el = document.getElementById('upload-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-[100dvh]">
      {/* ===== Section 1: Hero ===== */}
      <section className="relative overflow-hidden px-6 pt-16 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center min-h-[360px]">
            {/* Text */}
            <div className="md:col-span-3 relative z-10">
              <motion.h1
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-4xl md:text-5xl font-black text-text-primary tracking-tight leading-tight mb-4"
              >
                拼豆工坊
              </motion.h1>
              <motion.h2
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-xl md:text-2xl font-bold text-text-secondary mb-4"
              >
                把你的照片变成拼豆像素画
              </motion.h2>
              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-base text-text-secondary max-w-[480px] leading-relaxed mb-6"
              >
                上传任意图片，自动转换为拼豆像素画。智能颜色匹配，网格编码标注，一键导出制作指南。
              </motion.p>
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex gap-3"
              >
                <button
                  onClick={scrollToUpload}
                  className="px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl transition-all hover:scale-[1.02]"
                >
                  开始制作
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('examples-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-bg-surface hover:bg-bg-warm text-text-primary font-semibold rounded-xl border border-border-custom transition-all"
                >
                  查看示例
                </button>
              </motion.div>
            </div>
            {/* Decorative beads */}
            <motion.div
              className="md:col-span-2 relative h-[280px] md:h-[360px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <FloatingBeads />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Section 2: Tool Interface ===== */}
      <section id="upload-section" className="px-6 py-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <UploadZone
              onImageLoad={handleImageLoad}
              loadedImage={image}
              fileName={fileName}
              onClear={handleClear}
            />
          </motion.div>

          {/* Settings + Preview two-column layout */}
          <AnimatePresence>
            {image && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="mt-6 overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Settings */}
                  <div className="lg:col-span-4">
                    <SettingsPanel
                      settings={settings}
                      onChange={setSettings}
                      onConvert={handleConvert}
                    />
                  </div>

                  {/* Center + Right: Preview + Color Stats */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Pixel Grid Preview */}
                    <div className="bg-bg-surface border border-border-custom rounded-xl p-4 md:p-6 shadow-card">
                      <PixelGridPreview
                        result={result}
                        isConverting={isConverting}
                        exportCanvasRef={previewCanvasRef}
                      />
                    </div>

                    {/* Export buttons */}
                    <AnimatePresence>
                      {result && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <ExportPanel
                            result={result}
                            canvasRef={previewCanvasRef}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Color stats below on desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ColorStatsPanel result={result} />

                      {/* Mini info card */}
                      <div className="bg-bg-warm border border-border-custom rounded-xl p-5">
                        <h4 className="text-sm font-semibold text-text-primary mb-3">制作提示</h4>
                        <ul className="space-y-2">
                          {[
                            '使用标准 5mm 拼豆',
                            '每块 29×29 板约 19cm',
                            '建议用镊子放置拼豆',
                            '熨烫时覆盖烘焙纸',
                          ].map((tip) => (
                            <li key={tip} className="flex items-start gap-2 text-sm text-text-secondary">
                              <Check size={14} className="text-brand-success mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ===== Section 3: How It Works ===== */}
      <section className="px-6 py-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">如何使用</h2>
            <p className="text-text-secondary max-w-[500px] mx-auto">
              简单三步，轻松将照片转换为拼豆像素画
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-bg-surface border border-border-custom rounded-xl p-6 text-center hover:shadow-card-hover transition-shadow"
              >
                <div className="w-12 h-12 bg-brand-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-brand-primary">{item.step}</span>
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 4: Features ===== */}
      <section className="px-6 py-16 bg-bg-warm">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">功能亮点</h2>
            <p className="text-text-secondary max-w-[500px] mx-auto">
              专业的拼豆转换工具，让手工制作更轻松
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-bg-surface border border-border-custom rounded-xl p-6 hover:-translate-y-0.5 hover:shadow-card-hover transition-all"
              >
                <div className="w-10 h-10 bg-brand-primary-light rounded-lg flex items-center justify-center mb-4">
                  <feat.icon size={20} className="text-brand-primary" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{feat.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 5: Brand Support ===== */}
      <section className="px-6 py-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">支持品牌</h2>
            <p className="text-text-secondary max-w-[500px] mx-auto">
              覆盖主流拼豆品牌，精确匹配每种颜色
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brands.map((b, i) => (
              <motion.div
                key={b.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-bg-surface border border-border-custom rounded-xl p-6 text-center hover:shadow-card-hover transition-all"
              >
                <div className="w-14 h-14 bg-brand-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <Image size={24} className="text-brand-primary" />
                </div>
                <h4 className="text-base font-semibold text-text-primary">{b.name}</h4>
                <p className="text-xs text-text-muted mt-1">
                  {b.desc} {b.count}色
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 6: Quick Examples ===== */}
      <section id="examples-section" className="px-6 py-16 bg-bg-warm">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">试试这些示例</h2>
            <p className="text-text-secondary max-w-[500px] mx-auto">
              没有合适的图片？选择下方的示例快速体验拼豆转换效果
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {examples.map((ex, i) => (
              <motion.div
                key={ex.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-bg-surface rounded-xl overflow-hidden border border-border-custom hover:-translate-y-1 hover:shadow-card-hover transition-all cursor-pointer group"
                onClick={() => {
                  scrollToUpload();
                }}
              >
                <div
                  className="aspect-square relative"
                  style={{ background: ex.bg }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      点击试用
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-text-primary">{ex.name}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-brand-primary-light text-brand-primary text-xs font-medium rounded-full">
                    {ex.colors}色
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 7: Tips Banner ===== */}
      <section className="bg-brand-primary-light px-6 py-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <tip.icon size={16} className="text-brand-primary" />
              </div>
              <p className="text-sm font-medium text-text-secondary">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
