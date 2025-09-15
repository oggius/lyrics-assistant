import { ScrollConfig } from '../types/api';

export class ScrollService {
  private scrollConfig: ScrollConfig;
  private scrollInterval: NodeJS.Timeout | null = null;
  private startDelayTimeout: NodeJS.Timeout | null = null;
  private isScrolling: boolean = false;

  constructor(initialConfig: Partial<ScrollConfig> = {}) {
    this.scrollConfig = {
      startDelay: initialConfig.startDelay ?? 0,
      speed: initialConfig.speed ?? 5,
      isActive: false,
      isPaused: false,
    };
  }

  /**
   * Start automatic scrolling with configured delay
   * @param scrollToElement - Optional element to scroll to before starting
   */
  public play(scrollToElement?: HTMLElement): void {
    if (this.scrollConfig.isActive && !this.scrollConfig.isPaused) {
      return; // Already playing
    }

    this.scrollConfig.isActive = true;
    this.scrollConfig.isPaused = false;

    // Clear any existing timeouts/intervals
    this.clearTimers();

    // If resuming from pause, start immediately
    if (this.isScrolling) {
      this.startScrolling();
      return;
    }

    // Scroll to the specified element if provided (for new play sessions)
    if (scrollToElement && !this.isScrolling) {
      // Calculate target scroll position
      const initialScrollY = window.pageYOffset;
      const elementRect = scrollToElement.getBoundingClientRect();
      const targetScrollY = initialScrollY + elementRect.top;
      
      // Scroll to target position
      window.scrollTo({
        top: targetScrollY,
        behavior: 'auto' // 'auto' works reliably, 'smooth' can be blocked by CSS
      });

      // Add delay before starting auto-scroll
      const scrollPositionDelay = 800;
      const totalDelay = scrollPositionDelay + (this.scrollConfig.startDelay * 1000);
      
      this.startDelayTimeout = setTimeout(() => {
        this.startScrolling();
      }, totalDelay);
      
      return;
    }

    // Start with delay for new play (when not scrolling to element)
    if (this.scrollConfig.startDelay > 0) {
      this.startDelayTimeout = setTimeout(() => {
        this.startScrolling();
      }, this.scrollConfig.startDelay * 1000);
    } else {
      this.startScrolling();
    }
  }

  /**
   * Stop scrolling and return to top
   */
  public stop(): void {
    this.clearTimers();
    this.scrollConfig.isActive = false;
    this.scrollConfig.isPaused = false;
    this.isScrolling = false;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Pause scrolling without returning to top
   */
  public pause(): void {
    if (!this.scrollConfig.isActive) {
      return; // Not currently active
    }

    this.clearTimers();
    this.scrollConfig.isPaused = true;
  }

  /**
   * Update scroll configuration
   */
  public updateConfig(config: Partial<ScrollConfig>): void {
    const wasActive = this.scrollConfig.isActive;
    const wasPaused = this.scrollConfig.isPaused;

    this.scrollConfig = {
      ...this.scrollConfig,
      ...config,
    };

    // Validate speed range
    if (this.scrollConfig.speed < 1) {
      this.scrollConfig.speed = 1;
    } else if (this.scrollConfig.speed > 10) {
      this.scrollConfig.speed = 10;
    }

    // Validate delay
    if (this.scrollConfig.startDelay < 0) {
      this.scrollConfig.startDelay = 0;
    }

    // If currently scrolling, restart with new config
    if (wasActive && !wasPaused) {
      this.stop();
      this.play();
    }
  }

  /**
   * Get current scroll configuration
   */
  public getConfig(): ScrollConfig {
    return { ...this.scrollConfig };
  }

  /**
   * Check if currently playing (active and not paused)
   */
  public isPlaying(): boolean {
    return this.scrollConfig.isActive && !this.scrollConfig.isPaused;
  }

  /**
   * Check if currently paused
   */
  public isPaused(): boolean {
    return this.scrollConfig.isPaused;
  }

  /**
   * Check if currently active (playing or paused)
   */
  public isActive(): boolean {
    return this.scrollConfig.isActive;
  }

  /**
   * Clean up timers and event listeners
   */
  public destroy(): void {
    this.clearTimers();
    this.scrollConfig.isActive = false;
    this.scrollConfig.isPaused = false;
    this.isScrolling = false;
  }

  /**
   * Start the actual scrolling mechanism
   */
  private startScrolling(): void {
    this.isScrolling = true;
    
    // Much smoother scrolling: smaller increments with higher frequency
    // Speed 1 = 0.2px per 16ms (~60fps), Speed 10 = 2px per 16ms
    const pixelsPerInterval = this.scrollConfig.speed * 0.2;
    const intervalMs = 16; // ~60fps for smooth animation

    this.scrollInterval = setInterval(() => {
      if (!this.scrollConfig.isActive || this.scrollConfig.isPaused) {
        return;
      }

      const currentScroll = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // Check if we've reached the bottom
      if (currentScroll + windowHeight >= documentHeight - 10) {
        this.stop();
        return;
      }

      // Scroll down by the calculated amount
      window.scrollBy({
        top: pixelsPerInterval,
        behavior: 'instant', // Use instant for precise control over smooth animation
      });
    }, intervalMs);
  }

  /**
   * Clear all active timers
   */
  private clearTimers(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }

    if (this.startDelayTimeout) {
      clearTimeout(this.startDelayTimeout);
      this.startDelayTimeout = null;
    }
  }
}

// Export a factory function for creating scroll service instances
export const createScrollService = (config?: Partial<ScrollConfig>): ScrollService => {
  return new ScrollService(config);
};