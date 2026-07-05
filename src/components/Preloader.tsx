import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ShieldCheck, Cpu } from "lucide-react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Calibrating Decision Intelligence...");
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP entry stagger animation
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll(".gsap-animate"),
        { opacity: 0, y: 30, scale: 0.92 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 1.2, 
          stagger: 0.18, 
          ease: "power3.out",
          delay: 0.1
        }
      );
    }

    // Stage text updates
    const textSequence = [
      { min: 0, text: "Calibrating Decision Intelligence..." },
      { min: 20, text: "Mapping Swadeshi Heritage Corridors..." },
      { min: 45, text: "Synthesizing Local Artisan Ledger..." },
      { min: 70, text: "Compiling Spatio-Temporal Scenic Routes..." },
      { min: 90, text: "Assembling Civic Policy Engine..." },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Allow time for exit animation
          }, 800);
          return 100;
        }

        // Random organic increments
        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(100, prev + increment);
        
        // Update helper text based on progress
        const textObj = [...textSequence].reverse().find(item => next >= item.min);
        if (textObj) setLoadingText(textObj.text);

        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-brand-deep z-50 flex flex-col items-center justify-center p-6 text-white"
          id="global-app-preloader"
        >
          {/* Symmetrical grid pattern for refined texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(36,72,85,0.2),rgba(255,255,255,0))]" />
          
          <div ref={containerRef} className="relative z-10 flex flex-col items-center max-w-md w-full text-center space-y-12">
            
            {/* Ambient pulsing glowing logo container */}
            <div className="relative gsap-animate opacity-0">
              <div className="absolute inset-0 bg-brand-rose/20 rounded-full blur-2xl animate-pulse" />
              <div className="w-20 h-20 rounded-[24px] bg-brand-dark border-2 border-brand-rose/40 flex items-center justify-center text-brand-rose relative z-10 shadow-2xl">
                <Cpu className="h-10 w-10 animate-[spin_8s_linear_infinite]" />
              </div>
            </div>

            {/* Title & Slogan */}
            <div className="space-y-2 gsap-animate opacity-0">
              <h1 className="text-2xl font-extrabold tracking-tight uppercase font-display">
                Civic Heritage Planner
              </h1>
              <p className="text-[9px] font-extrabold tracking-widest text-brand-rose uppercase font-mono">
                Decision Support System v3.5
              </p>
            </div>

            {/* Counter and Text */}
            <div className="w-full space-y-4 gsap-animate opacity-0">
              <div className="flex items-end justify-between px-1">
                <span className="text-[10px] font-bold text-brand-teal tracking-wider uppercase font-mono animate-pulse">
                  {loadingText}
                </span>
                <span className="text-3xl font-extrabold tracking-tighter text-white font-mono">
                  {progress}%
                </span>
              </div>

              {/* Advanced sleek progress bar */}
              <div className="h-1.5 w-full bg-brand-dark/80 rounded-full overflow-hidden p-0.5 border border-brand-teal/15 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-brand-teal via-brand-rose to-brand-rose rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Telemetry/Trust info at the bottom */}
            <div className="flex items-center gap-2 pt-6 text-[10px] font-bold text-slate-400 font-mono gsap-animate opacity-0">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-teal" />
              <span>CRYPTOGRAPHIC LEDGER TRUST AUDITED</span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
