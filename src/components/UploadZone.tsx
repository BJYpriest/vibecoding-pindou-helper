import { useCallback, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface UploadZoneProps {
  onImageLoad: (image: HTMLImageElement, file: File) => void;
  loadedImage: HTMLImageElement | null;
  fileName: string;
  onClear: () => void;
}

export default function UploadZone({ onImageLoad, loadedImage, fileName, onClear }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.match(/image\/(png|jpeg|jpg|webp)/)) {
        alert('请上传 PNG、JPG 或 WebP 格式的图片');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过 10MB');
        return;
      }
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          onImageLoad(img, file);
          setIsLoading(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [onImageLoad]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClick = () => inputRef.current?.click();

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="bg-bg-surface border border-border-custom rounded-xl p-8 md:p-12">
        {!loadedImage ? (
          <div
            onClick={handleClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`relative min-h-[320px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-brand-primary bg-brand-primary-light scale-[1.01]'
                : 'border-border-custom bg-bg-warm hover:border-border-hover'
            }`}
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                  {['#FF6B9D', '#FFB347', '#4ADE80', '#60A5FA'].map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full animate-bounce"
                      style={{
                        backgroundColor: color,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-text-secondary">正在读取图片...</p>
              </div>
            ) : (
              <>
                <Upload
                  size={64}
                  className={`mb-4 transition-all duration-200 ${
                    isDragging ? 'text-brand-primary scale-110' : 'text-text-muted'
                  }`}
                />
                <h3
                  className={`text-lg font-semibold mb-1 transition-colors ${
                    isDragging ? 'text-brand-primary' : 'text-text-primary'
                  }`}
                >
                  拖拽图片到此处
                </h3>
                <p className="text-sm text-text-secondary mb-3">或点击选择文件</p>
                <p className="text-xs text-text-muted">
                  支持 PNG、JPG 格式，最大 10MB
                </p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={onInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-400">
            <div className="relative">
              <img
                src={loadedImage.src}
                alt="Uploaded"
                className="max-h-[400px] object-contain rounded-lg border border-border-custom"
              />
              <button
                onClick={onClear}
                className="absolute -top-2 -right-2 w-7 h-7 bg-bg-surface border border-border-custom rounded-full flex items-center justify-center hover:bg-brand-primary-light hover:border-brand-primary transition-colors shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-sm text-text-secondary">
              {fileName} · {loadedImage.naturalWidth}×{loadedImage.naturalHeight}px
            </p>
            <button
              onClick={handleClick}
              className="text-sm text-brand-primary hover:text-brand-primary-hover font-medium transition-colors"
            >
              更换图片
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={onInputChange}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
}
