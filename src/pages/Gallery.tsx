import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  X,
  Star,
  Grid3X3,
  Palette,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import {
  galleryExamples,
  categoryFilters,
  sortOptions,
  filterExamples,
  type GalleryExample,
} from '@/data/galleryExamples';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: easeOut },
  }),
  exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.2 } },
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: easeOut },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Pixel-art preview using the example's CSS gradient */
function PixelArtPreview({
  example,
  className = '',
  showGrid = false,
}: {
  example: GalleryExample;
  className?: string;
  showGrid?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ aspectRatio: '1' }}
    >
      {/* Base gradient as the "pixel art" */}
      <div
        className="absolute inset-0"
        style={{ background: example.pixelArtCss }}
      />
      {/* Optional grid overlay */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #D4C8BC 1px, transparent 1px),
              linear-gradient(to bottom, #D4C8BC 1px, transparent 1px)
            `,
            backgroundSize: `${100 / example.gridWidth}% ${100 / example.gridHeight}%`,
          }}
        />
      )}
    </div>
  );
}

/** Original photo preview (CSS gradient placeholder) */
function OriginalPreview({
  example,
  className = '',
}: {
  example: GalleryExample;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ background: example.originalCss, aspectRatio: '1' }}
    >
      {/* Subtle icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <Eye className="w-8 h-8 text-white" />
      </div>
    </div>
  );
}

/** Difficulty star display */
function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= level
              ? 'text-brand-warning fill-brand-warning'
              : 'text-border-custom'
          }`}
        />
      ))}
    </div>
  );
}

/** Color swatch strip (horizontal row of mini circles) */
function ColorStrip({
  colors,
  maxDisplay = 8,
  size = 12,
}: {
  colors: { hex: string; name: string }[];
  maxDisplay?: number;
  size?: number;
}) {
  const display = colors.slice(0, maxDisplay);
  const remaining = colors.length - maxDisplay;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {display.map((c, i) => (
        <div
          key={i}
          className="rounded-full border border-border-custom flex-shrink-0"
          style={{ width: size, height: size, backgroundColor: c.hex }}
          title={c.name}
        />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-text-muted ml-0.5">+{remaining}</span>
      )}
    </div>
  );
}

/** Gallery card */
function GalleryCard({
  example,
  index,
  onClick,
}: {
  example: GalleryExample;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="group cursor-pointer bg-bg-surface rounded-xl border border-border-custom overflow-hidden shadow-card hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-brand-primary/30 transition-all duration-200"
      onClick={onClick}
    >
      {/* Image area */}
      <div className="relative" style={{ aspectRatio: '1' }}>
        <PixelArtPreview
          example={example}
          className="w-full h-full"
          showGrid
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <Eye className="w-4 h-4" />
            <span>查看详情</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Info area */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-text-primary mb-2">
          {example.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="px-2.5 py-0.5 bg-brand-primary-light text-brand-primary text-xs font-medium rounded-full">
            {example.colorCount}色
          </span>
          <span className="px-2 py-0.5 bg-bg-grid text-text-secondary text-xs rounded-full">
            {example.brandName}
          </span>
          <span className="text-xs text-text-muted">
            {example.gridWidth}×{example.gridHeight}
          </span>
        </div>

        {/* Color strip */}
        <div className="mb-3">
          <ColorStrip colors={example.colors} maxDisplay={8} size={14} />
        </div>

        {/* Difficulty + Bead count */}
        <div className="flex items-center justify-between">
          <DifficultyStars level={example.difficulty} />
          <span className="text-xs text-text-muted">
            {example.beadCount}颗
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/** Detail Modal */
function DetailModal({
  example,
  onClose,
}: {
  example: GalleryExample;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleUseTemplate = useCallback(() => {
    // Navigate to home page (user can apply settings there)
    navigate('/');
  }, [navigate]);

  // Estimate physical size (each bead is ~5mm)
  const estWidthCm = ((example.gridWidth * 5) / 10).toFixed(1);
  const estHeightCm = ((example.gridHeight * 5) / 10).toFixed(1);

  // Boards needed (29x29 boards)
  const boardsW = Math.ceil(example.gridWidth / 29);
  const boardsH = Math.ceil(example.gridHeight / 29);
  const totalBoards = boardsW * boardsH;

  return (
    <motion.div
      variants={modalBackdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal content */}
      <motion.div
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative bg-bg-surface rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-bg-surface/80 hover:bg-bg-grid transition-colors text-text-secondary hover:text-text-primary"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <motion.div variants={staggerItem} className="mb-3">
              <span className="inline-block px-3 py-1 bg-brand-primary-light text-brand-primary text-sm font-medium rounded-full">
                {example.categoryLabel}
              </span>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-2"
            >
              {example.title}
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-text-secondary text-sm"
            >
              {example.description}
            </motion.p>
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-4 mt-3 flex-wrap"
            >
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <Palette className="w-4 h-4 text-brand-primary" />
                {example.colorCount}色
              </span>
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <Layers className="w-4 h-4 text-brand-primary" />
                {example.brandName}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <Grid3X3 className="w-4 h-4 text-brand-primary" />
                {example.gridWidth}×{example.gridHeight}
              </span>
              <DifficultyStars level={example.difficulty} />
            </motion.div>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
            {/* Left: Before/After */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Side by side */}
              <motion.div
                variants={staggerItem}
                className="grid grid-cols-2 gap-3 mb-4"
              >
                <div>
                  <p className="text-xs text-text-muted mb-2 text-center font-medium">
                    原图
                  </p>
                  <OriginalPreview
                    example={example}
                    className="w-full border border-border-custom"
                  />
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-2 text-center font-medium">
                    拼豆像素画
                  </p>
                  <PixelArtPreview
                    example={example}
                    className="w-full border border-border-custom"
                    showGrid
                  />
                </div>
              </motion.div>

              {/* Large pixel art display */}
              <motion.div variants={staggerItem}>
                <p className="text-xs text-text-muted mb-2 font-medium">
                  像素网格预览
                </p>
                <div className="border border-border-custom rounded-lg overflow-hidden">
                  <PixelArtPreview
                    example={example}
                    className="w-full"
                    showGrid
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Colors + Stats */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              {/* Color breakdown */}
              <motion.div variants={staggerItem}>
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-brand-primary" />
                  颜色配方
                </h3>
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {example.colors.map((color, i) => {
                    const pct = (
                      (color.count / example.beadCount) *
                      100
                    ).toFixed(1);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-grid transition-colors"
                      >
                        <div
                          className="w-8 h-8 rounded-full border-2 border-border-custom flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-text-primary font-medium truncate">
                              {color.name}
                            </span>
                            <span className="text-xs text-text-muted font-mono ml-2">
                              {color.code}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex-1 h-1.5 bg-bg-grid rounded-full overflow-hidden mr-3">
                              <div
                                className="h-full bg-brand-primary rounded-full"
                                style={{
                                  width: `${Math.max(
                                    parseFloat(pct),
                                    4
                                  )}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-text-muted whitespace-nowrap">
                              {color.count}颗 ({pct}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Statistics */}
              <motion.div
                variants={staggerItem}
                className="bg-bg-cream rounded-xl p-4 border border-border-custom"
              >
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-secondary" />
                  制作信息
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg-surface rounded-lg p-3 text-center border border-border-custom">
                    <p className="text-lg font-bold text-brand-primary font-mono">
                      {example.beadCount}
                    </p>
                    <p className="text-xs text-text-muted mt-1">总拼豆数</p>
                  </div>
                  <div className="bg-bg-surface rounded-lg p-3 text-center border border-border-custom">
                    <p className="text-lg font-bold text-brand-primary font-mono">
                      {example.colorCount}
                    </p>
                    <p className="text-xs text-text-muted mt-1">颜色数</p>
                  </div>
                  <div className="bg-bg-surface rounded-lg p-3 text-center border border-border-custom">
                    <p className="text-lg font-bold text-text-primary font-mono">
                      {estWidthCm}×{estHeightCm}
                    </p>
                    <p className="text-xs text-text-muted mt-1">预估尺寸 (cm)</p>
                  </div>
                  <div className="bg-bg-surface rounded-lg p-3 text-center border border-border-custom">
                    <p className="text-lg font-bold text-text-primary font-mono">
                      {totalBoards}
                    </p>
                    <p className="text-xs text-text-muted mt-1">需要板数</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Footer actions */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8 pt-6 border-t border-border-custom"
          >
            <button
              onClick={handleUseTemplate}
              className="flex-1 sm:flex-none px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-medium rounded-full transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              使用此模板
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-bg-surface hover:bg-bg-grid text-text-primary font-medium rounded-full border border-border-custom transition-all flex items-center justify-center gap-2"
            >
              关闭
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** CTA Banner */
function CTABanner() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: easeOut }}
      className="w-full bg-brand-primary py-12 px-6 mt-16"
    >
      <div className="max-w-[1200px] mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          想制作自己的拼豆像素画？
        </h2>
        <p className="text-white/80 text-base mb-8 max-w-md mx-auto">
          上传你的图片，几分钟内获得完整的拼豆制作指南。
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3.5 bg-bg-surface text-brand-primary font-semibold rounded-full hover:scale-[1.02] transition-all shadow-lg flex items-center gap-2 mx-auto"
        >
          立即开始制作
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Gallery Page                                                  */
/* ------------------------------------------------------------------ */

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortKey, setSortKey] = useState<string>('newest');
  const [selectedExample, setSelectedExample] = useState<GalleryExample | null>(
    null
  );

  const filtered = filterExamples(galleryExamples, activeCategory, sortKey);

  return (
    <div className="min-h-[100dvh]">
      {/* ========== Section 1: Page Header ========== */}
      <section className="pt-16 pb-8 px-6 text-center">
        <div className="max-w-[1200px] mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-block text-sm font-medium text-brand-primary tracking-wider uppercase mb-3"
          >
            示例画廊
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
            className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4 tracking-tight"
          >
            拼豆像素画灵感集
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: easeOut }}
            className="text-base text-text-secondary max-w-[560px] mx-auto leading-relaxed"
          >
            浏览我们精选的拼豆图案示例，每一个都附带完整的颜色配方和制作指南。点击任意作品查看详情。
          </motion.p>
        </div>
      </section>

      {/* ========== Section 2: Filter Bar ========== */}
      <section className="sticky top-16 z-40 bg-bg-cream/95 backdrop-blur-md border-b border-border-custom py-4 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Filter pills */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-2 flex-wrap"
            >
              {categoryFilters.map((filter, i) => (
                <motion.button
                  key={filter.key}
                  custom={i}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { delay: i * 0.05, duration: 0.4, ease: easeOut },
                    },
                  }}
                  onClick={() => setActiveCategory(filter.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeCategory === filter.key
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-transparent text-text-secondary hover:bg-bg-grid hover:text-text-primary'
                  }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </motion.div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Count badge */}
              <span className="text-xs text-text-muted whitespace-nowrap">
                共 {filtered.length} 个示例
              </span>

              {/* Sort dropdown (custom) */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-text-secondary hover:bg-bg-grid hover:text-text-primary transition-all border border-border-custom">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {sortOptions.find((o) => o.key === sortKey)?.label}
                </button>
                <div className="absolute right-0 top-full mt-1 w-36 bg-bg-surface border border-border-custom rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSortKey(opt.key)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortKey === opt.key
                          ? 'bg-brand-primary-light text-brand-primary font-medium'
                          : 'text-text-secondary hover:bg-bg-grid'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Section 3: Example Grid ========== */}
      <section className="py-8 px-6">
        <div className="max-w-[1200px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + sortKey}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((example, i) => (
                <GalleryCard
                  key={example.id}
                  example={example}
                  index={i}
                  onClick={() => setSelectedExample(example)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-text-muted text-lg">暂无此类别的示例</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ========== Section 4: Detail Modal ========== */}
      <AnimatePresence>
        {selectedExample && (
          <DetailModal
            example={selectedExample}
            onClose={() => setSelectedExample(null)}
          />
        )}
      </AnimatePresence>

      {/* ========== Section 5: CTA Banner ========== */}
      <CTABanner />

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
