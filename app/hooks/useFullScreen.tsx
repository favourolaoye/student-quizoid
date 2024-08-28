"use client";

import { useEffect } from 'react';

const useFullScreen = () => {
  useEffect(() => {
    const forceFullScreen = () => {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleFullScreenChange = () => {
      forceFullScreen();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    // Initially request full-screen mode
    forceFullScreen();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);
};

export default useFullScreen;
