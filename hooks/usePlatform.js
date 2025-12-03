import { useState, useEffect } from 'react';

/**
 * Hook to detect the current platform (web vs desktop)
 * @returns {{ platform: 'web' | 'desktop', isDesktop: boolean, isWeb: boolean }}
 */
export function usePlatform() {
  const [platform, setPlatform] = useState('web');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Detect Tauri environment
    console.log('[usePlatform] Checking platform...', {
      window: typeof window,
      hasTauri: typeof window !== 'undefined' && !!window.__TAURI__,
      tauriObject: typeof window !== 'undefined' ? window.__TAURI__ : undefined
    });

    if (typeof window !== 'undefined' && window.__TAURI__) {
      console.log('[usePlatform] Detected desktop mode');
      setPlatform('desktop');
      setIsDesktop(true);
    } else {
      console.log('[usePlatform] Detected web mode');
    }
  }, []);

  return {
    platform,
    isDesktop,
    isWeb: !isDesktop,
  };
}
