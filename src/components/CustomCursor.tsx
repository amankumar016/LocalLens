import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState<{
    active: boolean;
    type: 'button' | 'link' | 'tab' | 'input' | 'none';
    label?: string;
  }>({ active: false, type: 'none' });

  // Use motion values for raw coordinates to avoid continuous React re-renders
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Configure high-fidelity spring physics for the lagging inertia ring
  const springConfig = { damping: 35, stiffness: 280, mass: 0.5 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Disable custom cursor on mobile/touch screens to avoid visual lag and overlapping
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Climb up DOM to check if clickable/hoverable elements exist
      const clickable = target.closest("button, a, [role='button'], .cursor-pointer, input, select, textarea");
      
      if (clickable) {
        let type: 'button' | 'link' | 'tab' | 'input' | 'none' = 'button';
        let label = undefined;

        if (clickable.tagName === 'INPUT' || clickable.tagName === 'SELECT' || clickable.tagName === 'TEXTAREA') {
          type = 'input';
        } else if (clickable.id?.includes('sidebar-item') || clickable.className?.includes('tab')) {
          type = 'tab';
          label = "SIMULATE";
        } else if (clickable.id?.includes('report') || clickable.id?.includes('action-btn')) {
          label = "REPORT";
        } else if (clickable.id?.includes('city-selector')) {
          label = "LOCATE";
        }

        setHoverState({
          active: true,
          type,
          label
        });
      } else {
        setHoverState({ active: false, type: 'none' });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (isMobile) return null;

  return (
    <>
      {/* 1. Fine precise center pointer dot */}
      <motion.div
        className="fixed w-2 h-2 rounded-full bg-brand-rose pointer-events-none z-50 mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: hoverState.active ? (hoverState.type === 'input' ? 0.3 : 1.5) : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      {/* 2. Inertial trailing glow ring */}
      <motion.div
        className="fixed rounded-full border border-brand-rose/60 pointer-events-none z-50 flex items-center justify-center text-[8px] font-extrabold tracking-widest text-brand-rose"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hoverState.active 
            ? hoverState.type === 'input' ? 12 : 72 
            : 32,
          height: hoverState.active 
            ? hoverState.type === 'input' ? 32 : 72 
            : 32,
          backgroundColor: hoverState.active 
            ? hoverState.type === 'input' ? "rgba(230,72,51,0.05)" : "rgba(230,72,51,0.12)" 
            : "rgba(230,72,51,0)",
          borderColor: hoverState.active ? "rgba(230,72,51,0.95)" : "rgba(230,72,51,0.45)",
          boxShadow: hoverState.active 
            ? "0 0 20px rgba(230,72,51,0.4)" 
            : "0 0 0px rgba(230,72,51,0)",
        }}
        transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.6 }}
      >
        {/* Render contextual floating action labels inside cursor hover state */}
        {hoverState.active && hoverState.label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-[7px] text-brand-rose font-black text-center select-none"
          >
            {hoverState.label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
