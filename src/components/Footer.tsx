import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1 - Logo */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="grid grid-cols-3 gap-[2px]">
                {['#F1F1F1', '#2E2F32', '#F01820', '#3370C0', '#ECD800', '#1C753E', '#ED6120', '#604089', '#F6B3DD'].map(
                  (color, i) => (
                    <div key={i} className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: color }} />
                  )
                )}
              </div>
              <span className="text-base font-bold text-[#FFF8F0]">拼豆工坊</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              把照片变成拼豆像素画
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#FFF8F0] mb-4">快速链接</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: '工具首页' },
                { to: '/gallery', label: '示例画廊' },
                { to: '/guide', label: '颜色指南' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-text-muted hover:text-[#FFF8F0] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - About */}
          <div>
            <h4 className="text-sm font-semibold text-[#FFF8F0] mb-4">关于</h4>
            <ul className="space-y-2.5">
              {['关于拼豆', '常见问题', '联系我们'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-text-muted hover:text-[#FFF8F0] transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-text-muted">
            &copy; 2025 拼豆工坊 Pixel Bead Studio
          </p>
          <p className="text-xs text-text-muted">Made with beads</p>
        </div>
      </div>
    </footer>
  );
}
