import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, Check, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { PhotoFrame } from '../types/certificate';

interface PhotoUploadProps {
  photoUrl: string | null;
  photoFrame: PhotoFrame;
  photoZoom: number;
  showPhoto: boolean;
  onPhotoChange: (url: string | null) => void;
  onFrameChange: (frame: PhotoFrame) => void;
  onZoomChange: (zoom: number) => void;
  onToggleShowPhoto: (show: boolean) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photoUrl,
  photoFrame,
  photoZoom = 100,
  showPhoto,
  onPhotoChange,
  onFrameChange,
  onZoomChange,
  onToggleShowPhoto,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie um arquivo de imagem válido (JPG, PNG ou WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter menos de 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onPhotoChange(e.target.result as string);
        if (!showPhoto) onToggleShowPhoto(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleZoomStep = (delta: number) => {
    const next = Math.min(250, Math.max(50, (photoZoom || 100) + delta));
    onZoomChange(next);
  };

  const frameOptions: { id: PhotoFrame; label: string }[] = [
    { id: 'oval', label: 'Medalhão Oval' },
    { id: 'circle', label: 'Círculo Real' },
    { id: 'polaroid', label: 'Polaroid Retrô' },
    { id: 'ornate', label: 'Moldura Nobre' },
  ];

  const samplePhoto = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-rose-700 dark:text-rose-400" />
          Retrato do Casal
        </label>
        
        {/* Toggle show/hide */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-600 dark:text-stone-400">
          <span>Exibir na certidão</span>
          <input
            type="checkbox"
            checked={showPhoto}
            onChange={(e) => onToggleShowPhoto(e.target.checked)}
            className="w-4 h-4 rounded text-rose-800 focus:ring-rose-500 accent-[#72092c]"
          />
        </label>
      </div>

      {photoUrl ? (
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Preview based on selected frame and zoom */}
            <div className="relative group shrink-0">
              <div className={`overflow-hidden bg-stone-200 border-2 border-[#c5a059] shadow-md transition-all ${
                photoFrame === 'oval' ? 'w-24 h-32 rounded-[50%]' :
                photoFrame === 'circle' ? 'w-24 h-24 rounded-full' :
                photoFrame === 'polaroid' ? 'w-24 h-28 p-1.5 pb-5 bg-white shadow-lg rotate-[-2deg]' :
                'w-24 h-28 rounded-lg'
              }`}>
                <img
                  src={photoUrl}
                  alt="Foto do Casal"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover transition-transform duration-100 ease-out"
                  style={{
                    transform: `scale(${(photoZoom || 100) / 100})`,
                    transformOrigin: 'center center',
                  }}
                />
              </div>
              
              <button
                type="button"
                onClick={() => onPhotoChange(null)}
                title="Remover foto"
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2.5 w-full">
              <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                Foto carregada! Escolha o formato da moldura:
              </p>
              
              <div className="grid grid-cols-2 gap-1.5">
                {frameOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onFrameChange(opt.id)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all flex items-center justify-center gap-1.5 ${
                      photoFrame === opt.id
                        ? 'bg-[#72092c] text-white border-[#72092c] shadow-sm font-semibold'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-rose-300'
                    }`}
                  >
                    {photoFrame === opt.id && <Check className="w-3 h-3 text-amber-300" />}
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-0.5 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#72092c] dark:text-rose-300 hover:underline font-semibold"
                >
                  Trocar imagem
                </button>
              </div>
            </div>
          </div>

          {/* ================= ZOOM TOOL CONTROLS ================= */}
          <div className="pt-3 border-t border-stone-200/80 dark:border-stone-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                Ferramenta de Zoom da Foto
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-[#72092c] dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-200/60 dark:border-rose-800/60">
                  {photoZoom || 100}%
                </span>
                <button
                  type="button"
                  onClick={() => onZoomChange(100)}
                  title="Redefinir Zoom para 100%"
                  className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleZoomStep(-10)}
                aria-label="Diminuir zoom"
                className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors shrink-0"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <input
                type="range"
                min="50"
                max="250"
                step="5"
                value={photoZoom || 100}
                onChange={(e) => onZoomChange(Number(e.target.value))}
                aria-label="Controle deslizante de zoom da foto"
                className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#72092c]"
              />

              <button
                type="button"
                onClick={() => handleZoomStep(10)}
                aria-label="Aumentar zoom"
                className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors shrink-0"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-[10.5px] text-stone-400 text-center sm:text-left">
              Arraste a barra ou use os botões para aproximar ou afastar o enquadramento da foto no documento.
            </p>
          </div>
        </div>
      ) : (
        /* Modern Drag & Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-rose-600 bg-rose-50/80 dark:bg-rose-950/20 scale-[0.99]'
              : 'border-stone-300 dark:border-stone-700 hover:border-[#c5a059] bg-stone-50/50 dark:bg-stone-900/40'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            Arraste ou clique para enviar a foto do casal
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Formatos aceitos: JPG, PNG ou WebP (processamento 100% no seu navegador)
          </p>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPhotoChange(samplePhoto);
              if (!showPhoto) onToggleShowPhoto(true);
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#72092c] dark:text-amber-300 hover:underline font-medium"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            Usar foto de demonstração
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
