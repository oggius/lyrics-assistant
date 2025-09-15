import { useEffect, useRef, useState, useCallback } from 'react';
import { ScrollService, createScrollService } from '../services/ScrollService';
import { ScrollConfig } from '../types/api';

interface UseScrollServiceReturn {
  scrollService: ScrollService;
  isPlaying: boolean;
  isPaused: boolean;
  isActive: boolean;
  config: ScrollConfig;
  play: (scrollToElement?: HTMLElement) => void;
  stop: () => void;
  pause: () => void;
  updateConfig: (config: Partial<ScrollConfig>) => void;
}

export const useScrollService = (initialConfig?: Partial<ScrollConfig>): UseScrollServiceReturn => {
  // Initialize scroll service immediately
  const scrollServiceRef = useRef<ScrollService>(createScrollService(initialConfig));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<ScrollConfig>({
    startDelay: initialConfig?.startDelay ?? 0,
    speed: initialConfig?.speed ?? 5,
    isActive: false,
    isPaused: false,
  });

  // Update state based on scroll service status
  const updateState = useCallback(() => {
    setIsPlaying(scrollServiceRef.current.isPlaying());
    setIsPaused(scrollServiceRef.current.isPaused());
    setIsActive(scrollServiceRef.current.isActive());
    setConfig(scrollServiceRef.current.getConfig());
  }, []);

  const play = useCallback((scrollToElement?: HTMLElement) => {
    scrollServiceRef.current.play(scrollToElement);
    updateState();
  }, [updateState]);

  const stop = useCallback(() => {
    scrollServiceRef.current.stop();
    updateState();
  }, [updateState]);

  const pause = useCallback(() => {
    scrollServiceRef.current.pause();
    updateState();
  }, [updateState]);

  const updateConfig = useCallback((newConfig: Partial<ScrollConfig>) => {
    scrollServiceRef.current.updateConfig(newConfig);
    updateState();
  }, [updateState]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      scrollServiceRef.current.destroy();
    };
  }, []);

  return {
    scrollService: scrollServiceRef.current,
    isPlaying,
    isPaused,
    isActive,
    config,
    play,
    stop,
    pause,
    updateConfig,
  };
};