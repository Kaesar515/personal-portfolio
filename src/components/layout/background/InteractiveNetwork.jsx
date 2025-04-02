import React, { useRef, useEffect, useCallback } from 'react';

function InteractiveNetwork() {
  const networkCanvasRef = useRef(null);
  const nodes = useRef([]); // Use ref to persist nodes array across renders
  const mouse = useRef({ x: null, y: null }); // Use ref for mouse position
  const time = useRef(0); // Use ref for animation time
  const energyLines = useRef([]); // Use ref for energy lines

  // Memoize the resize handler to avoid recreating it on every render
  const handleResize = useCallback(() => {
    const networkCanvas = networkCanvasRef.current;
    if (!networkCanvas) return;

    networkCanvas.width = window.innerWidth;
    networkCanvas.height = window.innerHeight;

    // Optional: Re-initialize or adjust nodes based on new size
    // For simplicity, we'll just clear and let the draw loop handle it,
    // but a more robust solution might reposition existing nodes.
    // nodes.current = []; // Example: Reset nodes if needed
    // setupNodes(); // Example: Call node setup function again

  }, []); // Empty dependency array means this function is created once

  // Effect for initial setup and resize listener
  useEffect(() => {
    const networkCanvas = networkCanvasRef.current;
    if (!networkCanvas) return;

    const ctx = networkCanvas.getContext('2d');

    // Initial setup
    handleResize(); // Set initial size

    // ===============================================
    // CONFIGURABLE PARAMETERS (Keep as is)
    // ===============================================
    const NODES = 70; // total nodes
    const MIN_NODE_DISTANCE = 90; // enforce at least 60px between any two nodes
    const CONNECTION_RADIUS = 200;
    const LIGHTNING_INTERVAL = 10000; // 10 seconds
    const LIGHTNING_SEGMENTS = 8;
    const LIGHTNING_FADE_SPEED = 0.01;
    const WAVE_AMPLITUDE = 5;
    const WAVE_SPEED = 0.01; // smaller => slower wave
    const NODE_HOVER_RADIUS = 150; // Increased radius for spotlight effect
    const LINE_HOVER_RADIUS = 100; // Increased radius for spotlight effect
    const SPOTLIGHT_INTENSITY = 0.8; // How bright the spotlight effect is

    // Reset refs used within setup/draw
    nodes.current = [];
    energyLines.current = [];
    time.current = 0;

    // Helper: distance
    function dist(x1, y1, x2, y2) {
      return Math.hypot(x2 - x1, y2 - y1);
    }

    // ===============================================
    // NODE SETUP (adapt to use nodes.current)
    // ===============================================
    function setupNodes() {
        nodes.current = []; // Clear existing nodes before setup
        for (let i = 0; i < NODES; i++) {
          let x, y;
          let attempts = 0;
          let placed = false;

          while (attempts < 5000 && !placed) {
            x = Math.random() * networkCanvas.width;
            y = Math.random() * networkCanvas.height;

            let tooClose = false;
            for (const node of nodes.current) { // Use nodes.current
              if (dist(x, y, node.baseX, node.baseY) < MIN_NODE_DISTANCE) {
                tooClose = true;
                break;
              }
            }

            if (!tooClose) {
              nodes.current.push({ baseX: x, baseY: y }); // Use nodes.current
              placed = true;
            }
            attempts++;
          }

          if (!placed) {
            console.warn(`Could not place node #${i + 1}; stopping early at ${nodes.current.length} nodes.`);
            break;
          }
        }
    }
    setupNodes(); // Initial node placement

    // ===============================================
    // ENERGY (LIGHTNING) LINES (adapt to use refs)
    // ===============================================
    function spawnEnergyLine() {
      if (nodes.current.length < 2) return;
      const from = nodes.current[Math.floor(Math.random() * nodes.current.length)];
      let to;
      do {
        to = nodes.current[Math.floor(Math.random() * nodes.current.length)];
      } while (to === from);

      const path = [];
      for (let i = 0; i <= LIGHTNING_SEGMENTS; i++) {
        const t = i / LIGHTNING_SEGMENTS;
        // Use time.current for wave offset consistency
        const fx = from.baseX + Math.sin(time.current + i) * WAVE_AMPLITUDE;
        const fy = from.baseY + Math.cos(time.current + i) * WAVE_AMPLITUDE;
        const tx = to.baseX + Math.sin(time.current + i + 100) * WAVE_AMPLITUDE;
        const ty = to.baseY + Math.cos(time.current + i + 100) * WAVE_AMPLITUDE;

        const xx = fx + (tx - fx) * t + (Math.random() - 0.5) * 25;
        const yy = fy + (ty - fy) * t + (Math.random() - 0.5) * 25;
        path.push({ x: xx, y: yy });
      }
      energyLines.current.push({ path, alpha: 1 }); // Use energyLines.current
    }

    const lightningTimer = setInterval(spawnEnergyLine, LIGHTNING_INTERVAL);

    // ===============================================
    // MOUSE HANDLING (adapt to use mouse.current)
    // ===============================================
    function handleMouseMove(e) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }
    // Add listener to window for broader capture, might help if canvas is partially obscured
    window.addEventListener('mousemove', handleMouseMove);

    // ===============================================
    // ANIMATION LOOP (adapt to use refs)
    // ===============================================
    let animationFrameId;
    function draw() {
      time.current += WAVE_SPEED;
      ctx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);

      // --- PASS 1: Draw Connections (Lines) --- 
      for (let i = 0; i < nodes.current.length; i++) {
        const nodeA = nodes.current[i];
        const waveAx = nodeA.baseX + Math.sin(time.current + i) * WAVE_AMPLITUDE;
        const waveAy = nodeA.baseY + Math.cos(time.current + i) * WAVE_AMPLITUDE;

        for (let j = i + 1; j < nodes.current.length; j++) {
          const nodeB = nodes.current[j];
          const waveBx = nodeB.baseX + Math.sin(time.current + j) * WAVE_AMPLITUDE;
          const waveBy = nodeB.baseY + Math.cos(time.current + j) * WAVE_AMPLITUDE;

          const distAB = dist(waveAx, waveAy, waveBx, waveBy);
          if (distAB < CONNECTION_RADIUS) {
            const midX = (waveAx + waveBx) / 2;
            const midY = (waveAy + waveBy) / 2;
            
            // Calculate distance to mouse for spotlight effect
            const distToMouse = mouse.current.x && mouse.current.y 
              ? dist(midX, midY, mouse.current.x, mouse.current.y)
              : Infinity;

            // Calculate spotlight intensity (1 = full brightness, 0 = dim)
            const spotlightIntensity = Math.max(0, 1 - (distToMouse / LINE_HOVER_RADIUS));
            
            ctx.beginPath();
            ctx.moveTo(waveAx, waveAy);
            ctx.lineTo(waveBx, waveBy);

            // Apply spotlight effect
            const baseOpacity = 0.2;
            const glowOpacity = spotlightIntensity * SPOTLIGHT_INTENSITY;
            ctx.strokeStyle = `rgba(0, 225, 255, ${baseOpacity + glowOpacity})`;
            ctx.shadowColor = `rgba(0, 225, 255, ${glowOpacity * 0.8})`;
            ctx.shadowBlur = 15 * spotlightIntensity;
            ctx.lineWidth = 2.5 + (3 * spotlightIntensity);
            
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }

      // --- PASS 2: Draw Nodes --- 
      for (let i = 0; i < nodes.current.length; i++) {
        const node = nodes.current[i];
        const waveX = node.baseX + Math.sin(time.current + i) * WAVE_AMPLITUDE;
        const waveY = node.baseY + Math.cos(time.current + i) * WAVE_AMPLITUDE;

        // Calculate distance to mouse for spotlight effect
        const distToMouse = mouse.current.x && mouse.current.y 
          ? dist(waveX, waveY, mouse.current.x, mouse.current.y)
          : Infinity;

        // Calculate spotlight intensity (1 = full brightness, 0 = dim)
        const spotlightIntensity = Math.max(0, 1 - (distToMouse / NODE_HOVER_RADIUS));

        // Apply spotlight effect
        const baseOpacity = 0.8;
        const glowOpacity = spotlightIntensity * SPOTLIGHT_INTENSITY;
        const nodeRadius = 6 + (6 * spotlightIntensity);
        
        ctx.beginPath();
        ctx.arc(waveX, waveY, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 225, 255, ${baseOpacity + glowOpacity})`;
        ctx.shadowColor = `rgba(0, 225, 255, ${glowOpacity * 0.8})`;
        ctx.shadowBlur = 20 * spotlightIntensity;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 3) LIGHTNING / ENERGY LINES
      for (let i = energyLines.current.length - 1; i >= 0; i--) {
        const energyLine = energyLines.current[i];
        ctx.beginPath();
        ctx.moveTo(energyLine.path[0].x, energyLine.path[0].y);
        for (let j = 1; j < energyLine.path.length; j++) {
          ctx.lineTo(energyLine.path[j].x, energyLine.path[j].y);
        }
        ctx.strokeStyle = `rgba(0, 225, 255, ${energyLine.alpha})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = `rgba(0, 225, 255, ${energyLine.alpha * 0.8})`;
        ctx.shadowBlur = 25;
        ctx.stroke();
        ctx.shadowBlur = 0;

        energyLine.alpha -= LIGHTNING_FADE_SPEED;
        if (energyLine.alpha <= 0) {
          energyLines.current.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    draw(); // Start animation loop

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(lightningTimer);
      cancelAnimationFrame(animationFrameId); // Stop animation frame on unmount
    };
  }, [handleResize]); // Rerun effect if handleResize changes (it won't due to useCallback)

  return (
    <div className="fixed inset-0 z-0">
      <canvas 
        ref={networkCanvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-auto" 
      />
    </div>
  );
}

export default InteractiveNetwork; 