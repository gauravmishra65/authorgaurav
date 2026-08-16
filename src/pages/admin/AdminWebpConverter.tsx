import { useCallback, useRef, useState } from 'react';

interface ConvertedImage {
  id: string;
  originalName: string;
  originalSize: number;
  webpSize: number;
  url: string;
  downloadName: string;
  width: number;
  height: number;
}

const DEFAULT_QUALITY = 82;

function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

async function convertFileToWebp(file: File, quality: number, maxWidth: number | null): Promise<ConvertedImage> {
  const bitmap = await createImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;
  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser cannot draw to a canvas, so conversion is unavailable here.');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality / 100));
  if (!blob) throw new Error('This browser could not produce a WebP file. Try Chrome or Edge instead.');

  return {
    id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    originalName: file.name,
    originalSize: file.size,
    webpSize: blob.size,
    url: URL.createObjectURL(blob),
    downloadName: file.name.replace(/\.(png|jpe?g)$/i, '') + '.webp',
    width,
    height,
  };
}

export default function AdminWebpConverter() {
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [maxWidth, setMaxWidth] = useState('');
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter((f) => /^image\/(png|jpeg)$/.test(f.type));
    if (files.length === 0) {
      setError('Choose PNG or JPEG files — other formats are not supported here.');
      return;
    }
    setProcessing(true);
    setError(null);
    const width = maxWidth ? Number(maxWidth) : null;
    try {
      const results: ConvertedImage[] = [];
      for (const file of files) {
        results.push(await convertFileToWebp(file, quality, width && width > 0 ? width : null));
      }
      setImages((prev) => [...results, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed.');
    } finally {
      setProcessing(false);
    }
  }, [quality, maxWidth]);

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-2">WebP Converter</h1>
      <p className="text-sm text-muted mb-6 max-w-2xl">
        Converts PNG/JPEG files to WebP right here in your browser — nothing is uploaded anywhere. Once a file is
        converted, download it and add it to the site the same way as any other image: GitHub's "Add files via
        upload" into the matching <code className="text-2xs">public/images/…</code> folder, then enter that path in
        the relevant admin page (Books, Reader Photos, etc).
      </p>

      <div className="rounded-md border border-gold/20 bg-ivory p-6 mb-6">
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <label className="block">
            <span className="label-caps text-muted block mb-1.5 text-2xs">Quality ({quality})</span>
            <input
              type="range"
              min={40}
              max={95}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </label>
          <label className="block">
            <span className="label-caps text-muted block mb-1.5 text-2xs">Max width in px (optional — leave blank to keep original size)</span>
            <input
              type="number"
              min={1}
              value={maxWidth}
              onChange={(e) => setMaxWidth(e.target.value)}
              placeholder="e.g. 960"
              className="input"
            />
          </label>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`rounded-md border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-gold bg-gold/5' : 'border-gold/30 hover:border-gold/50'}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            multiple
            className="hidden"
            onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
          />
          <span className="label-caps text-gold-text">
            {processing ? 'Converting…' : 'Click to choose PNG/JPEG files, or drag them here'}
          </span>
        </div>
        {error && <p className="text-2xs text-rose mt-3">{error}</p>}
      </div>

      {images.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="label-caps text-muted text-2xs">{images.length} converted</p>
            <button onClick={clearAll} className="label-caps text-2xs text-rose hover:underline">Clear all</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img) => {
              const savings = img.originalSize > 0 ? Math.round((1 - img.webpSize / img.originalSize) * 100) : 0;
              return (
                <div key={img.id} className="rounded-md border border-gold/20 bg-ivory overflow-hidden">
                  <img src={img.url} alt={img.downloadName} className="w-full h-40 object-contain bg-cream" />
                  <div className="p-4">
                    <p className="text-sm text-ink truncate mb-1">{img.downloadName}</p>
                    <p className="text-2xs text-muted mb-3">
                      {img.width}×{img.height}px · {formatKb(img.originalSize)} → {formatKb(img.webpSize)}
                      {savings > 0 && <span className="text-gold-text"> ({savings}% smaller)</span>}
                    </p>
                    <a
                      href={img.url}
                      download={img.downloadName}
                      className="btn-caps btn-gold-outline inline-block rounded-sm px-3 py-1.5 text-2xs"
                    >
                      Download
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
