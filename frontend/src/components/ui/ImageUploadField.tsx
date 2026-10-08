'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, CheckCircle2, AlertCircle, ImageIcon, RefreshCw } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
  disabled?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  folder = 'uploads',
  helperText,
  aspectRatio = 'auto',
  className = '',
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP, SVG).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('La imagen no debe superar los 20MB.');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al subir la imagen al storage');
      }

      onChange(data.url);
    } catch (err: any) {
      console.error('Error al subir imagen:', err);
      setErrorMessage(err.message || 'No se pudo subir la imagen. Intenta de nuevo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setErrorMessage(null);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square max-w-[140px]';
      case 'video':
        return 'aspect-video w-full max-h-48';
      case 'banner':
        return 'aspect-21/9 w-full max-h-44';
      default:
        return 'w-full h-36';
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700">
          {label}
        </label>
        {value && !isUploading && (
          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            En Supabase Storage
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Si ya hay imagen, mostrar preview elegante con acciones */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-50 shadow-xs">
          <div className={`relative ${getAspectClass()} overflow-hidden mx-auto bg-slate-900/5`}>
            <Image
              src={value}
              alt={label}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover transition-transform duration-300 group-hover:scale-102"
              unoptimized={value.endsWith('.svg')}
            />
            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Barra de control inferior */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px] sm:max-w-[280px]">
              {value.split('/').pop() || 'imagen.jpg'}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                title="Subir otra imagen para reemplazar esta"
              >
                {isUploading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                <span>{isUploading ? 'Subiendo...' : 'Cambiar'}</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={disabled || isUploading}
                className="p-1 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 text-xs transition-all cursor-pointer"
                title="Eliminar imagen"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Dropzone para subir nueva imagen */
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative p-5 rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center gap-2 cursor-pointer ${
            isDragging
              ? 'border-purple-600 bg-purple-50/80 scale-[0.99]'
              : 'border-slate-300 hover:border-purple-500 bg-slate-50/70 hover:bg-purple-50/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-3 text-purple-700">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="text-xs font-black">Subiendo a Supabase Storage...</span>
              <span className="text-[10px] text-slate-500">Por favor espera un momento</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5 text-purple-700" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-800">
                  Haz clic o arrastra una imagen aquí
                </p>
                <p className="text-[10px] text-slate-500">
                  {helperText || 'Se guardará directamente en Supabase Storage (PNG, JPG, WEBP, máx. 20MB)'}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
