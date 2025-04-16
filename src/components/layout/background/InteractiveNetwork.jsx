import React, { useRef, useEffect, useCallback, useState } from 'react';

// --- Global Constants for Effects (can be adjusted) ---
const PERIODIC_PULSE_INTERVAL = 15000; // ms (15 seconds)
const PERIODIC_PULSE_MAX_RADIUS = 120;
const PERIODIC_PULSE_EXPANSION_SPEED = 1.0;
const PERIODIC_PULSE_LINE_WIDTH = 3;
const PERIODIC_PULSE_COLOR_ALPHA = 0.6;
const WAVE_AMPLITUDE = 5; // Moved outside useEffect

function InteractiveNetwork() {
  console.log("InteractiveNetwork component function start"); // Log component start
  const networkCanvasRef = useRef(null);
  const nodes = useRef([]); // Use ref to persist nodes array across renders
  const mouse = useRef({ x: null, y: null }); // Use ref for mouse position
  const time = useRef(0); // Use ref for animation time
  const energyLines = useRef([]); // Use ref for energy lines
  const activePulses = useRef([]); // Use ref for active hover pulses
  const hoveredNodeId = useRef(null); // Use ref to track the currently hovered node ID
  const hoveredLineId = useRef(null); // Use ref to track the currently hovered line
  const neighborMap = useRef(new Map()); // Use ref to store neighbor lists for each node
  const forceResetHighlightNodeId = useRef(null); // Ref to signal forced reset
  const [nodeCount, setNodeCount] = useState(65); // Initialize with largest default

  // ===============================================
  // CONFIGURABLE PARAMETERS (MOVED OUTSIDE useEffect)
  // ===============================================
  const MIN_NODE_DISTANCE = 90;
  const CONNECTION_RADIUS = 200;
  const LIGHTNING_INTERVAL = 2000;
  const LIGHTNING_SEGMENTS = 8;
  const MAX_LIGHTNING_DISTANCE = 250;
  const LIGHTNING_FADE_SPEED = 0.03;
  const WAVE_SPEED = 0.015;
  const NODE_HOVER_RADIUS = 60;
  const LINE_HOVER_RADIUS = 30;
  const SPOTLIGHT_INTENSITY = 0.8;
  const BOLT_SPEED = 0.08;
  const PULSE_MAX_RADIUS = 60;
  const PULSE_EXPANSION_SPEED = 1.5;
  const PULSE_LINE_WIDTH = 2;
  const PULSE_COLOR_ALPHA = 0.8;

  const calculateNodeCount = useCallback(() => {
    const screenWidth = window.innerWidth;
    console.log(`Calculating node count for width: ${screenWidth}`);
    if (screenWidth < 768) {
      return 20; // Phone
    } else if (screenWidth < 1024) {
      return 35; // Tablet
    } else if (screenWidth < 1440) {
      return 50; // Small Laptop
    } else {
      return 65; // Large Laptop/Desktop
    }
  }, []);

  // Helper: distance
  function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  // Helper to calculate and store neighbors for each node
  const calculateNeighbors = useCallback(() => {
      neighborMap.current.clear();
      if (nodes.current.length < 2) return;

      for (let i = 0; i < nodes.current.length; i++) {
          const nodeA = nodes.current[i];
          const neighbors = [];
          for (let j = 0; j < nodes.current.length; j++) {
              if (i === j) continue; // Skip self
              const nodeB = nodes.current[j];
              const distAB = dist(nodeA.baseX, nodeA.baseY, nodeB.baseX, nodeB.baseY);
              if (distAB < CONNECTION_RADIUS) {
                  neighbors.push(nodeB.id);
              }
          }
          neighborMap.current.set(nodeA.id, neighbors);
      }
      console.log("calculateNeighbors completed."); // Log neighbor calculation end
  }, []); // No dependencies needed here

  // ===============================================
  // NODE SETUP (Uses nodeCount state)
  // ===============================================
  const setupNodes = useCallback((count) => {
      nodes.current = [];
      const width = networkCanvasRef.current?.width ?? window.innerWidth;
      const height = networkCanvasRef.current?.height ?? window.innerHeight;

      // Use count in the loop condition
      for (let i = 0; i < count; i++) { 
        let x, y;
        let attempts = 0;
        let placed = false;

        while (attempts < 5000 && !placed) {
          x = Math.random() * width;
          y = Math.random() * height;

          let tooClose = false;
          for (const node of nodes.current) { 
            if (dist(x, y, node.baseX, node.baseY) < MIN_NODE_DISTANCE) {
              tooClose = true;
              break;
            }
          }

          if (!tooClose) {
            nodes.current.push({ 
              baseX: x, 
              baseY: y, 
              id: i,
              highlightIntensity: 0 
            });
            placed = true;
          }
          attempts++;
        }

        if (!placed) {
          console.warn(`Could not place node #${i + 1}; stopping early at ${nodes.current.length} nodes.`);
          break; 
        }
      }
      calculateNeighbors(); // Call the defined function
  }, [calculateNeighbors]); // Add calculateNeighbors dependency

  // Memoized resize handler (NOW DEFINED AFTER setupNodes)
  const handleResize = useCallback(() => {
    const networkCanvas = networkCanvasRef.current;
    if (!networkCanvas) return;

    networkCanvas.width = window.innerWidth;
    networkCanvas.height = window.innerHeight;

    // Recalculate node count and reset nodes
    const newCount = calculateNodeCount();
    setNodeCount(newCount);
    console.log(`Resized - Recalculated node count: ${newCount}`);
    setupNodes(newCount);
    console.log("Resize setupNodes completed.");

  }, [calculateNodeCount, setupNodes]); // Dependencies remain the same

  // ===============================================
  // MOUSE HANDLING (MOVED OUTSIDE useEffect, wrapped in useCallback)
  // ===============================================
  const handleMouseMove = useCallback((e) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
  }, []); // No dependencies needed as it only uses refs

  // ===============================================
  // TOUCH HANDLING (MOVED OUTSIDE useEffect, wrapped in useCallback)
  // ===============================================
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length > 0) {
      mouse.current.x = e.touches[0].clientX;
      mouse.current.y = e.touches[0].clientY;
    }
  }, []); // No dependencies needed

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      mouse.current.x = e.touches[0].clientX;
      mouse.current.y = e.touches[0].clientY;
    }
  }, []); // No dependencies needed

  const handleTouchEnd = useCallback((e) => {
    // Clear position and current hover state
    mouse.current.x = null;
    mouse.current.y = null;
    hoveredNodeId.current = null;
    hoveredLineId.current = null;
    console.log("TouchEnd: Cleared mouse/hover state.");
  }, []); // No dependencies needed

  // Function to spawn a periodic pulse (MOVED OUTSIDE useEffect)
  const spawnPeriodicPulse = useCallback(() => {
    // Use PERIODIC_PULSE constants from global scope
    if (hoveredNodeId.current !== null) {
      const node = nodes.current.find(n => n.id === hoveredNodeId.current);
      if (node) {
        // Uses WAVE_AMPLITUDE from global scope
        const waveX = node.baseX + Math.sin(time.current + node.id) * WAVE_AMPLITUDE;
        const waveY = node.baseY + Math.cos(time.current + node.id) * WAVE_AMPLITUDE;
        activePulses.current.push({
          nodeId: node.id,
          startX: waveX,
          startY: waveY,
          currentRadius: 0,
          alpha: PERIODIC_PULSE_COLOR_ALPHA,
          maxRadius: PERIODIC_PULSE_MAX_RADIUS,
          expansionSpeed: PERIODIC_PULSE_EXPANSION_SPEED,
          lineWidth: PERIODIC_PULSE_LINE_WIDTH
        });
      }
    }
  }, []); // Relies on refs and stable constants

  // Animation Loop (MOVED OUTSIDE useEffect, wrapped in useCallback)
  const draw = useCallback(() => {
    const networkCanvas = networkCanvasRef.current;
    const ctx = networkCanvas?.getContext('2d');
    if (!networkCanvas || !ctx) {
      console.error("Canvas or context not available in draw loop");
      return; // Exit if canvas/context isn't ready
    }

    try {
      time.current += WAVE_SPEED;
      ctx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);

      // --- Update Hovered Line ---
      let currentFrameHoveredLineId = null;
      if (mouse.current.x && mouse.current.y) {
          let minDistToLine = LINE_HOVER_RADIUS;
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
                      const A = { x: waveAx, y: waveAy };
                      const B = { x: waveBx, y: waveBy };
                      const M = { x: mouse.current.x, y: mouse.current.y };
                      const distToLine = pointToLineDistance(M, A, B);
                      if (distToLine < minDistToLine) {
                          minDistToLine = distToLine;
                          currentFrameHoveredLineId = `${nodeA.id}-${nodeB.id}`;
                      }
                  }
              }
          }
      }
      hoveredLineId.current = currentFrameHoveredLineId;

      // --- Update Hovered Node ---
      let currentFrameHoveredId = null;
      if (mouse.current.x && mouse.current.y) {
          let minDist = NODE_HOVER_RADIUS;
          for (const node of nodes.current) {
              const waveX = node.baseX + Math.sin(time.current + node.id) * WAVE_AMPLITUDE;
              const waveY = node.baseY + Math.cos(time.current + node.id) * WAVE_AMPLITUDE;
              const distToMouse = dist(waveX, waveY, mouse.current.x, mouse.current.y);
              if (distToMouse < minDist) {
                 minDist = distToMouse;
                 currentFrameHoveredId = node.id;
              }
          }
      }
      hoveredNodeId.current = currentFrameHoveredId;

      // --- Get Neighbors of Hovered Node ---
      const neighbors = hoveredNodeId.current !== null
          ? neighborMap.current.get(hoveredNodeId.current) || []
          : [];
      const neighborSet = new Set(neighbors);

      // --- Update Node Highlight Intensity ---
      for (const node of nodes.current) {
          if (node.id === forceResetHighlightNodeId.current) {
              node.highlightIntensity = 0;
              forceResetHighlightNodeId.current = null;
          } else {
              let targetIntensity = 0;
              if (node.id === hoveredNodeId.current) {
                  targetIntensity = 1;
              } else if (neighborSet.has(node.id)) {
                  targetIntensity = 0.35;
              } else if (hoveredLineId.current) {
                  const [fromId, toId] = hoveredLineId.current.split('-').map(Number);
                  if (node.id === fromId || node.id === toId) {
                      targetIntensity = 0.8;
                  }
              }
              node.highlightIntensity = targetIntensity;
          }
      }

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
            const nodeAIntensity = nodeA.highlightIntensity || 0;
            const nodeBIntensity = nodeB.highlightIntensity || 0;
            let lineHighlightIntensity = Math.max(0, Math.min(1, Math.max(nodeAIntensity, nodeBIntensity)));
            if (hoveredLineId.current === `${nodeA.id}-${nodeB.id}` || hoveredLineId.current === `${nodeB.id}-${nodeA.id}`) {
                lineHighlightIntensity = Math.max(lineHighlightIntensity, 0.8);
            }
            ctx.beginPath();
            ctx.moveTo(waveAx, waveAy);
            ctx.lineTo(waveBx, waveBy);
            const baseOpacity = 0.2;
            const baseLineWidth = 2.5;
            const highlightMultiplier = 1 + lineHighlightIntensity * 1.0;
            ctx.strokeStyle = `rgba(0, 225, 255, ${baseOpacity * highlightMultiplier})`;
            ctx.lineWidth = baseLineWidth * highlightMultiplier;
            ctx.shadowColor = `rgba(0, 225, 255, ${lineHighlightIntensity * 0.5})`;
            ctx.shadowBlur = 10 * lineHighlightIntensity;
            ctx.stroke();
          }
        }
      }

      // --- PASS 1.5: Draw Pulses ---
      ctx.save();
      for (let i = activePulses.current.length - 1; i >= 0; i--) {
        const pulse = activePulses.current[i];
        pulse.currentRadius += pulse.expansionSpeed; // Use pulse specific speed
        pulse.alpha = PERIODIC_PULSE_COLOR_ALPHA * (1 - pulse.currentRadius / pulse.maxRadius);
        const isValidPulse = typeof pulse.startX === 'number' && !isNaN(pulse.startX) &&
                             typeof pulse.startY === 'number' && !isNaN(pulse.startY) &&
                             typeof pulse.currentRadius === 'number' && !isNaN(pulse.currentRadius) &&
                             typeof pulse.alpha === 'number' && !isNaN(pulse.alpha) &&
                             typeof pulse.lineWidth === 'number' && !isNaN(pulse.lineWidth);

        if (isValidPulse && pulse.alpha > 0 && pulse.currentRadius < pulse.maxRadius) {
            ctx.beginPath();
            ctx.arc(pulse.startX, pulse.startY, pulse.currentRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 225, 255, ${pulse.alpha})`;
            ctx.lineWidth = pulse.lineWidth;
            ctx.stroke();
        } else {
            activePulses.current.splice(i, 1);
        }
      }
      ctx.restore();

      // --- PASS 2: Draw Nodes ---
      for (let i = 0; i < nodes.current.length; i++) {
        const node = nodes.current[i];
        const waveX = node.baseX + Math.sin(time.current + i) * WAVE_AMPLITUDE;
        const waveY = node.baseY + Math.cos(time.current + i) * WAVE_AMPLITUDE;
        const nodeHighlightIntensity = node.highlightIntensity || 0;
        if (nodeHighlightIntensity > 0.01) {
           console.log(`Draw Node ${node.id}: highlightIntensity = ${nodeHighlightIntensity}`);
        }
        const baseNodeRadius = 6;
        const nodeRadius = baseNodeRadius + (baseNodeRadius * 0.5 * nodeHighlightIntensity);
        const nodeShadowBlur = 20 * nodeHighlightIntensity;
        const nodeShadowAlpha = nodeHighlightIntensity * 0.8;
        ctx.beginPath();
        ctx.arc(waveX, waveY, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 225, 255, 1)';
        ctx.shadowColor = `rgba(0, 225, 255, ${nodeShadowAlpha})`;
        ctx.shadowBlur = nodeShadowBlur;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Check for Hover and Trigger Pulses
        if (mouse.current.x && mouse.current.y) {
          const distToMouse = dist(waveX, waveY, mouse.current.x, mouse.current.y);
          if (distToMouse < NODE_HOVER_RADIUS) {
            const pulseExists = activePulses.current.some(p => p.nodeId === node.id);
            if (!pulseExists) {
              activePulses.current.push({
                nodeId: node.id,
                startX: waveX,
                startY: waveY,
                currentRadius: 0,
                alpha: PERIODIC_PULSE_COLOR_ALPHA,
                maxRadius: PERIODIC_PULSE_MAX_RADIUS,
                expansionSpeed: PERIODIC_PULSE_EXPANSION_SPEED,
                lineWidth: PERIODIC_PULSE_LINE_WIDTH
              });
            }
          }
        }
      }

      // 3) LIGHTNING / ENERGY LINES
      for (let i = energyLines.current.length - 1; i >= 0; i--) {
        const energyLine = energyLines.current[i];
        let shouldRemove = false;
        if (energyLine.progress < 1) {
          energyLine.progress += BOLT_SPEED;
          energyLine.progress = Math.min(energyLine.progress, 1);
        } else {
          energyLine.alpha -= LIGHTNING_FADE_SPEED;
          if (energyLine.alpha <= 0) {
            shouldRemove = true;
          }
        }
        const fromNode = nodes.current.find(n => n.id === energyLine.fromId);
        const toNode = nodes.current.find(n => n.id === energyLine.toId);
        if (!fromNode || !toNode) {
          shouldRemove = true;
        }
        if (shouldRemove) {
          energyLines.current.splice(i, 1);
          continue;
        }
        const fromWaveX = fromNode.baseX + Math.sin(time.current + fromNode.id) * WAVE_AMPLITUDE;
        const fromWaveY = fromNode.baseY + Math.cos(time.current + fromNode.id) * WAVE_AMPLITUDE;
        const toWaveX = toNode.baseX + Math.sin(time.current + toNode.id) * WAVE_AMPLITUDE;
        const toWaveY = toNode.baseY + Math.cos(time.current + toNode.id) * WAVE_AMPLITUDE;
        const path = [];
        path.push({ x: fromWaveX, y: fromWaveY });
        const dx = toWaveX - fromWaveX;
        const dy = toWaveY - fromWaveY;
        const distTotal = Math.hypot(dx, dy);
        const segments = Math.max(2, Math.floor(distTotal / 15));
        const JAGGEDNESS = 0.18;
        if (distTotal > 1) {
            const perpX = -dy / distTotal;
            const perpY = dx / distTotal;
            for (let k = 1; k < segments; k++) {
                const t = k / segments;
                const midX = fromWaveX + dx * t;
                const midY = fromWaveY + dy * t;
                const displacementScale = Math.sin(t * Math.PI);
                const displacement = (Math.random() - 0.5) * distTotal * JAGGEDNESS * displacementScale;
                path.push({ x: midX + perpX * displacement, y: midY + perpY * displacement });
            }
        }
        path.push({ x: toWaveX, y: toWaveY });

        // Helper to calculate path length (needs to be accessible here)
        // Could be defined outside or passed in if needed elsewhere
        function getPathLength(path) {
            let length = 0;
            for (let i = 0; i < path.length - 1; i++) {
                length += dist(path[i].x, path[i].y, path[i+1].x, path[i+1].y);
            }
            return length;
        }

        if (path.length < 2) continue;
        const totalPathLength = getPathLength(path);
        if (totalPathLength < 1) continue;

        ctx.save();
        ctx.strokeStyle = `rgba(200, 240, 255, ${energyLine.alpha})`;
        ctx.lineWidth = 1 + energyLine.alpha * 1.5;
        ctx.shadowColor = `rgba(150, 220, 255, ${energyLine.alpha * 0.7})`;
        ctx.shadowBlur = 15 + 10 * energyLine.alpha;
        ctx.lineCap = 'round';
        ctx.setLineDash([totalPathLength, totalPathLength]);
        ctx.lineDashOffset = totalPathLength * (1 - energyLine.progress);
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let j = 1; j < path.length; j++) {
          ctx.lineTo(path[j].x, path[j].y);
        }
        ctx.stroke();
        ctx.restore();
      }

    } catch (error) {
        console.error("Error during canvas draw:", error);
    }

    // Request next frame - IMPORTANT: Use a ref to store the ID
    // animationFrameId = requestAnimationFrame(draw); // This would recursively call the useCallback version
    // Instead, the useEffect will handle the loop
  }, [/* Dependencies: Add any props/state used. Constants/Refs are okay */]);

  // Main Effect for setup, listeners, and starting animation loop
  useEffect(() => {
    let animationFrameId = null; // ID for cancellation
    let isMounted = true; // Flag to prevent calls after unmount

    const networkCanvas = networkCanvasRef.current;
    if (!networkCanvas) return;
    console.log("useEffect running, canvas ref exists.");

    const ctx = networkCanvas.getContext('2d');
    if (!ctx) {
        console.error("Failed to get 2D context");
        return;
    }
    console.log("Got 2D context.");

    // --- Call handleResize initially to set correct canvas dimensions ---
    // This will set canvas width/height and call setupNodes for the first time.
    handleResize();
    // --- End Initial Resize ---

    // Reset refs (Keep this *after* initial handleResize)
    // setupNodes is called within handleResize, so nodes.current is handled.
    // We only need to reset time and potentially clear lines/pulses if needed.
    time.current = 0;
    activePulses.current = []; // Reset pulses
    energyLines.current = []; // Reset lines

    // Initial node placement is now handled by the initial handleResize call above
    /*
    nodes.current = []; // This is done in setupNodes
    const initialNodeCount = calculateNodeCount();
    setNodeCount(initialNodeCount);
    console.log(`Initial node count: ${initialNodeCount}`);
    setupNodes(initialNodeCount);
    console.log("Initial setupNodes completed.");
    */


    // Energy line spawning
    function spawnEnergyLine() {
      if (!isMounted || nodes.current.length < 2) return;
      const fromNodeIndex = Math.floor(Math.random() * nodes.current.length);
      const fromNode = nodes.current[fromNodeIndex];
      const nearbyNodeIndices = [];
      for (let i = 0; i < nodes.current.length; i++) {
          if (i === fromNodeIndex) continue;
          const potentialToNode = nodes.current[i];
          const distance = dist(fromNode.baseX, fromNode.baseY, potentialToNode.baseX, potentialToNode.baseY);
          if (distance > 0 && distance < MAX_LIGHTNING_DISTANCE) {
              nearbyNodeIndices.push(i);
          }
      }
      if (nearbyNodeIndices.length === 0) return;
      const toNodeIndex = nearbyNodeIndices[Math.floor(Math.random() * nearbyNodeIndices.length)];
      const toNode = nodes.current[toNodeIndex];
      energyLines.current.push({ fromId: fromNode.id, toId: toNode.id, alpha: 1, progress: 0 });
    }
    const lightningTimer = setInterval(spawnEnergyLine, LIGHTNING_INTERVAL);

    // Add window event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
    window.addEventListener('resize', handleResize); // Listener remains

    // Animation loop runner
    function runAnimation() {
      if (!isMounted) return; // Stop loop if unmounted
      draw(); // Call the memoized draw function
      animationFrameId = requestAnimationFrame(runAnimation);
    }

    console.log("Starting initial animation frame...");
    runAnimation(); // Start the loop

    // Cleanup function
    return () => {
      console.log("Cleaning up InteractiveNetwork effect");
      isMounted = false; // Set flag
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      clearInterval(lightningTimer);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  // Dependencies remain the same
  }, [handleResize, calculateNodeCount, setupNodes, calculateNeighbors, handleMouseMove, handleTouchStart, handleTouchMove, handleTouchEnd, draw ]);

  // Separate Effect for the periodic pulse timer
  useEffect(() => {
    // ... unchanged pulse timer effect ...
  }, [spawnPeriodicPulse]);

  // Helper function to calculate distance from point to line segment
  function pointToLineDistance(P, A, B) {
    const { x: px, y: py } = P;
    const { x: ax, y: ay } = A;
    const { x: bx, y: by } = B;
    
    const abx = bx - ax;
    const aby = by - ay;
    const abLen = Math.hypot(abx, aby);
    
    if (abLen === 0) return Math.hypot(px - ax, py - ay);
    
    // Calculate projection of point onto line
    const t = ((px - ax) * abx + (py - ay) * aby) / (abLen * abLen);
    
    // If projection is outside segment, use distance to nearest endpoint
    if (t < 0) return Math.hypot(px - ax, py - ay);
    if (t > 1) return Math.hypot(px - bx, py - by);
    
    // Calculate perpendicular distance to line
    const projx = ax + t * abx;
    const projy = ay + t * aby;
    return Math.hypot(px - projx, py - projy);
  }

  console.log("InteractiveNetwork component function end - returning JSX");
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