import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Image,
  Package,
  Grid3X3,
  Flame,
  Star,
  Lightbulb,
  ChevronRight,
  Search,
  Copy,
  Check,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { beadBrands } from '@/data/beadColors';
import type { BeadColor } from '@/data/beadColors';

/* ─────────────────── Animation helpers ─────────────────── */
const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

/* ─────────────────── Table of Contents ─────────────────── */
const tocItems = [
  { id: 'what-are', label: '什么是拼豆' },
  { id: 'brand-compare', label: '品牌对比' },
  { id: 'color-table', label: '颜色色号表' },
  { id: 'tutorial', label: '新手教程' },
  { id: 'tips', label: '制作技巧' },
  { id: 'faq', label: '常见问题' },
];

function TableOfContents({ activeId }: { activeId: string }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="hidden lg:block fixed right-8 top-[100px] w-[200px]">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="bg-[#FFFFFF] rounded-xl border border-[#E7DDD4] p-5"
      >
        <p className="text-sm font-semibold text-[#1A1714] mb-3">目录</p>
        <ul className="space-y-2">
          {tocItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`relative block text-sm pl-3 py-1 transition-colors ${
                  activeId === item.id
                    ? 'text-[#FF6B9D] font-medium'
                    : 'text-[#6B6560] hover:text-[#1A1714]'
                }`}
              >
                {activeId === item.id && (
                  <motion.span
                    layoutId="toc-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#FF6B9D] rounded-full"
                    transition={{ duration: 0.2 }}
                  />
                )}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

/* ─────────────────── Section wrapper ─────────────────── */
function Section({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-20 ${className}`}>
      {children}
    </section>
  );
}

/* ─────────────────── Bead Process Illustration ─────────────────── */
function ProcessIllustration() {
  const beads = [
    { color: '#F01820', delay: 0 },
    { color: '#ED6120', delay: 0.1 },
    { color: '#ECD800', delay: 0.2 },
    { color: '#4FAD42', delay: 0.3 },
    { color: '#3370C0', delay: 0.4 },
    { color: '#604089', delay: 0.5 },
  ];

  return (
    <div className="relative bg-[#FFFFFF] rounded-2xl border border-[#E7DDD4] p-8">
      {/* Step 1: Beads on pegboard */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-[#FF6B9D] bg-[#FFE4ED] px-2 py-0.5 rounded-full">Step 1</span>
          <span className="text-sm text-[#6B6560]">排列拼豆</span>
        </div>
        <div className="grid grid-cols-4 gap-2 bg-[#F5EDE3] rounded-lg p-4 border border-[#E7DDD4]">
          {beads.map((b, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: b.delay, duration: 0.3, ease: easeOut }}
              className="w-8 h-8 rounded-full border-2 border-[#D4C8BC] shadow-sm"
              style={{ backgroundColor: b.color }}
            />
          ))}
          {['#F6B3DD', '#56BA9F', '#93C8D4', '#FF6B9D'].map((c, i) => (
            <motion.div
              key={`e${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.3, ease: easeOut }}
              className="w-8 h-8 rounded-full border-2 border-[#D4C8BC] shadow-sm"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-4">
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronRight className="w-5 h-5 text-[#A8A29E] rotate-90" />
        </motion.div>
      </div>

      {/* Step 2: Ironing */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-[#FF6B9D] bg-[#FFE4ED] px-2 py-0.5 rounded-full">Step 2</span>
          <span className="text-sm text-[#6B6560]">熨烫融合</span>
        </div>
        <div className="bg-[#F5EDE3] rounded-lg p-4 border border-[#E7DDD4] flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="bg-gradient-to-r from-[#8A8D91] to-[#4D5156] rounded-lg px-4 py-2 text-white text-xs font-medium shadow-md"
          >
            熨斗
          </motion.div>
          <div className="text-xs text-[#A8A29E]">+</div>
          <div className="w-12 h-8 bg-[#FFF0E0] rounded border border-dashed border-[#D4C8BC] flex items-center justify-center">
            <span className="text-[10px] text-[#A8A29E]">熨烫纸</span>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-4">
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <ChevronRight className="w-5 h-5 text-[#A8A29E] rotate-90" />
        </motion.div>
      </div>

      {/* Step 3: Finished */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-[#FF6B9D] bg-[#FFE4ED] px-2 py-0.5 rounded-full">Step 3</span>
          <span className="text-sm text-[#6B6560]">完成作品</span>
        </div>
        <div className="bg-[#F5EDE3] rounded-lg p-4 border border-[#E7DDD4] flex items-center justify-center">
          <div className="grid grid-cols-4 gap-1.5">
            {beads.map((b, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-sm shadow-sm"
                style={{ backgroundColor: b.color }}
              />
            ))}
            {['#F6B3DD', '#56BA9F', '#93C8D4', '#FF6B9D'].map((c, i) => (
              <div
                key={`f${i}`}
                className="w-7 h-7 rounded-sm shadow-sm"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Brand Comparison Data ─────────────────── */
const brandRows = [
  { label: '颜色数量', values: ['57色', '53色', '156色', '168色', '30色'] },
  { label: '产地', values: ['美国', '丹麦', '中国', '中国', '丹麦'] },
  { label: '珠子尺寸', values: ['5mm', '5mm', '5mm / 2.6mm', '5mm', '5mm'] },
  { label: '颜色风格', values: ['鲜艳饱和', '柔和偏淡', '丰富多样', '丰富多样', '基础色'] },
  { label: '价格区间', values: ['中等', '中高', '低', '低', '低'] },
  { label: '国内购买', values: ['较难', '较难', '容易', '容易', '较难'] },
  { label: '适合人群', values: ['欧美风格爱好者', '柔和色调偏好', '专业玩家', '进阶玩家', '儿童入门'] },
];

const brandNames = ['Perler (美国)', 'Hama (丹麦)', 'Artkal (中国)', 'MARD', 'Nabbi'];

/* ─────────────────── Color swatch with copy ─────────────────── */
function ColorSwatch({ color }: { color: BeadColor }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(color.hex).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [color.hex]);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className="group flex items-center gap-3 bg-[#FFFFFF] rounded-lg border border-[#E7DDD4] p-3 hover:border-[#FF6B9D] hover:shadow-card-hover transition-all text-left w-full"
    >
      <div
        className="w-10 h-10 rounded-full border-2 border-[#E7DDD4] group-hover:border-[#FF6B9D] flex-shrink-0 transition-colors shadow-sm"
        style={{ backgroundColor: color.hex }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1A1714] truncate">{color.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A8A29E] font-mono">{color.code}</span>
          <span className="text-xs text-[#A8A29E] font-mono">{color.hex}</span>
        </div>
      </div>
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="w-4 h-4 text-[#4ADE80]" />
        ) : (
          <Copy className="w-4 h-4 text-[#A8A29E]" />
        )}
      </div>
    </motion.button>
  );
}

/* ─────────────────── Tutorial Step ─────────────────── */
const tutorialSteps = [
  {
    icon: Image,
    title: '选择图案',
    desc: '选择一张你喜欢的图片。对于新手，建议选择颜色简单、轮廓清晰的图案，如卡通角色、几何图形或文字。使用我们的拼豆转换工具上传图片，调整颜色数量和网格大小。',
  },
  {
    icon: Package,
    title: '准备材料',
    desc: '根据转换结果的颜色统计，准备所需的拼豆颜色。所需材料清单：拼豆（按颜色购买）、拼豆板（29x29为标准尺寸）、熨斗、熨烫纸/烘焙纸、镊子（可选但推荐）。',
  },
  {
    icon: Grid3X3,
    title: '排列拼豆',
    desc: '按照转换工具生成的网格编码图，在拼豆板上逐行放置拼豆。小技巧：从左到右、从上到下逐行放置，不容易出错。可以用镊子辅助精准放置。',
  },
  {
    icon: Flame,
    title: '熨烫固定',
    desc: '在拼好的图案上铺一层熨烫纸，用预热好的熨斗（中温档）均匀熨烫。熨烫时间约10-20秒，以拼豆侧面略微融化为标准。不要过度熨烫！翻面后同样熨烫背面，使两面都平整。',
  },
  {
    icon: Star,
    title: '完成作品',
    desc: '待作品完全冷却后，从拼豆板上取下。可以在背面粘贴磁铁、别针或钥匙扣配件，制作成实用的装饰品！',
  },
];

/* ─────────────────── Tips Data ─────────────────── */
const tips = [
  { title: '颜色越少越简单', content: '新手建议从4-8色的图案开始，熟悉基本流程后再挑战复杂作品。' },
  { title: '买套装更划算', content: '初学者可以直接购买24色套装，包含最常用的基础颜色。' },
  { title: '拼豆板可以拼接', content: '多个29x29的拼豆板可以拼接成更大的创作面积。' },
  { title: '熨烫技巧', content: '熨斗温度不要过高，中温档即可。看到拼豆侧面微微变圆就说明好了。' },
  { title: '使用工具辅助', content: '镊子是拼豆的好帮手，尤其是处理小尺寸图案时。也可以用牙签调整位置。' },
  { title: '保存剩余拼豆', content: '把用不完的拼豆按颜色保存在小分装盒中，方便下次使用。' },
];

/* ─────────────────── FAQ Data ─────────────────── */
const faqData = [
  { q: '什么是拼豆？', a: '拼豆（Perler Beads / Fuse Beads）是一种源自瑞典的DIY手工玩具。将彩色塑料小管按照图案排列在带有尖刺的拼豆板上，再用熨斗加热使其底部融合，即可制作出各种像素风格的平面或立体作品。' },
  { q: '需要哪些工具？', a: '制作拼豆需要：拼豆（彩色管珠）、拼豆板（带钉板）、熨斗、熨烫纸（或烘焙纸），以及图案指南。可选工具包括：镊子（精准放置）、分装盒（收纳颜色）、磁铁/别针配件（制作装饰品）。' },
  { q: '一副作品要多久？', a: '根据图案大小和复杂度，时间差异较大。简单的图案（如小图标）约30分钟-1小时，中等图案（如游戏角色）约2-4小时，大型复杂图案可能需要6小时以上。' },
  { q: '颜色数量越多越好吗？', a: '不一定。新手建议从24色套装开始，掌握基本技巧后再扩充。颜色太多会增加选择和分拣的时间，建议根据图案复杂度选择需要的颜色。' },
  { q: '可以用自己的照片吗？', a: '当然可以！使用我们的拼豆转换工具，上传你喜欢的照片，工具会自动将照片转换为拼豆像素画，并匹配最接近的品牌颜色。建议选择对比度高的原图效果更好。' },
  { q: '熨烫温度多少合适？', a: '一般使用中温档（约120-150C）。温度过高会导致拼豆过度融化变形，温度过低则融合不牢。建议先在少量拼豆上测试，找到合适的温度。' },
];

/* ════════════════════ MAIN PAGE ════════════════════ */
export default function Guide() {
  const [activeSection, setActiveSection] = useState('what-are');
  const [activeBrandTab, setActiveBrandTab] = useState(0);
  const [colorFilter, setColorFilter] = useState<'all' | 'standard' | 'pearl' | 'neon'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /* Scroll spy for TOC */
  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map((item) => {
        const el = document.getElementById(item.id);
        if (!el) return { id: item.id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id: item.id, top: rect.top };
      });
      const current = sections.reduce((closest, section) => {
        if (section.top > 120) return closest;
        if (section.top > sections.find((s) => s.id === closest.id)!.top) return section;
        return closest;
      }, sections[0]);
      if (current) setActiveSection(current.id);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Filter colors */
  const currentBrand = beadBrands[activeBrandTab];
  const filteredColors = currentBrand.colors.filter((c: BeadColor) => {
    const matchesCategory = colorFilter === 'all' || c.category === colorFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.hex.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative">
      {/* Sticky TOC */}
      <TableOfContents activeId={activeSection} />

      <div className="max-w-[1000px] mx-auto px-6 lg:pr-[260px]">
        {/* ═══ Section 1: Page Header ═══ */}
        <div className="text-center pt-16 pb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium text-[#FF6B9D] mb-3 tracking-wide"
          >
            拼豆指南
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
            className="text-3xl sm:text-4xl font-extrabold text-[#1A1714] mb-4 tracking-tight"
          >
            拼豆入门与颜色参考
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: easeOut }}
            className="text-[#6B6560] max-w-[600px] mx-auto leading-relaxed"
          >
            了解拼豆的基础知识、不同品牌的颜色差异，以及如何从零开始制作你的第一幅拼豆像素画。
          </motion.p>
        </div>

        {/* ═══ Section 2: What Are Perler Beads ═══ */}
        <Section id="what-are" className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
            >
              <motion.h2 variants={staggerItem} className="text-2xl font-bold text-[#1A1714] mb-6">
                什么是拼豆？
              </motion.h2>
              <motion.p variants={staggerItem} className="text-[#6B6560] leading-relaxed mb-4">
                拼豆（Perler Beads / Fuse Beads）是一种源自瑞典的DIY手工玩具。将彩色塑料小管 bead
                按照图案排列在带有尖刺的拼豆板上，再用熨斗加热使其底部融合，即可制作出各种像素风格的平面或立体作品。
              </motion.p>
              <motion.p variants={staggerItem} className="text-[#6B6560] leading-relaxed mb-4">
                拼豆的直径通常为5mm，每颗拼豆对应像素画中的一个像素点。通过不同颜色的组合，可以还原照片、游戏角色、图标等各种图案。
              </motion.p>
              <motion.p variants={staggerItem} className="text-[#6B6560] leading-relaxed">
                制作拼豆需要的材料包括：拼豆（彩色管珠）、拼豆板（带钉板）、熨斗、熨烫纸，以及一份图案指南。
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
            >
              <ProcessIllustration />
            </motion.div>
          </div>
        </Section>

        {/* Divider */}
        <div className="border-t border-[#E7DDD4]" />

        {/* ═══ Section 3: Brand Comparison ═══ */}
        <Section id="brand-compare" className="py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 variants={staggerItem} className="text-2xl font-bold text-[#1A1714] mb-8">
              主流拼豆品牌对比
            </motion.h2>
            <motion.div variants={staggerItem} className="bg-[#FFFFFF] rounded-xl border border-[#E7DDD4] overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#FFF0E0] hover:bg-[#FFF0E0]">
                      <TableHead className="font-semibold text-[#1A1714] min-w-[100px]">特性</TableHead>
                      {brandNames.map((name) => (
                        <TableHead key={name} className="font-semibold text-[#1A1714] min-w-[110px]">
                          {name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brandRows.map((row, i) => (
                      <TableRow
                        key={row.label}
                        className={`${i % 2 === 1 ? 'bg-[#F5EDE3]/50' : ''} hover:bg-[#FFE4ED]/50 transition-colors`}
                      >
                        <TableCell className="font-semibold text-[#1A1714]">{row.label}</TableCell>
                        {row.values.map((v, j) => (
                          <TableCell key={j} className="text-[#6B6560]">{v}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
            <motion.div variants={staggerItem} className="mt-6 space-y-2">
              <p className="text-sm text-[#6B6560]">
                <span className="font-medium text-[#1A1714]">Perler</span>
                {' '}是美国最经典的拼豆品牌，颜色饱和度高，尤其适合制作游戏角色和卡通图案。
              </p>
              <p className="text-sm text-[#6B6560]">
                <span className="font-medium text-[#1A1714]">Hama</span>
                {' '}是欧洲老牌，颜色整体偏柔和，适合风景和自然主题。
              </p>
              <p className="text-sm text-[#6B6560]">
                <span className="font-medium text-[#1A1714]">Artkal</span>
                {' 和 '}
                <span className="font-medium text-[#1A1714]">MARD</span>
                {' '}是国内最容易购买的品牌，颜色数量多且价格实惠，是入门的好选择。
              </p>
            </motion.div>
          </motion.div>
        </Section>

        {/* Divider */}
        <div className="border-t border-[#E7DDD4]" />

        {/* ═══ Section 4: Color Reference Tables ═══ */}
        <Section id="color-table" className="py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 variants={staggerItem} className="text-2xl font-bold text-[#1A1714] mb-8">
              拼豆颜色色号表
            </motion.h2>

            {/* Brand tabs */}
            <motion.div variants={staggerItem} className="mb-6">
              <div className="flex flex-wrap gap-2">
                {beadBrands.map((brand, i) => (
                  <button
                    key={brand.id}
                    onClick={() => { setActiveBrandTab(i); setColorFilter('all'); setSearchQuery(''); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeBrandTab === i
                        ? 'bg-[#FF6B9D] text-white shadow-sm'
                        : 'bg-[#FFFFFF] text-[#6B6560] border border-[#E7DDD4] hover:border-[#FF6B9D] hover:text-[#1A1714]'
                    }`}
                  >
                    {brand.name}
                    <span className="ml-1 text-xs opacity-70">({brand.colors.length}色)</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Category filter + Search */}
            <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {([
                  { key: 'all', label: '全部' },
                  { key: 'standard', label: '标准色' },
                  { key: 'pearl', label: '珍珠色' },
                  { key: 'neon', label: '荧光色' },
                ] as const).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setColorFilter(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      colorFilter === f.key
                        ? 'bg-[#FFE4ED] text-[#FF6B9D]'
                        : 'bg-[#F5EDE3] text-[#6B6560] hover:bg-[#E7DDD4]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="relative sm:ml-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                <input
                  type="text"
                  placeholder="搜索颜色名称或编号..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-[#FFFFFF] border border-[#E7DDD4] rounded-lg text-sm text-[#1A1714] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#FF6B9D] focus:ring-1 focus:ring-[#FF6B9D] w-full sm:w-64 transition-all"
                />
              </div>
            </motion.div>

            {/* Color grid */}
            <motion.div
              key={`${activeBrandTab}-${colorFilter}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
            >
              {filteredColors.map((color: BeadColor, i: number) => (
                <motion.div
                  key={color.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.3, ease: easeOut }}
                >
                  <ColorSwatch color={color} />
                </motion.div>
              ))}
            </motion.div>
            {filteredColors.length === 0 && (
              <div className="text-center py-12 text-[#A8A29E]">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>没有找到匹配的颜色</p>
              </div>
            )}
          </motion.div>
        </Section>

        {/* Divider */}
        <div className="border-t border-[#E7DDD4]" />

        {/* ═══ Section 5: Tutorial ═══ */}
        <Section id="tutorial" className="py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-2xl font-bold text-[#1A1714] text-center mb-12"
          >
            五步开始你的拼豆之旅
          </motion.h2>

          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-[#E7DDD4] hidden md:block" />

            <div className="space-y-8">
              {tutorialSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: easeOut }}
                    className="relative flex flex-col md:flex-row gap-4 md:gap-6 items-start"
                  >
                    {/* Step number */}
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-[#FF6B9D] text-white flex items-center justify-center font-bold text-lg shadow-md hidden md:flex">
                      {i + 1}
                    </div>
                    <div className="md:hidden flex-shrink-0 w-10 h-10 rounded-full bg-[#FF6B9D] text-white flex items-center justify-center font-bold shadow-md">
                      {i + 1}
                    </div>

                    {/* Content card */}
                    <div className="flex-1 bg-[#FFFFFF] rounded-xl border border-[#E7DDD4] p-6 hover:shadow-card-hover transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-5 h-5 text-[#FF6B9D]" />
                        <h3 className="text-lg font-semibold text-[#1A1714]">{step.title}</h3>
                      </div>
                      <p className="text-[#6B6560] text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Divider */}
        <div className="border-t border-[#E7DDD4]" />

        {/* ═══ Section 6: Tips & Tricks ═══ */}
        <Section id="tips" className="py-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-2xl font-bold text-[#1A1714] mb-8"
          >
            制作技巧
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                className="bg-[#FFFFFF] rounded-xl border border-[#E7DDD4] p-6 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-[#FFB347]" />
                  <span className="text-xs font-medium text-[#FF6B9D] bg-[#FFE4ED] px-2 py-0.5 rounded-full">
                    技巧 {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#1A1714] mb-2">{tip.title}</h3>
                <p className="text-sm text-[#6B6560] leading-relaxed">{tip.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* Divider */}
        <div className="border-t border-[#E7DDD4]" />

        {/* ═══ Section 7: FAQ ═══ */}
        <Section id="faq" className="py-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-2xl font-bold text-[#1A1714] text-center mb-8"
          >
            常见问题
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="max-w-[800px] mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqData.map((faq, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <AccordionItem
                    value={`faq-${i}`}
                    className="bg-[#FFFFFF] rounded-xl border border-[#E7DDD4] px-5 data-[state=open]:shadow-sm"
                  >
                    <AccordionTrigger className="text-[#1A1714] font-semibold text-sm py-4 hover:no-underline [&>svg]:text-[#A8A29E]">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#6B6560] text-sm leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </Section>

        {/* ═══ Section 8: Back to Tool CTA ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="py-16 text-center"
        >
          {/* Floating beads decoration */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {['#F01820', '#ED6120', '#ECD800', '#4FAD42', '#3370C0', '#604089', '#F6B3DD', '#FF6B9D'].map(
              (color, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2,
                  }}
                  className="rounded-full shadow-sm"
                  style={{
                    backgroundColor: color,
                    width: 20 + (i % 3) * 8,
                    height: 20 + (i % 3) * 8,
                  }}
                />
              )
            )}
          </div>

          <h2 className="text-2xl font-bold text-[#1A1714] mb-3">准备好开始了吗？</h2>
          <p className="text-[#6B6560] max-w-[480px] mx-auto mb-8 leading-relaxed">
            打开拼豆转换工具，上传你的第一张图片，开始制作属于你的拼豆像素画吧！
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 h-14 px-12 bg-[#FF6B9D] text-white font-medium rounded-xl hover:bg-[#FF4D8A] hover:scale-[1.03] transition-all shadow-md hover:shadow-lg"
          >
            前往转换工具
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
