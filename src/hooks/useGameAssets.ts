import { useState, useCallback } from 'react';

export interface GameAssets {
  birdImage: string | null;
  pipeTopImage: string | null;
  pipeBottomImage: string | null;
  backgroundImage: string | null;
  groundImage: string | null;
}

const DEFAULT_ASSETS: GameAssets = {
  birdImage: null,
  pipeTopImage: null,
  pipeBottomImage: null,
  backgroundImage: null,
  groundImage: null,
};

export function useGameAssets() {
  const [assets, setAssets] = useState<GameAssets>(DEFAULT_ASSETS);

  const updateAsset = useCallback((key: keyof GameAssets, dataUrl: string | null) => {
    setAssets(prev => ({ ...prev, [key]: dataUrl }));
  }, []);

  const handleFileUpload = useCallback((key: keyof GameAssets, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateAsset(key, result);
    };
    reader.readAsDataURL(file);
  }, [updateAsset]);

  const resetAssets = useCallback(() => {
    setAssets(DEFAULT_ASSETS);
  }, []);

  return {
    assets,
    updateAsset,
    handleFileUpload,
    resetAssets,
  };
}
