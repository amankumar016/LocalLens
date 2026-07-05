import React, { useEffect, useRef } from "react";

interface SmoothScrollProps {
  children: React.ReactNode;
  onScrollRatioChange?: (ratio: number) => void;
}

export default function SmoothScroll({ children, onScrollRatioChange }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize ratio
    if (onScrollRatioChange) onScrollRatioChange(0);

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) {
        if (onScrollRatioChange) onScrollRatioChange(0);
        return;
      }
      const ratio = container.scrollTop / maxScroll;
      if (onScrollRatioChange) {
        onScrollRatioChange(ratio);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial sync
    handleScroll();

    // ResizeObserver to handle content or container height shifts dynamically
    const resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [onScrollRatioChange]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex flex-col min-w-0 overflow-y-auto scroll-smooth custom-scrollbar relative"
      id="smooth-inertial-scroll-viewport"
    >
      {children}
    </div>
  );
}
