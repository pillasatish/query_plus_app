import React, { useState } from 'react';
import { Upload, X, Loader2, Camera, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onAnalysisComplete: (file: File) => void;
  onError: (error: string) => void;
  isAnalyzing?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onAnalysisComplete, onError, isAnalyzing = false }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      onError('Image size must be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      onError('Please select an image file');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleUpload = () => {
    if (selectedImage) {
      onAnalysisComplete(selectedImage);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload a clear photo of your legs
        </label>
        <div 
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-1 text-center">
            {!previewUrl ? (
              <>
                <div className="mx-auto h-12 w-12 text-gray-400">
                  {isAnalyzing ? (
                    <Loader2 className="h-12 w-12 animate-spin" />
                  ) : (
                    <Camera className="h-12 w-12" />
                  )}
                </div>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Upload a photo</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileInput}
                      disabled={isAnalyzing}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  📸 Tip: Take a clear photo showing both legs from knee to ankle
                </p>
              </>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 rounded-lg mx-auto"
                />
                {!isAnalyzing && (
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Analyzing with AI...</p>
                      <p className="text-xs mt-1">Connecting to varicose-veins.vercel.app</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedImage && !isAnalyzing && (
        <div className="mt-4">
          <button
            onClick={handleUpload}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            Analyze Photo with AI
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Photo Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Ensure good lighting and clear visibility</li>
          <li>• Show both legs from knee to ankle</li>
          <li>• Stand straight with legs slightly apart</li>
          <li>• Avoid shadows or reflections</li>
          <li>• Remove socks or stockings if possible</li>
        </ul>
      </div>

      <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-yellow-900">AI Analysis</h4>
            <p className="text-xs text-yellow-800 mt-1">
              Your photo will be securely analyzed by our AI system at varicose-veins.vercel.app to generate a detailed medical report.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;