import React, { useRef, useEffect, useCallback, useState } from 'react';

// --- Global Constants for Effects ---
const PERIODIC_PULSE_INTERVAL = 15000;
const PERIODIC_PULSE_MAX_RADIUS = 120;
const PERIODIC_PULSE_EXPANSION_SPEED = 1.0;
const PERIODIC_PULSE_LINE_WIDTH = 2;
const PERIODIC_PULSE_COLOR_ALPHA = 0.4;
const WAVE_AMPLITUDE = 8;

function InteractiveNetwork() {
  const networkCanvasRef = useRef(null);
  const nodes = useRef([]);
  const mouse = useRef({ x: null, y: null });
  const time = useRef(0);
  const energyLines = useRef([]);
  const activePulses = useRef([]);
  const hoveredNodeId = useRef(null);
  const hoveredLineId = useRef(null);
  const neighborMap = useRef(new Map());
  const forceResetHighlightNodeId = useRef(null);
  const [nodeCount, setNodeCount] = useState(65);

  // ===============================================
  // CONFIGURABLE PARAMETERS
  // ===============================================
  const MIN_NODE_DISTANCE = 90;
  const CONNECTION_RADIUS = 220;
  const LIGHTNING_INTERVAL = 800; // Faster electricity arcs
  const MAX_LIGHTNING_DISTANCE = 350;
  const LIGHTNING_FADE_SPEED = 0.05; // Fade out sharper
  const WAVE_SPEED = 0.008; // Slower, more ominous baseline movement
  const NODE_HOVER_RADIUS = 80;
  const LINE_HOVER_RADIUS = 40;
  const BOLT_SPEED = 0.15; // Faster strikes

  const calculateNodeCount = useCallback(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) return 25;
    if (screenWidth < 1024) return 40;
    if (screenWidth < 1440) return 60;
    return 80; // slightly denser network for an electric feel
  }, []);

  function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  const calculateNeighbors = useCallback(() => {
    neighborMap.current.clear();
    if (nodes.current.length < 2) return;

    for (let i = 0; i < nodes.current.length; i++) {
      const nodeA = nodes.current[i];
      const neighbors = [];
      for (let j = 0; j < nodes.current.length; j++) {
        if (i === j) continue;
        const nodeB = nodes.current[j];
        if (dist(nodeA.baseX, nodeA.baseY, nodeB.baseX, nodeB.baseY) < CONNECTION_RADIUS) {
          neighbors.push(nodeB.id);
        }
      }
      neighborMap.current.set(nodeA.id, neighbors);
    }
  }, [CONNECTION_RADIUS]);

  const setupNodes = useCallback((count) => {
    nodes.current = [];
    const width = networkCanvasRef.current?.width ?? window.innerWidth;
    const height = networkCanvasRef.current?.height ?? window.innerHeight;

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
          nodes.current.push({ baseX: x, baseY: y, id: i, highlightIntensity: 0 });
          placed = true;
        }
        attempts++;
      }
      if (!placed) break;
    }
    calculateNeighbors();
  }, [MIN_NODE_DISTANCE, calculateNeighbors]);

  const handleResize = useCallback(() => {
    const networkCanvas = networkCanvasRef.current;
    if (!networkCanvas) return;
    networkCanvas.width = window.innerWidth;
    networkCanvas.height = window.innerHeight;
    const newCount = calculateNodeCount();
    setNodeCount(newCount);
    setupNodes(newCount);
  }, [calculateNodeCount, setupNodes]);

  const handleMouseMove = useCallback((e) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length > 0) {
      mouse.current.x = e.touches[0].clientX;
      mouse.current.y = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      mouse.current.x = e.touches[0].clientX;
      mouse.current.y = e.touches[0].clientY;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    mouse.current.x = null;
    mouse.current.y = null;
    hoveredNodeId.current = null;
    hoveredLineId.current = null;
  }, []);

  const spawnPeriodicPulse = useCallback(() => {
    if (hoveredNodeId.current !== null) {
      const node = nodes.current.find(n => n.id === hoveredNodeId.current);
      if (node) {
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
  }, []);

  const draw = useCallback(() => {
    const networkCanvas = networkCanvasRef.current;
    const ctx = networkCanvas?.getContext('2d');
    if (!networkCanvas || !ctx) return;

    try {
      time.current += WAVE_SPEED;
      ctx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);

      // PRE-CALCULATE DYNAMIC POSITIONS FOR ALL NODES
      const computedNodes = nodes.current.map((node) => {
        let x = node.baseX + Math.sin(time.current + node.id) * WAVE_AMPLITUDE;
        let y = node.baseY + Math.cos(time.current + node.id) * WAVE_AMPLITUDE;

        // Static electricity magnetic pull towards mouse
        if (mouse.current.x && mouse.current.y) {
          const dx = mouse.current.x - x;
          const dy = mouse.current.y - y;
          const distToMouse = Math.hypot(dx, dy);
          const pullRadius = 250;

          if (distToMouse < pullRadius && distToMouse > 0) {
            const pullStrength = Math.pow(1 - distToMouse / pullRadius, 2) * 25;
            x += (dx / distToMouse) * pullStrength;
            y += (dy / distToMouse) * pullStrength;
          }
        }
        return { ...node, cx: x, cy: y };
      });

      let currentFrameHoveredLineId = null;
      let currentFrameHoveredId = null;

      if (mouse.current.x && mouse.current.y) {
        let minDistToLine = LINE_HOVER_RADIUS;
        let minDistToNode = NODE_HOVER_RADIUS;

        for (let i = 0; i < computedNodes.length; i++) {
          const nodeA = computedNodes[i];
          const distToMouse = dist(nodeA.cx, nodeA.cy, mouse.current.x, mouse.current.y);
          if (distToMouse < minDistToNode) {
            minDistToNode = distToMouse;
            currentFrameHoveredId = nodeA.id;
          }

          for (let j = i + 1; j < computedNodes.length; j++) {
            const nodeB = computedNodes[j];
            const distAB = dist(nodeA.cx, nodeA.cy, nodeB.cx, nodeB.cy);
            if (distAB < CONNECTION_RADIUS) {
              const A = { x: nodeA.cx, y: nodeA.cy };
              const B = { x: nodeB.cx, y: nodeB.cy };
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
      hoveredNodeId.current = currentFrameHoveredId;

      const neighbors = hoveredNodeId.current !== null
        ? neighborMap.current.get(hoveredNodeId.current) || []
        : [];
      const neighborSet = new Set(neighbors);

      // Sync intensity back to refs or calculate on the fly
      for (let i = 0; i < computedNodes.length; i++) {
        const node = nodes.current[i];
        if (node.id === forceResetHighlightNodeId.current) {
          node.highlightIntensity = 0;
          forceResetHighlightNodeId.current = null;
        } else {
          let targetIntensity = 0;
          if (node.id === hoveredNodeId.current) targetIntensity = 1;
          else if (neighborSet.has(node.id)) targetIntensity = 0.4;
          else if (hoveredLineId.current) {
            const [fromId, toId] = hoveredLineId.current.split('-').map(Number);
            if (node.id === fromId || node.id === toId) targetIntensity = 0.8;
          }
          // Smooth transition
          node.highlightIntensity += (targetIntensity - (node.highlightIntensity || 0)) * 0.1;
          computedNodes[i].highlightIntensity = node.highlightIntensity;
        }
      }

      // --- PASS 1: Draw Electric Connections ---
      for (let i = 0; i < computedNodes.length; i++) {
        const nodeA = computedNodes[i];
        for (let j = i + 1; j < computedNodes.length; j++) {
          const nodeB = computedNodes[j];
          const distAB = dist(nodeA.cx, nodeA.cy, nodeB.cx, nodeB.cy);
          if (distAB < CONNECTION_RADIUS) {
            const nodeAIntensity = nodeA.highlightIntensity || 0;
            const nodeBIntensity = nodeB.highlightIntensity || 0;
            let lineHighlightIntensity = Math.max(0, Math.min(1, Math.max(nodeAIntensity, nodeBIntensity)));
            if (hoveredLineId.current === `${nodeA.id}-${nodeB.id}` || hoveredLineId.current === `${nodeB.id}-${nodeA.id}`) {
              lineHighlightIntensity = Math.max(lineHighlightIntensity, 0.9);
            }

            const distAlpha = 1 - (distAB / CONNECTION_RADIUS);
            const baseOpacity = 0.15 * distAlpha;

            // Render basic faint structural line
            ctx.beginPath();
            ctx.moveTo(nodeA.cx, nodeA.cy);
            ctx.lineTo(nodeB.cx, nodeB.cy);
            ctx.strokeStyle = `rgba(0, 200, 255, ${baseOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Render occasional electricity jitter line
            const isSparking = Math.random() > 0.985 || lineHighlightIntensity > 0.5;
            if (isSparking && distAB > 20) {
              ctx.beginPath();
              ctx.moveTo(nodeA.cx, nodeA.cy);
              const driftX = (Math.random() - 0.5) * 8 * (1 + lineHighlightIntensity);
              const driftY = (Math.random() - 0.5) * 8 * (1 + lineHighlightIntensity);
              ctx.lineTo((nodeA.cx + nodeB.cx) / 2 + driftX, (nodeA.cy + nodeB.cy) / 2 + driftY);
              ctx.lineTo(nodeB.cx, nodeB.cy);
              ctx.strokeStyle = `rgba(180, 240, 255, ${(baseOpacity * 3 + lineHighlightIntensity) * 0.7})`;
              ctx.lineWidth = 1.5 + lineHighlightIntensity;
              ctx.shadowColor = `rgba(0, 225, 255, ${lineHighlightIntensity + 0.3})`;
              ctx.shadowBlur = isSparking ? 8 : 0;
              ctx.stroke();
              ctx.shadowBlur = 0; // reset
            }
          }
        }
      }

      // --- PASS 1.5: Draw Pulses ---
      ctx.save();
      for (let i = activePulses.current.length - 1; i >= 0; i--) {
        const pulse = activePulses.current[i];
        pulse.currentRadius += pulse.expansionSpeed;
        pulse.alpha = PERIODIC_PULSE_COLOR_ALPHA * (1 - pulse.currentRadius / pulse.maxRadius);
        if (pulse.alpha > 0 && pulse.currentRadius < pulse.maxRadius) {
          ctx.beginPath();
          ctx.arc(pulse.startX, pulse.startY, pulse.currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(100, 240, 255, ${pulse.alpha})`;
          ctx.lineWidth = pulse.lineWidth;
          ctx.stroke();
        } else {
          activePulses.current.splice(i, 1);
        }
      }
      ctx.restore();

      // --- PASS 2: Draw Nodes ---
      for (let i = 0; i < computedNodes.length; i++) {
        const node = computedNodes[i];
        const highlight = node.highlightIntensity || 0;

        ctx.beginPath();
        const nodeRadius = 2.5 + (2.5 * highlight);
        ctx.arc(node.cx, node.cy, nodeRadius, 0, Math.PI * 2);

        // Crisp pale core with a bright blue glow
        ctx.fillStyle = `rgba(220, 250, 255, ${0.8 + highlight * 0.2})`;
        ctx.shadowColor = `rgba(0, 180, 255, ${0.4 + highlight * 0.6})`;
        ctx.shadowBlur = 8 + 20 * highlight;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Pulse triggered by hover
        if (mouse.current.x && mouse.current.y) {
          if (dist(node.cx, node.cy, mouse.current.x, mouse.current.y) < NODE_HOVER_RADIUS) {
            const pulseExists = activePulses.current.some(p => p.nodeId === node.id);
            if (!pulseExists) {
              activePulses.current.push({
                nodeId: node.id,
                startX: node.cx,
                startY: node.cy,
                currentRadius: 0,
                alpha: PERIODIC_PULSE_COLOR_ALPHA,
                maxRadius: PERIODIC_PULSE_MAX_RADIUS,
                expansionSpeed: PERIODIC_PULSE_EXPANSION_SPEED * 1.5, // Faster on hover
                lineWidth: PERIODIC_PULSE_LINE_WIDTH
              });
            }
          }
        }
      }

      // --- PASS 3: Lightning/Energy Lines ---
      for (let i = energyLines.current.length - 1; i >= 0; i--) {
        const energyLine = energyLines.current[i];
        let shouldRemove = false;

        if (energyLine.progress < 1) {
          energyLine.progress += BOLT_SPEED;
          energyLine.progress = Math.min(energyLine.progress, 1);
        } else {
          energyLine.alpha -= LIGHTNING_FADE_SPEED;
          if (energyLine.alpha <= 0) shouldRemove = true;
        }

        const fromNode = computedNodes.find(n => n.id === energyLine.fromId);
        const toNode = computedNodes.find(n => n.id === energyLine.toId);

        if (!fromNode || !toNode) shouldRemove = true;
        if (shouldRemove) {
          energyLines.current.splice(i, 1);
          continue;
        }

        const dx = toNode.cx - fromNode.cx;
        const dy = toNode.cy - fromNode.cy;
        const distTotal = Math.hypot(dx, dy);
        const segments = Math.max(3, Math.floor(distTotal / 12)); // tighter segments
        const JAGGEDNESS = 0.25;

        const path = [{ x: fromNode.cx, y: fromNode.cy }];
        if (distTotal > 1) {
          const perpX = -dy / distTotal;
          const perpY = dx / distTotal;
          for (let k = 1; k < segments; k++) {
            const t = k / segments;
            const midX = fromNode.cx + dx * t;
            const midY = fromNode.cy + dy * t;
            // More chaotic center
            const displacement = (Math.random() - 0.5) * distTotal * JAGGEDNESS * Math.sin(t * Math.PI);
            path.push({ x: midX + perpX * displacement, y: midY + perpY * displacement });
          }
        }
        path.push({ x: toNode.cx, y: toNode.cy });

        let totalPathLength = 0;
        for (let j = 0; j < path.length - 1; j++) {
          totalPathLength += dist(path[j].x, path[j].y, path[j + 1].x, path[j + 1].y);
        }
        if (totalPathLength < 1) continue;

        ctx.save();
        ctx.lineCap = 'round';
        ctx.setLineDash([totalPathLength, totalPathLength]);
        ctx.lineDashOffset = totalPathLength * (1 - energyLine.progress);

        // Outer Blue Glow
        ctx.strokeStyle = `rgba(0, 200, 255, ${energyLine.alpha * 0.8})`;
        ctx.lineWidth = 3 + energyLine.alpha * 2;
        ctx.shadowColor = `rgba(50, 220, 255, ${energyLine.alpha})`;
        ctx.shadowBlur = 15 + 10 * energyLine.alpha;

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let j = 1; j < path.length; j++) ctx.lineTo(path[j].x, path[j].y);
        ctx.stroke();

        // Inner White Core
        ctx.strokeStyle = `rgba(255, 255, 255, ${energyLine.alpha})`;
        ctx.lineWidth = 1 + energyLine.alpha;
        ctx.shadowBlur = 0;
        ctx.stroke();

        ctx.restore();
      }

    } catch (error) {
      console.error("Error drawing network:", error);
    }
  }, [CONNECTION_RADIUS, LINE_HOVER_RADIUS, NODE_HOVER_RADIUS, BOLT_SPEED, LIGHTNING_FADE_SPEED]);

  useEffect(() => {
    let animationFrameId = null;
    let isMounted = true;

    const networkCanvas = networkCanvasRef.current;
    if (!networkCanvas) return;
    const ctx = networkCanvas.getContext('2d');
    if (!ctx) return;

    handleResize();
    time.current = 0;
    activePulses.current = [];
    energyLines.current = [];

    function spawnEnergyLine() {
      if (!isMounted || nodes.current.length < 2 || document.hidden) return;
      const fromNodeIndex = Math.floor(Math.random() * nodes.current.length);
      const fromNode = nodes.current[fromNodeIndex];
      const nearbyNodeIndices = [];
      for (let i = 0; i < nodes.current.length; i++) {
        if (i === fromNodeIndex) continue;
        const potentialToNode = nodes.current[i];
        const distance = dist(fromNode.baseX, fromNode.baseY, potentialToNode.baseX, potentialToNode.baseY);
        // Only strike nearby nodes to keep it localized and realistic
        if (distance > 0 && distance < MAX_LIGHTNING_DISTANCE) {
          nearbyNodeIndices.push(i);
        }
      }
      if (nearbyNodeIndices.length === 0) return;

      // Spawn 1-3 bolts to mimic branching electricity
      const boltCount = Math.random() > 0.8 ? 2 : 1;
      for (let b = 0; b < boltCount; b++) {
        const toNodeIndex = nearbyNodeIndices[Math.floor(Math.random() * nearbyNodeIndices.length)];
        const toNode = nodes.current[toNodeIndex];
        energyLines.current.push({ fromId: fromNode.id, toId: toNode.id, alpha: 1, progress: 0 });
      }
    }

    // Slight randomization in bolt spawn intervals
    const sparkLoop = () => {
      if (!isMounted) return;
      spawnEnergyLine();
      setTimeout(sparkLoop, LIGHTNING_INTERVAL + (Math.random() - 0.5) * 400);
    };
    setTimeout(sparkLoop, LIGHTNING_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        energyLines.current = [];
        activePulses.current = [];
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
    window.addEventListener('resize', handleResize);
    window.addEventListener('visibilitychange', handleVisibilityChange);

    function runAnimation() {
      if (!isMounted) return;
      draw();
      animationFrameId = requestAnimationFrame(runAnimation);
    }
    runAnimation();

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [handleResize, handleMouseMove, handleTouchStart, handleTouchMove, handleTouchEnd, draw, LIGHTNING_INTERVAL, MAX_LIGHTNING_DISTANCE]);

  // Periodic slow pulse effect untouched, but wrapped cleanly
  useEffect(() => {
    const timer = setInterval(spawnPeriodicPulse, PERIODIC_PULSE_INTERVAL);
    return () => clearInterval(timer);
  }, [spawnPeriodicPulse]);

  function pointToLineDistance(P, A, B) {
    const abx = B.x - A.x;
    const aby = B.y - A.y;
    const abLen = Math.hypot(abx, aby);
    if (abLen === 0) return Math.hypot(P.x - A.x, P.y - A.y);
    const t = ((P.x - A.x) * abx + (P.y - A.y) * aby) / (abLen * abLen);
    if (t < 0) return Math.hypot(P.x - A.x, P.y - A.y);
    if (t > 1) return Math.hypot(P.x - B.x, P.y - B.y);
    const projx = A.x + t * abx;
    const projy = A.y + t * aby;
    return Math.hypot(P.x - projx, P.y - projy);
  }

  return (
    <div className="fixed inset-0 z-0">
      {/* Fallback dark bg just in case */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-[-1]" />
      <canvas
        ref={networkCanvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-auto"
      />
    </div>
  );
}

export default InteractiveNetwork;