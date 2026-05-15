import { FileImage, FileText, List } from 'lucide-react';
import type { ConversionResult } from '@/lib/pixelUtils';

interface ExportPanelProps {
  result: ConversionResult | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function ExportPanel({ result, canvasRef }: ExportPanelProps) {
  if (!result) return null;

  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = '拼豆像素画.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportCSV = () => {
    if (!result) return;
    const headers = '编号,颜色名称,品牌编号,HEX,数量,百分比\n';
    const rows = result.statistics
      .map(
        (s) =>
          `${s.letter},${s.color.name},${s.color.code},${s.color.hex},${s.count},${s.percentage.toFixed(1)}%`
      )
      .join('\n');
    const total = result.statistics.reduce((sum, s) => sum + s.count, 0);
    const csv = headers + rows + `\n总计,,,,${total},100%`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '拼豆颜色清单.csv';
    link.click();
  };

  const exportPDF = async () => {
    // Dynamic import to avoid bundling issues
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Page 1: Title + Preview
    pdf.setFontSize(20);
    pdf.text('拼豆工坊 - 制作指南', pageWidth / 2, 20, { align: 'center' });

    pdf.setFontSize(10);
    pdf.text(`网格尺寸: ${result.width} x ${result.height}`, 15, 30);
    pdf.text(`颜色数量: ${result.statistics.length} 种`, 15, 35);
    pdf.text(`总拼豆数: ${result.statistics.reduce((s, st) => s + st.count, 0)} 颗`, 15, 40);

    // Add canvas image if available
    const canvas = canvasRef.current;
    if (canvas) {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 30;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      const scaledHeight = Math.min(imgHeight, 100);
      const scaledWidth = (canvas.width / canvas.height) * scaledHeight;
      const xOffset = (pageWidth - scaledWidth) / 2;
      pdf.addImage(imgData, 'PNG', xOffset, 45, scaledWidth, scaledHeight);
    }

    // Page 2: Color chart
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('颜色对照表', pageWidth / 2, 15, { align: 'center' });

    let y = 25;
    const colX = [15, 45, 85, 130, 170];
    pdf.setFontSize(9);
    pdf.text('编号', colX[0], y);
    pdf.text('颜色', colX[1], y);
    pdf.text('名称/编号', colX[2], y);
    pdf.text('数量', colX[3], y);
    pdf.text('占比', colX[4], y);
    y += 2;
    pdf.line(15, y, pageWidth - 15, y);
    y += 6;

    for (const stat of result.statistics) {
      if (y > pageHeight - 15) {
        pdf.addPage();
        y = 15;
      }
      pdf.text(stat.letter, colX[0], y);
      // Color swatch as filled rect
      pdf.setFillColor(parseInt(stat.color.hex.slice(1, 3), 16), parseInt(stat.color.hex.slice(3, 5), 16), parseInt(stat.color.hex.slice(5, 7), 16));
      pdf.rect(colX[1], y - 3, 6, 4, 'F');
      pdf.text(`${stat.color.name} (${stat.color.code})`, colX[1] + 10, y);
      pdf.text(`${stat.count}`, colX[3], y);
      pdf.text(`${stat.percentage.toFixed(1)}%`, colX[4], y);
      y += 7;
    }

    // Page 3+: Grid pages with encoding
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('拼豆网格图', pageWidth / 2, 15, { align: 'center' });

    const cellSize = Math.min((pageWidth - 30) / result.width, (pageHeight - 30) / result.height, 8);
    const gridOffsetX = (pageWidth - cellSize * result.width) / 2;
    const gridOffsetY = 25;

    pdf.setFontSize(Math.max(4, cellSize * 0.5));
    for (let y = 0; y < result.height; y++) {
      for (let x = 0; x < result.width; x++) {
        const letter = result.grid[y][x];
        const stat = result.statistics.find((s) => s.letter === letter);
        if (stat) {
          pdf.setFillColor(parseInt(stat.color.hex.slice(1, 3), 16), parseInt(stat.color.hex.slice(3, 5), 16), parseInt(stat.color.hex.slice(5, 7), 16));
          pdf.rect(gridOffsetX + x * cellSize, gridOffsetY + y * cellSize, cellSize, cellSize, 'F');
          pdf.setTextColor(0, 0, 0);
          pdf.text(letter, gridOffsetX + x * cellSize + cellSize / 2, gridOffsetY + y * cellSize + cellSize / 2 + 1, { align: 'center' });
        }
      }
    }

    pdf.save('拼豆制作指南.pdf');
  };

  return (
    <div className="bg-bg-surface border border-border-custom rounded-xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">导出你的拼豆图纸</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={exportPNG}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-medium rounded-xl transition-all hover:scale-[1.02]"
        >
          <FileImage size={16} />
          导出 PNG 网格图
        </button>
        <button
          onClick={exportPDF}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-surface hover:bg-bg-warm text-text-primary text-sm font-medium rounded-xl border border-border-custom transition-all hover:scale-[1.02]"
        >
          <FileText size={16} />
          导出 PDF 制作指南
        </button>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-surface hover:bg-bg-warm text-text-primary text-sm font-medium rounded-xl border border-border-custom transition-all hover:scale-[1.02]"
        >
          <List size={16} />
          导出颜色清单
        </button>
      </div>
    </div>
  );
}
