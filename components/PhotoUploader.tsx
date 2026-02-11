import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PhotoUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ images, onChange, maxImages = 4 }) => {
  // Helper to trigger file input
  const triggerFileInput = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            const newImages = [...images];
            // Ensure array is filled up to this index
            for (let i = 0; i < index; i++) {
                if (!newImages[i]) newImages[i] = "";
            }
            newImages[index] = reader.result as string;
            onChange(newImages);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = ""; // Set to empty string instead of splicing to maintain slot position
    onChange(newImages);
  };

  // Create an array of 4 slots
  const slots = Array.from({ length: maxImages }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          Gambar Laporan ({images.filter(img => img).length}/{maxImages})
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {slots.map((index) => {
          const hasImage = images[index] && images[index] !== "";
          
          return (
            <div 
              key={index} 
              className={`relative aspect-video rounded-lg overflow-hidden border-2 ${hasImage ? 'border-slate-200 bg-slate-100' : 'border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100'} transition-all group`}
            >
              {hasImage ? (
                <>
                  <img 
                    src={images[index]} 
                    alt={`Gambar ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                  
                  {/* Overlay for actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-start justify-end p-2">
                    <button
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white p-1.5 rounded-full shadow-sm hover:bg-red-600 transition-transform transform scale-0 group-hover:scale-100"
                      title="Padam Gambar"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-tr">
                    Gambar {index + 1}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => triggerFileInput(index)}
                  className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-brand-600 transition-colors"
                >
                  <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">Muat Naik Gambar {index + 1}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-slate-500 italic">
        * Klik pada kotak kosong untuk memuat naik gambar.
      </p>
    </div>
  );
};