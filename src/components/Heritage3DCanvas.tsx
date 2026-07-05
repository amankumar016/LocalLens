import React, { useEffect, useRef, useState } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  color?: string;
  size?: number;
  type?: 'dome' | 'column' | 'base' | 'particle' | 'gear';
  originX?: number;
  originY?: number;
  originZ?: number;
}

interface Heritage3DCanvasProps {
  scrollRatio: number;
}

export default function Heritage3DCanvas({ scrollRatio }: Heritage3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verticesRef = useRef<Point3D[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  // Generate 3D points for an intricate historic Indian dome + columns structure
  useEffect(() => {
    const points: Point3D[] = [];
    
    // 1. Create a dome/mandala spire structure (Concentric rings stack)
    const domeRings = 12;
    for (let r = 0; r < domeRings; r++) {
      const ringY = -120 + r * 15; // Vertical stack
      const maxRadius = 110 * Math.sin((r / domeRings) * Math.PI); // Dome curvature
      const pointsInRing = 24 - r; // Tapering details
      
      for (let p = 0; p < pointsInRing; p++) {
        const angle = (p / pointsInRing) * Math.PI * 2;
        const x = maxRadius * Math.cos(angle);
        const z = maxRadius * Math.sin(angle);
        
        points.push({
          x,
          y: ringY,
          z,
          type: 'dome',
          color: r === 0 ? '#E64833' : '#244855', // Flame orange tip, teal body
          size: r === 0 ? 3.5 : 1.5,
          // Random scatter origins for the scrolling assembly assembly effect
          originX: x + (Math.random() - 0.5) * 600,
          originY: ringY - 400 - Math.random() * 300,
          originZ: z + (Math.random() - 0.5) * 600,
        });
      }
    }

    // 2. Pillars/Columns at the base
    const pillars = 6;
    const pillarHeight = 80;
    const pillarYStart = 60;
    const pillarRadius = 120;
    
    for (let pil = 0; pil < pillars; pil++) {
      const pilAngle = (pil / pillars) * Math.PI * 2;
      const pilX = pillarRadius * Math.cos(pilAngle);
      const pilZ = pillarRadius * Math.sin(pilAngle);
      
      // Vertical vertices along each pillar
      for (let h = 0; h < 6; h++) {
        const y = pillarYStart + (h / 5) * pillarHeight;
        points.push({
          x: pilX,
          y,
          z: pilZ,
          type: 'column',
          color: '#874F41', // Earth tone
          size: 2.5,
          originX: pilX * 2 + (Math.random() - 0.5) * 200,
          originY: y + 300 + Math.random() * 200,
          originZ: pilZ * 2 + (Math.random() - 0.5) * 200,
        });
        
        // Ring details on column bases/capitals
        if (h === 0 || h === 5) {
          for (let d = 0; d < 8; d++) {
            const rAngle = (d / 8) * Math.PI * 2;
            const rx = pilX + 12 * Math.cos(rAngle);
            const rz = pilZ + 12 * Math.sin(rAngle);
            points.push({
              x: rx,
              y,
              z: rz,
              type: 'column',
              color: '#FBE9D0',
              size: 1.2,
              originX: rx + (Math.random() - 0.5) * 400,
              originY: y + (Math.random() - 0.5) * 400,
              originZ: rz + (Math.random() - 0.5) * 400,
            });
          }
        }
      }
    }

    // 3. Central floating geometric mandala / gear of time (Decision engine)
    const gearPoints = 36;
    const gearRadius = 55;
    const gearY = 20;
    for (let g = 0; g < gearPoints; g++) {
      const angle = (g / gearPoints) * Math.PI * 2;
      // Add gear teeth variation
      const r = gearRadius + (g % 2 === 0 ? 8 : 0);
      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle);
      points.push({
        x,
        y: gearY,
        z,
        type: 'gear',
        color: '#E64833',
        size: 2,
        originX: (Math.random() - 0.5) * 1000,
        originY: gearY + (Math.random() - 0.5) * 1000,
        originZ: (Math.random() - 0.5) * 1000,
      });
    }

    // 4. Ambient starfield/particles floating around
    const particlesCount = 80;
    for (let i = 0; i < particlesCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 180 + Math.random() * 140;
      
      const x = dist * Math.sin(phi) * Math.cos(theta);
      const y = (Math.random() - 0.5) * 350;
      const z = dist * Math.sin(phi) * Math.sin(theta);
      
      points.push({
        x,
        y,
        z,
        type: 'particle',
        color: Math.random() > 0.4 ? '#FBE9D0' : '#E64833',
        size: Math.random() * 2 + 0.5,
        originX: x * 0.1,
        originY: y * 0.1,
        originZ: z * 0.1,
      });
    }

    verticesRef.current = points;
  }, []);

  // Handle resizing of container
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: width || 400, height: height || 400 });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // 3D rendering engine on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Smooth scroll interpolation (inertia for scrubbing rotation)
    let currentRotationY = scrollRatio * Math.PI * 3.5; // Rotate multiple times on scroll
    let currentRotationX = scrollRatio * Math.PI * 0.4 - 0.15; // Pivot elevation
    let targetRotationY = currentRotationY;
    let targetRotationX = currentRotationX;
    
    // Lerp assembly factor (from scattered to fully assembled)
    // 0 = scattered, 1 = fully assembled
    // We map scroll ratio so that it assembles completely at 45% scroll
    const targetAssembly = scrollRatio >= 0.85 ? 1 : Math.min(1, scrollRatio * 2.2);
    let currentAssembly = 0;

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Update targets
      targetRotationY = scrollRatio * Math.PI * 3.0;
      targetRotationX = (scrollRatio * Math.PI * 0.35) - 0.1;
      
      // Apply smooth inertia/damping to scrubbing
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentAssembly += (targetAssembly - currentAssembly) * 0.05;

      const cosY = Math.cos(currentRotationY);
      const sinY = Math.sin(currentRotationY);
      const cosX = Math.cos(currentRotationX);
      const sinX = Math.sin(currentRotationX);

      const perspective = 400;
      const cx = dimensions.width / 2;
      const cy = dimensions.height / 2;

      // Filter and sort points by depth (Z) for painter's algorithm
      const projectedPoints = verticesRef.current.map((pt) => {
        // Linear interpolation between exploded origin and target assembled coordinates
        const interpX = pt.originX !== undefined ? pt.originX + (pt.x - pt.originX) * currentAssembly : pt.x;
        const interpY = pt.originY !== undefined ? pt.originY + (pt.y - pt.originY) * currentAssembly : pt.y;
        const interpZ = pt.originZ !== undefined ? pt.originZ + (pt.z - pt.originZ) * currentAssembly : pt.z;

        // Apply rotation Y
        let x1 = interpX * cosY - interpZ * sinY;
        let z1 = interpX * sinY + interpZ * cosY;

        // Apply rotation X
        let y2 = interpY * cosX - z1 * sinX;
        let z2 = interpY * sinX + z1 * cosX;

        // Perspective translate
        const distance = 350;
        const zDepth = z2 + distance;
        const scale = perspective / Math.max(1, zDepth);
        
        const screenX = cx + x1 * scale;
        const screenY = cy + y2 * scale;

        return {
          sx: screenX,
          sy: screenY,
          depth: zDepth,
          color: pt.color || '#FBE9D0',
          size: Math.max(0.5, pt.size ? pt.size * scale : scale),
          type: pt.type
        };
      });

      // Sort points back-to-front
      projectedPoints.sort((a, b) => b.depth - a.depth);

      // Draw lines between structural points to make it a beautiful architectural blueprint
      ctx.lineWidth = 0.55;
      
      // Render structure connections (dome rings & columns)
      ctx.strokeStyle = `rgba(36, 72, 85, ${0.15 + currentAssembly * 0.25})`; // Glow with assembly
      
      // Connect dome ring vertices
      for (let i = 0; i < projectedPoints.length; i++) {
        const p1 = projectedPoints[i];
        if (p1.type !== 'dome' && p1.type !== 'column') continue;
        
        // Find nearest neighbor within a small radius in 3D-projected space to connect lines
        let connections = 0;
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p2 = projectedPoints[j];
          if (p2.type !== p1.type) continue;
          
          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < 1300 && connections < 2) {
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Render the points
      projectedPoints.forEach((pt) => {
        // Skip points outside canvas bounds
        if (pt.sx < 0 || pt.sx > dimensions.width || pt.sy < 0 || pt.sy > dimensions.height) return;

        // Draw point
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, pt.size, 0, Math.PI * 2);
        
        // Enhance glowing effects for key details
        if (pt.type === 'gear' || pt.color === '#E64833') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#E64833';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = pt.color;
        ctx.fill();
      });

      ctx.shadowBlur = 0; // Reset shadow

      // Draw HUD rings around the structure (tech-luxury aesthetic)
      ctx.strokeStyle = "rgba(135, 79, 65, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 90 * Math.cos(currentRotationX), 140 * currentAssembly, 45 * currentAssembly, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(230, 72, 51, 0.15)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + 90 * Math.cos(currentRotationX), 190 * currentAssembly, 60 * currentAssembly, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Digital angle HUD text overlay
      ctx.fillStyle = "rgba(251, 233, 208, 0.35)";
      ctx.font = "8px monospace";
      ctx.fillText(`ROT_Y: ${(currentRotationY % (Math.PI * 2)).toFixed(3)} RAD`, 24, dimensions.height - 35);
      ctx.fillText(`ROT_X: ${currentRotationX.toFixed(3)} RAD`, 24, dimensions.height - 23);
      ctx.fillText(`ASSEMB_ENG: ${(currentAssembly * 100).toFixed(1)}%`, 24, dimensions.height - 11);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, scrollRatio]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative flex items-center justify-center overflow-hidden"
      id="canvas-3d-scrub-container"
    >
      <canvas 
        ref={canvasRef} 
        width={dimensions.width} 
        height={dimensions.height}
        className="block relative max-w-full"
      />
    </div>
  );
}
