export type GalleryCategory = 'animal' | 'character' | 'landscape' | 'geometric' | 'food';

export interface ExampleColor {
  code: string;
  name: string;
  hex: string;
  count: number;
}

export interface GalleryExample {
  id: string;
  title: string;
  category: GalleryCategory;
  categoryLabel: string;
  brandId: string;
  brandName: string;
  gridWidth: number;
  gridHeight: number;
  colorCount: number;
  beadCount: number;
  difficulty: 1 | 2 | 3;
  description: string;
  colors: ExampleColor[];
  // CSS gradient definition for the "pixel art" preview image
  pixelArtCss: string;
  // CSS gradient definition for the "original" photo preview
  originalCss: string;
}

// --- Pixel art patterns defined as CSS gradients ---
// Each pattern simulates a pixel-art image using a grid of colored squares

// Cat (29x29 grid, simplified pattern)
const cat29Colors = [
  { code: 'P18', name: '黑色', hex: '#2E2F32', count: 45 },
  { code: 'P04', name: '橙色', hex: '#ED6120', count: 120 },
  { code: 'P35', name: '棕褐色', hex: '#BC9371', count: 80 },
  { code: 'P33', name: '桃色', hex: '#EEBAB2', count: 60 },
  { code: 'P03', name: '黄色', hex: '#ECD800', count: 16 },
  { code: 'P01', name: '白色', hex: '#F1F1F1', count: 30 },
  { code: 'P79', name: '浅粉', hex: '#F6B3DD', count: 12 },
  { code: 'P83', name: '粉红', hex: '#E44892', count: 8 },
];

// Mario (29x29)
const marioColors = [
  { code: 'P05', name: '红色', hex: '#F01820', count: 85 },
  { code: 'P18', name: '黑色', hex: '#2E2F32', count: 40 },
  { code: 'P35', name: '棕褐色', hex: '#BC9371', count: 55 },
  { code: 'P33', name: '桃色', hex: '#EEBAB2', count: 70 },
  { code: 'P04', name: '橙色', hex: '#ED6120', count: 30 },
  { code: 'P09', name: '浅蓝', hex: '#3370C0', count: 60 },
  { code: 'P85', name: '金色', hex: '#BB7634', count: 20 },
  { code: 'P02', name: '奶油/米色', hex: '#E0DEA9', count: 35 },
  { code: 'P12', name: '棕色', hex: '#513931', count: 15 },
  { code: 'P61', name: '猕猴桃绿', hex: '#6CBE13', count: 8 },
  { code: 'P57', name: '切达黄', hex: '#F1AA0C', count: 12 },
  { code: 'P01', name: '白色', hex: '#F1F1F1', count: 50 },
];

// Sunset (40x40)
const sunsetColors = [
  { code: 'P04', name: '橙色', hex: '#ED6120', count: 180 },
  { code: 'P05', name: '红色', hex: '#F01820', count: 120 },
  { code: 'P90', name: '奶油糖', hex: '#D48437', count: 200 },
  { code: 'P03', name: '黄色', hex: '#ECD800', count: 90 },
  { code: 'P18', name: '黑色', hex: '#2E2F32', count: 260 },
  { code: 'P93', name: '蓝莓奶油', hex: '#8297D9', count: 80 },
  { code: 'P08', name: '深蓝', hex: '#2B3F87', count: 150 },
  { code: 'P54', name: '淡薰衣草', hex: '#8A72C1', count: 60 },
  { code: 'P52', name: '淡蓝', hex: '#5390D1', count: 100 },
  { code: 'P70', name: '长春花蓝', hex: '#647CBE', count: 60 },
];

// Heart (29x29)
const heartColors = [
  { code: 'P05', name: '红色', hex: '#F01820', count: 280 },
  { code: 'P96', name: '蔓越莓', hex: '#801922', count: 120 },
  { code: 'P88', name: '覆盆子', hex: '#A53061', count: 80 },
  { code: 'P38', name: '洋红', hex: '#F22A7B', count: 191 },
];

// Star (29x29)
const starColors = [
  { code: 'P03', name: '黄色', hex: '#ECD800', count: 220 },
  { code: 'P56', name: '淡黄', hex: '#FEF875', count: 100 },
  { code: 'P57', name: '切达黄', hex: '#F1AA0C', count: 80 },
  { code: 'P08', name: '深蓝', hex: '#2B3F87', count: 321 },
  { code: 'P70', name: '长春花蓝', hex: '#647CBE', count: 140 },
  { code: 'P09', name: '浅蓝', hex: '#3370C0', count: 100 },
];

// Shiba dog (29x29)
const shibaColors = [
  { code: 'P04', name: '橙色', hex: '#ED6120', count: 110 },
  { code: 'P18', name: '黑色', hex: '#2E2F32', count: 55 },
  { code: 'P33', name: '桃色', hex: '#EEBAB2', count: 90 },
  { code: 'P01', name: '白色', hex: '#F1F1F1', count: 130 },
  { code: 'P35', name: '棕褐色', hex: '#BC9371', count: 75 },
  { code: 'P12', name: '棕色', hex: '#513931', count: 45 },
  { code: 'P03', name: '黄色', hex: '#ECD800', count: 20 },
  { code: 'P79', name: '浅粉', hex: '#F6B3DD', count: 25 },
  { code: 'P21', name: '浅棕', hex: '#815D34', count: 40 },
  { code: 'P98', name: '沙色', hex: '#E4B690', count: 85 },
  { code: 'P63', name: '腮红', hex: '#FF8285', count: 20 },
];

// Cherry blossom tree (40x40)
const sakuraColors = [
  { code: 'P79', name: '浅粉', hex: '#F6B3DD', count: 320 },
  { code: 'P83', name: '粉红', hex: '#E44892', count: 180 },
  { code: 'P06', name: '泡泡糖', hex: '#DD669B', count: 120 },
  { code: 'P54', name: '淡薰衣草', hex: '#8A72C1', count: 80 },
  { code: 'P18', name: '黑色', hex: '#2E2F32', count: 150 },
  { code: 'P12', name: '棕色', hex: '#513931', count: 90 },
  { code: 'P80', name: '亮绿', hex: '#4FAD42', count: 100 },
  { code: 'P10', name: '深绿', hex: '#1C753E', count: 70 },
  { code: 'P01', name: '白色', hex: '#F1F1F1', count: 130 },
  { code: 'P33', name: '桃色', hex: '#EEBAB2', count: 60 },
  { code: 'P82', name: '薰衣草', hex: '#AD98D4', count: 50 },
  { code: 'P104', name: '珍珠浅粉', hex: '#D7A8A2', count: 70 },
  { code: 'P60', name: '梅子', hex: '#A24B9C', count: 40 },
  { code: 'P21', name: '浅棕', hex: '#815D34', count: 65 },
];

// Rainbow (29x29)
const rainbowColors = [
  { code: 'P05', name: '红色', hex: '#F01820', count: 58 },
  { code: 'P04', name: '橙色', hex: '#ED6120', count: 58 },
  { code: 'P03', name: '黄色', hex: '#ECD800', count: 58 },
  { code: 'P80', name: '亮绿', hex: '#4FAD42', count: 58 },
  { code: 'P09', name: '浅蓝', hex: '#3370C0', count: 58 },
  { code: 'P07', name: '紫色', hex: '#604089', count: 58 },
  { code: 'P01', name: '白色', hex: '#F1F1F1', count: 505 },
];

// Astronaut (40x40)
const astronautColors = [
  { code: 'P18', name: '黑色', hex: '#2E2F32', count: 380 },
  { code: 'P01', name: '白色', hex: '#F1F1F1', count: 450 },
  { code: 'P17', name: '灰色', hex: '#8A8D91', count: 120 },
  { code: 'P09', name: '浅蓝', hex: '#3370C0', count: 80 },
  { code: 'P52', name: '淡蓝', hex: '#5390D1', count: 60 },
  { code: 'P58', name: '牙膏色', hex: '#93C8D4', count: 70 },
  { code: 'P92', name: '深灰色', hex: '#4D5156', count: 90 },
  { code: 'P79', name: '浅粉', hex: '#F6B3DD', count: 40 },
  { code: 'P83', name: '粉红', hex: '#E44892', count: 30 },
  { code: 'P54', name: '淡薰衣草', hex: '#8A72C1', count: 50 },
  { code: 'P93', name: '蓝莓奶油', hex: '#8297D9', count: 45 },
  { code: 'P70', name: '长春花蓝', hex: '#647CBE', count: 40 },
  { code: 'P05', name: '红色', hex: '#F01820', count: 15 },
  { code: 'P04', name: '橙色', hex: '#ED6120', count: 20 },
  { code: 'P03', name: '黄色', hex: '#ECD800', count: 25 },
  { code: 'P11', name: '浅绿', hex: '#56BA9F', count: 15 },
];

// Cactus (29x29)
const cactusColors = [
  { code: 'P80', name: '亮绿', hex: '#4FAD42', count: 180 },
  { code: 'P10', name: '深绿', hex: '#1C753E', count: 120 },
  { code: 'P98', name: '沙色', hex: '#E4B690', count: 200 },
  { code: 'P90', name: '奶油糖', hex: '#D48437', count: 80 },
  { code: 'P85', name: '金色', hex: '#BB7634', count: 25 },
];

// Penguin (29x29)
const penguinColors = [
  { code: 'P18', name: '黑色', hex: '#2E2F32', count: 200 },
  { code: 'P01', name: '白色', hex: '#F1F1F1', count: 280 },
  { code: 'P09', name: '浅蓝', hex: '#3370C0', count: 120 },
  { code: 'P04', name: '橙色', hex: '#ED6120', count: 60 },
  { code: 'P57', name: '切达黄', hex: '#F1AA0C', count: 30 },
  { code: 'P79', name: '浅粉', hex: '#F6B3DD', count: 20 },
  { code: 'P58', name: '牙膏色', hex: '#93C8D4', count: 50 },
  { code: 'P92', name: '深灰色', hex: '#4D5156', count: 40 },
  { code: 'P33', name: '桃色', hex: '#EEBAB2', count: 30 },
];

// Castle (58x58)
const castleColors = [
  { code: 'P79', name: '浅粉', hex: '#F6B3DD', count: 580 },
  { code: 'P83', name: '粉红', hex: '#E44892', count: 280 },
  { code: 'P06', name: '泡泡糖', hex: '#DD669B', count: 160 },
  { code: 'P18', name: '黑色', hex: '#2E2F32', count: 340 },
  { code: 'P01', name: '白色', hex: '#F1F1F1', count: 420 },
  { code: 'P17', name: '灰色', hex: '#8A8D91', count: 200 },
  { code: 'P54', name: '淡薰衣草', hex: '#8A72C1', count: 120 },
  { code: 'P82', name: '薰衣草', hex: '#AD98D4', count: 100 },
  { code: 'P93', name: '蓝莓奶油', hex: '#8297D9', count: 140 },
  { code: 'P52', name: '淡蓝', hex: '#5390D1', count: 90 },
  { code: 'P04', name: '橙色', hex: '#ED6120', count: 60 },
  { code: 'P90', name: '奶油糖', hex: '#D48437', count: 80 },
  { code: 'P85', name: '金色', hex: '#BB7634', count: 100 },
  { code: 'P03', name: '黄色', hex: '#ECD800', count: 70 },
  { code: 'P57', name: '切达黄', hex: '#F1AA0C', count: 50 },
  { code: 'P33', name: '桃色', hex: '#EEBAB2', count: 40 },
  { code: 'P12', name: '棕色', hex: '#513931', count: 60 },
  { code: 'P21', name: '浅棕', hex: '#815D34', count: 50 },
];

// Music note (29x29)
const musicColors = [
  { code: 'P18', name: '黑色', hex: '#2E2F32', count: 180 },
  { code: 'P05', name: '红色', hex: '#F01820', count: 120 },
  { code: 'P07', name: '紫色', hex: '#604089', count: 80 },
  { code: 'P83', name: '粉红', hex: '#E44892', count: 80 },
];

// Unicorn (40x40)
const unicornColors = [
  { code: 'P01', name: '白色', hex: '#F1F1F1', count: 380 },
  { code: 'P79', name: '浅粉', hex: '#F6B3DD', count: 180 },
  { code: 'P83', name: '粉红', hex: '#E44892', count: 120 },
  { code: 'P54', name: '淡薰衣草', hex: '#8A72C1', count: 100 },
  { code: 'P82', name: '薰衣草', hex: '#AD98D4', count: 80 },
  { code: 'P09', name: '浅蓝', hex: '#3370C0', count: 90 },
  { code: 'P52', name: '淡蓝', hex: '#5390D1', count: 70 },
  { code: 'P58', name: '牙膏色', hex: '#93C8D4', count: 60 },
  { code: 'P80', name: '亮绿', hex: '#4FAD42', count: 50 },
  { code: 'P53', name: '淡绿', hex: '#76C882', count: 40 },
  { code: 'P03', name: '黄色', hex: '#ECD800', count: 50 },
  { code: 'P56', name: '淡黄', hex: '#FEF875', count: 40 },
  { code: 'P57', name: '切达黄', hex: '#F1AA0C', count: 30 },
  { code: 'P04', name: '橙色', hex: '#ED6120', count: 40 },
  { code: 'P06', name: '泡泡糖', hex: '#DD669B', count: 60 },
];

// Snowman (29x29)
const snowmanColors = [
  { code: 'P01', name: '白色', hex: '#F1F1F1', count: 350 },
  { code: 'P18', name: '黑色', hex: '#2E2F32', count: 55 },
  { code: 'P04', name: '橙色', hex: '#ED6120', count: 30 },
  { code: 'P09', name: '浅蓝', hex: '#3370C0', count: 80 },
  { code: 'P58', name: '牙膏色', hex: '#93C8D4', count: 120 },
  { code: 'P52', name: '淡蓝', hex: '#5390D1', count: 70 },
  { code: 'P82', name: '薰衣草', hex: '#AD98D4', count: 40 },
  { code: 'P17', name: '灰色', hex: '#8A8D91', count: 50 },
  { code: 'P05', name: '红色', hex: '#F01820', count: 60 },
  { code: 'P96', name: '蔓越莓', hex: '#801922', count: 25 },
];

// --- Gradient definitions for original photo previews ---
const catOriginal = 'linear-gradient(135deg, #F5EDE3 0%, #E8DDD0 40%, #D4C4B0 100%)';
const marioOriginal = 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)';
const sunsetOriginal = 'linear-gradient(180deg, #F01820 0%, #ED6120 25%, #ECD800 50%, #93C5FD 75%, #2B3F87 100%)';
const heartOriginal = 'linear-gradient(135deg, #FFE4ED 0%, #FBCFE8 50%, #F9A8D4 100%)';
const starOriginal = 'linear-gradient(135deg, #1E3A5F 0%, #2B3F87 50%, #1E2D5C 100%)';
const shibaOriginal = 'linear-gradient(135deg, #E8DDD0 0%, #D4C4B0 50%, #C4A882 100%)';
const sakuraOriginal = 'linear-gradient(180deg, #F6B3DD 0%, #FBCFE8 30%, #FFF8F0 60%, #4FAD42 80%, #1C753E 100%)';
const rainbowOriginal = 'linear-gradient(180deg, #FFF8F0 0%, #F1F1F1 40%, #DBEAFE 100%)';
const astronautOriginal = 'linear-gradient(180deg, #0A0A1A 0%, #1A1A2E 40%, #16213E 70%, #0F3460 100%)';
const cactusOriginal = 'linear-gradient(180deg, #FFF0D4 0%, #E8DDD0 50%, #D4C4B0 100%)';
const penguinOriginal = 'linear-gradient(180deg, #93C5FD 0%, #BFDBFE 40%, #DBEAFE 70%, #F1F1F1 100%)';
const castleOriginal = 'linear-gradient(135deg, #FFE4ED 0%, #FBCFE8 30%, #E9D5FF 70%, #DDD6FE 100%)';
const musicOriginal = 'linear-gradient(135deg, #FFE4ED 0%, #FBCFE8 50%, #DBEAFE 100%)';
const unicornOriginal = 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 30%, #FCE7F3 60%, #F3E8FF 100%)';
const snowmanOriginal = 'linear-gradient(180deg, #DBEAFE 0%, #BFDBFE 30%, #EFF6FF 60%, #F1F1F1 100%)';

// --- Pixel art CSS pattern helper ---
function makePixelGradient(colors: ExampleColor[]): string {
  const hexes = colors.map((c) => c.hex);
  // Create a diagonal banded pattern
  const steps = hexes.map((h, i) => `${h} ${i * (100 / hexes.length)}%, ${h} ${(i + 1) * (100 / hexes.length)}%`).join(', ');
  return `linear-gradient(135deg, ${steps})`;
}

export const galleryExamples: GalleryExample[] = [
  {
    id: 'cat-001',
    title: '小猫咪',
    category: 'animal',
    categoryLabel: '动物',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 29,
    gridHeight: 29,
    colorCount: 8,
    beadCount: 473,
    difficulty: 1,
    description: '可爱橘猫头像，适合新手',
    colors: cat29Colors,
    pixelArtCss: makePixelGradient(cat29Colors),
    originalCss: catOriginal,
  },
  {
    id: 'mario-001',
    title: '像素马里奥',
    category: 'character',
    categoryLabel: '角色',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 29,
    gridHeight: 29,
    colorCount: 12,
    beadCount: 573,
    difficulty: 2,
    description: '经典游戏角色全身像',
    colors: marioColors,
    pixelArtCss: makePixelGradient(marioColors),
    originalCss: marioOriginal,
  },
  {
    id: 'sunset-001',
    title: '海边夕阳',
    category: 'landscape',
    categoryLabel: '风景',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 40,
    gridHeight: 40,
    colorCount: 10,
    beadCount: 1320,
    difficulty: 2,
    description: '橙红色渐变天空与海面',
    colors: sunsetColors,
    pixelArtCss: makePixelGradient(sunsetColors),
    originalCss: sunsetOriginal,
  },
  {
    id: 'heart-001',
    title: '爱心图案',
    category: 'geometric',
    categoryLabel: '几何',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 29,
    gridHeight: 29,
    colorCount: 4,
    beadCount: 671,
    difficulty: 1,
    description: '经典红色爱心，4色极简',
    colors: heartColors,
    pixelArtCss: makePixelGradient(heartColors),
    originalCss: heartOriginal,
  },
  {
    id: 'star-001',
    title: '闪亮星星',
    category: 'geometric',
    categoryLabel: '几何',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 29,
    gridHeight: 29,
    colorCount: 6,
    beadCount: 961,
    difficulty: 1,
    description: '黄色星星与蓝色背景',
    colors: starColors,
    pixelArtCss: makePixelGradient(starColors),
    originalCss: starOriginal,
  },
  {
    id: 'shiba-001',
    title: '小柴犬',
    category: 'animal',
    categoryLabel: '动物',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 29,
    gridHeight: 29,
    colorCount: 11,
    beadCount: 710,
    difficulty: 2,
    description: '柴犬表情特写',
    colors: shibaColors,
    pixelArtCss: makePixelGradient(shibaColors),
    originalCss: shibaOriginal,
  },
  {
    id: 'sakura-001',
    title: '樱花树',
    category: 'landscape',
    categoryLabel: '风景',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 40,
    gridHeight: 40,
    colorCount: 14,
    beadCount: 1525,
    difficulty: 2,
    description: '粉色樱花与传统日式建筑',
    colors: sakuraColors,
    pixelArtCss: makePixelGradient(sakuraColors),
    originalCss: sakuraOriginal,
  },
  {
    id: 'rainbow-001',
    title: '彩虹',
    category: 'geometric',
    categoryLabel: '几何',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 29,
    gridHeight: 29,
    colorCount: 7,
    beadCount: 853,
    difficulty: 1,
    description: '七色彩虹与白云',
    colors: rainbowColors,
    pixelArtCss: makePixelGradient(rainbowColors),
    originalCss: rainbowOriginal,
  },
  {
    id: 'astronaut-001',
    title: '太空人',
    category: 'character',
    categoryLabel: '角色',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 40,
    gridHeight: 40,
    colorCount: 16,
    beadCount: 1550,
    difficulty: 3,
    description: '宇航员与星空背景',
    colors: astronautColors,
    pixelArtCss: makePixelGradient(astronautColors),
    originalCss: astronautOriginal,
  },
  {
    id: 'cactus-001',
    title: '仙人掌',
    category: 'landscape',
    categoryLabel: '风景',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 29,
    gridHeight: 29,
    colorCount: 5,
    beadCount: 605,
    difficulty: 1,
    description: '绿色仙人掌与沙漠',
    colors: cactusColors,
    pixelArtCss: makePixelGradient(cactusColors),
    originalCss: cactusOriginal,
  },
  {
    id: 'penguin-001',
    title: '企鹅',
    category: 'animal',
    categoryLabel: '动物',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 29,
    gridHeight: 29,
    colorCount: 9,
    beadCount: 930,
    difficulty: 2,
    description: '可爱企鹅立绘',
    colors: penguinColors,
    pixelArtCss: makePixelGradient(penguinColors),
    originalCss: penguinOriginal,
  },
  {
    id: 'castle-001',
    title: '城堡',
    category: 'landscape',
    categoryLabel: '风景',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 58,
    gridHeight: 58,
    colorCount: 18,
    beadCount: 2610,
    difficulty: 3,
    description: '粉色童话城堡',
    colors: castleColors,
    pixelArtCss: makePixelGradient(castleColors),
    originalCss: castleOriginal,
  },
  {
    id: 'music-001',
    title: '音符',
    category: 'geometric',
    categoryLabel: '几何',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 29,
    gridHeight: 29,
    colorCount: 4,
    beadCount: 460,
    difficulty: 1,
    description: '黑色音符图案',
    colors: musicColors,
    pixelArtCss: makePixelGradient(musicColors),
    originalCss: musicOriginal,
  },
  {
    id: 'unicorn-001',
    title: '独角兽',
    category: 'animal',
    categoryLabel: '动物',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 40,
    gridHeight: 40,
    colorCount: 15,
    beadCount: 1330,
    difficulty: 3,
    description: '彩色独角兽全身',
    colors: unicornColors,
    pixelArtCss: makePixelGradient(unicornColors),
    originalCss: unicornOriginal,
  },
  {
    id: 'snowman-001',
    title: '雪人',
    category: 'character',
    categoryLabel: '角色',
    brandId: 'perler_57',
    brandName: 'Perler',
    gridWidth: 29,
    gridHeight: 29,
    colorCount: 10,
    beadCount: 880,
    difficulty: 2,
    description: '冬日雪人场景',
    colors: snowmanColors,
    pixelArtCss: makePixelGradient(snowmanColors),
    originalCss: snowmanOriginal,
  },
];

export const categoryFilters: { key: string; label: string; category?: GalleryCategory }[] = [
  { key: 'all', label: '全部' },
  { key: 'animal', label: '动物', category: 'animal' },
  { key: 'character', label: '角色', category: 'character' },
  { key: 'landscape', label: '风景', category: 'landscape' },
  { key: 'geometric', label: '几何', category: 'geometric' },
];

export const sortOptions: { key: string; label: string }[] = [
  { key: 'newest', label: '最新添加' },
  { key: 'colors-asc', label: '颜色最少' },
  { key: 'popular', label: '最受欢迎' },
];

export function getDifficultyLabel(difficulty: 1 | 2 | 3): string {
  return ['\u7B80\u5355', '\u4E2D\u7B49', '\u56F0\u96BE'][difficulty - 1];
}

export function getDifficultyStars(difficulty: 1 | 2 | 3): string {
  return '\u2606'.repeat(difficulty);
}

export function filterExamples(
  examples: GalleryExample[],
  category: string,
  sortKey: string
): GalleryExample[] {
  let filtered = [...examples];

  if (category !== 'all') {
    filtered = filtered.filter((e) => e.category === category);
  }

  switch (sortKey) {
    case 'colors-asc':
      filtered.sort((a, b) => a.colorCount - b.colorCount);
      break;
    case 'popular':
      // Sort by bead count as a proxy for popularity
      filtered.sort((a, b) => b.beadCount - a.beadCount);
      break;
    case 'newest':
    default:
      // Default order (by id)
      break;
  }

  return filtered;
}
