import React, { useRef, useEffect, useCallback } from 'react';

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

    console.log("useEffect running, canvas ref exists."); // Log effect start

    const ctx = networkCanvas.getContext('2d');
    if (!ctx) {
        console.error("Failed to get 2D context");
        return; // Stop if context fails
    }
    console.log("Got 2D context.");

    // Initial setup
    handleResize(); // Set initial size

    // --- Dynamically set node count based on screen width ---
    const screenWidth = window.innerWidth; 
    const dynamicNodes = screenWidth < 768 ? 20 : 70; // Less nodes on small screens
    // --- END: Dynamic node count ---

    // ===============================================
    // CONFIGURABLE PARAMETERS
    // ===============================================
    // const NODES = 70; // total nodes - Commented out, using dynamicNodes now
    const MIN_NODE_DISTANCE = 90; 
    const CONNECTION_RADIUS = 200;
    const LIGHTNING_INTERVAL = 2000; // Lowered from 10000ms (6 seconds)
    const LIGHTNING_SEGMENTS = 8; // Base segments, actual calculation is dynamic
    const MAX_LIGHTNING_DISTANCE = 250; // Max distance for lightning connection
    const LIGHTNING_FADE_SPEED = 0.03; // Increased from 0.01 (faster fade)
    const WAVE_SPEED = 0.015; // Increased from 0.01 (faster node oscillation)
    const NODE_HOVER_RADIUS = 60; // Increased radius for spotlight effect
    const LINE_HOVER_RADIUS = 30; // Increased radius for spotlight effect
    const SPOTLIGHT_INTENSITY = 0.8; // How bright the spotlight effect is (Used for highlight now)
    const BOLT_SPEED = 0.08; // How fast the bolt head travels (0 to 1)
    const PULSE_MAX_RADIUS = 60; // Max radius of the hover pulse
    const PULSE_EXPANSION_SPEED = 1.5; // How fast the pulse radius grows
    const PULSE_LINE_WIDTH = 2;
    const PULSE_COLOR_ALPHA = 0.8; // Initial alpha of the pulse

    // Reset refs used within setup/draw
    nodes.current = [];
    energyLines.current = [];
    activePulses.current = []; // Reset pulses on setup
    time.current = 0;

    // Helper: distance
    function dist(x1, y1, x2, y2) {
      return Math.hypot(x2 - x1, y2 - y1);
    }

    // ===============================================
    // NODE SETUP (uses dynamicNodes)
    // ===============================================
    function setupNodes() {
        nodes.current = []; 
        const width = networkCanvasRef.current?.width ?? window.innerWidth;
        const height = networkCanvasRef.current?.height ?? window.innerHeight;

        // Use dynamicNodes in the loop condition
        for (let i = 0; i < dynamicNodes; i++) { 
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
        calculateNeighbors();
    }

    // Helper to calculate and store neighbors for each node
    function calculateNeighbors() {
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
    }

    setupNodes(); // Initial node placement & neighbor calculation
    console.log("setupNodes completed (includes neighbor calc)."); // Log setup end

    // ===============================================
    // ENERGY (LIGHTNING) LINES (adapt to use refs)
    // ===============================================
    function spawnEnergyLine() {
      if (nodes.current.length < 2) return;

      const fromNodeIndex = Math.floor(Math.random() * nodes.current.length);
      const fromNode = nodes.current[fromNodeIndex];

      // Find potential nearby nodes
      const nearbyNodeIndices = [];
      for (let i = 0; i < nodes.current.length; i++) {
          if (i === fromNodeIndex) continue; // Skip self

          const potentialToNode = nodes.current[i];
          const distance = dist(fromNode.baseX, fromNode.baseY, potentialToNode.baseX, potentialToNode.baseY);

          if (distance > 0 && distance < MAX_LIGHTNING_DISTANCE) {
              nearbyNodeIndices.push(i);
          }
      }

      // Only spawn if nearby nodes are found
      if (nearbyNodeIndices.length === 0) {
          // Optional: console.log("No nearby nodes found for lightning spark.");
          return; // Skip spawning this time
      }

      // Select a random nearby node
      const toNodeIndex = nearbyNodeIndices[Math.floor(Math.random() * nearbyNodeIndices.length)];
      const toNode = nodes.current[toNodeIndex];

      // Store node IDs, initial alpha, and progress
      energyLines.current.push({
        fromId: fromNode.id,
        toId: toNode.id,
        alpha: 1,
        progress: 0 // Start progress at 0
      });
    }
    // Spawn one immediately for testing if desired
    // spawnEnergyLine();

    const lightningTimer = setInterval(spawnEnergyLine, LIGHTNING_INTERVAL);

    // ===============================================
    // MOUSE HANDLING (Keep existing)
    // ===============================================
    function handleMouseMove(e) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }
    window.addEventListener('mousemove', handleMouseMove);

    // ===============================================
    // TOUCH HANDLING
    // ===============================================
    function handleTouchStart(e) {
      // Set initial position on touch start
      if (e.touches.length > 0) {
        mouse.current.x = e.touches[0].clientX;
        mouse.current.y = e.touches[0].clientY;
      }
    }

    function handleTouchMove(e) {
      if (e.touches.length > 0) {
        mouse.current.x = e.touches[0].clientX;
        mouse.current.y = e.touches[0].clientY;
      }
    }

    function handleTouchEnd(e) {
      // Capture the last hovered node ID *before* clearing (optional, maybe not needed now)
      // const lastHoveredNodeId = hoveredNodeId.current;

      // Clear position and current hover state
      mouse.current.x = null;
      mouse.current.y = null;
      hoveredNodeId.current = null;
      hoveredLineId.current = null;

      // Remove the force reset mechanism - let the draw loop handle it based on cleared state
      /*
      if (lastHoveredNodeId !== null) {
        console.log(`TouchEnd: Signaling reset for node ${lastHoveredNodeId}`); // DEBUG LOG
        forceResetHighlightNodeId.current = lastHoveredNodeId;
      }
      */
      console.log("TouchEnd: Cleared mouse/hover state."); // Add a log to confirm state clearing
    }

    // Add touch listeners to the window
    const canvasElement = networkCanvasRef.current;
    window.addEventListener('touchstart', handleTouchStart, { passive: true }); 
    window.addEventListener('touchmove', handleTouchMove, { passive: true }); // Restore passive: true
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    // Helper function to calculate path length
    function getPathLength(path) {
        let length = 0;
        for (let i = 0; i < path.length - 1; i++) {
            // Use the existing dist function
            length += dist(path[i].x, path[i].y, path[i+1].x, path[i+1].y);
        }
        return length;
    }

    // Easing function (ease-out quadratic)
    function easeOutQuad(t) {
        return t * (2 - t);
    }

    // ===============================================
    // ANIMATION LOOP (adapt to use refs)
    // ===============================================
    let animationFrameId;
    function draw() {
      try {
        time.current += WAVE_SPEED;
        ctx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);

        // --- Update Hovered Line --- (Do this before node hover check)
        let currentFrameHoveredLineId = null;
        if (mouse.current.x && mouse.current.y) {
            let minDistToLine = LINE_HOVER_RADIUS;
            
            // Check each line for hover
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
                        // Calculate distance from mouse to line segment
                        const A = { x: waveAx, y: waveAy };
                        const B = { x: waveBx, y: waveBy };
                        const M = { x: mouse.current.x, y: mouse.current.y };
                        
                        // Calculate distance from point to line segment
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

        // --- Update Hovered Node --- (Keep existing node hover detection)
        let currentFrameHoveredId = null;
        if (mouse.current.x && mouse.current.y) {
            let minDist = NODE_HOVER_RADIUS; // Use hover radius as initial min distance
            for (const node of nodes.current) {
                const waveX = node.baseX + Math.sin(time.current + node.id) * WAVE_AMPLITUDE;
                const waveY = node.baseY + Math.cos(time.current + node.id) * WAVE_AMPLITUDE;
                const distToMouse = dist(waveX, waveY, mouse.current.x, mouse.current.y);
                // Simplify hover check: Just use NODE_HOVER_RADIUS
                if (distToMouse < minDist /* && distToMouse < (6 + node.highlightIntensity * 6) */) { // Base radius 6
                   minDist = distToMouse;
                   currentFrameHoveredId = node.id;
                }
            }
        }
        hoveredNodeId.current = currentFrameHoveredId; // Update the ref

        // --- Get Neighbors of Hovered Node ---
        const neighbors = hoveredNodeId.current !== null
            ? neighborMap.current.get(hoveredNodeId.current) || []
            : [];
        const neighborSet = new Set(neighbors);

        // --- Update Node Highlight Intensity ---
        for (const node of nodes.current) {
            // Check if this node needs an immediate highlight reset
            if (node.id === forceResetHighlightNodeId.current) {
                node.highlightIntensity = 0;
                forceResetHighlightNodeId.current = null; // Reset the flag
            } else {
                // --- Simplified Direct Setting (No Easing) ---
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
                // Directly set the intensity without easing
                node.highlightIntensity = targetIntensity; 
                // --- End Simplified Direct Setting ---
            }
        }

        // --- PASS 1: Draw Connections (Lines) --- (Apply highlight)
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

              /* --- START: Commented Out Hover Effect (Lines) ---
              // Calculate spotlight intensity (0 to 1) and apply easing
              const rawIntensity = Math.max(0, 1 - (distToMouse / LINE_HOVER_RADIUS));
              const easedIntensity = easeOutQuad(rawIntensity);
              */

              // Determine line highlight based on connected nodes or direct hover
              const nodeAIntensity = nodeA.highlightIntensity || 0;
              const nodeBIntensity = nodeB.highlightIntensity || 0;
              let lineHighlightIntensity = Math.max(0, Math.min(1, Math.max(nodeAIntensity, nodeBIntensity)));
              
              // Add direct line hover highlight
              if (hoveredLineId.current === `${nodeA.id}-${nodeB.id}` || hoveredLineId.current === `${nodeB.id}-${nodeA.id}`) {
                  lineHighlightIntensity = Math.max(lineHighlightIntensity, 0.8); // Direct line hover intensity
              }

              ctx.beginPath();
              ctx.moveTo(waveAx, waveAy);
              ctx.lineTo(waveBx, waveBy);

              // Apply smoothed spotlight effect
              const baseOpacity = 0.2;
              const baseLineWidth = 2.5;
              /* --- START: Commented Out Line Hover Effect ---
              const finalOpacity = baseOpacity + (SPOTLIGHT_INTENSITY - baseOpacity) * easedIntensity; // Lerp opacity
              const finalLineWidth = 2.5 + (3 * easedIntensity); // Smooth width change
              const finalShadowBlur = 15 * easedIntensity; // Smooth shadow blur
              const finalShadowAlpha = easedIntensity * 0.8; // Smooth shadow alpha

              ctx.strokeStyle = `rgba(0, 225, 255, ${finalOpacity})`;
              ctx.shadowColor = `rgba(0, 225, 255, ${finalShadowAlpha})`;
              ctx.shadowBlur = finalShadowBlur;
              ctx.lineWidth = finalLineWidth;
              */
              // --- Apply Highlight Style ---
              const highlightMultiplier = 1 + lineHighlightIntensity * 1.0; // Increase width/opacity
              ctx.strokeStyle = `rgba(0, 225, 255, ${baseOpacity * highlightMultiplier})`;
              ctx.lineWidth = baseLineWidth * highlightMultiplier;
              // Optional: Add shadow for highlighted lines
              ctx.shadowColor = `rgba(0, 225, 255, ${lineHighlightIntensity * 0.5})`;
              ctx.shadowBlur = 10 * lineHighlightIntensity;
              // --- END: Commented Out Line Hover Effect ---

              ctx.stroke();
              // ctx.shadowBlur = 0; // Already reset above
            }
          }
        }

        // --- PASS 1.5: Draw Pulses --- (Draw pulses before nodes)
        ctx.save();
        for (let i = activePulses.current.length - 1; i >= 0; i--) {
          const pulse = activePulses.current[i];

          // Update pulse state
          pulse.currentRadius += pulse.expansionSpeed; // Use pulse specific speed
          // Fade alpha based on radius expansion
          pulse.alpha = PERIODIC_PULSE_COLOR_ALPHA * (1 - pulse.currentRadius / pulse.maxRadius); // Use pulse specific maxRadius

          // Draw pulse - ADD CHECKS
          const isValidPulse = typeof pulse.startX === 'number' && !isNaN(pulse.startX) &&
                               typeof pulse.startY === 'number' && !isNaN(pulse.startY) &&
                               typeof pulse.currentRadius === 'number' && !isNaN(pulse.currentRadius) &&
                               typeof pulse.alpha === 'number' && !isNaN(pulse.alpha) &&
                               typeof pulse.lineWidth === 'number' && !isNaN(pulse.lineWidth);

          if (isValidPulse && pulse.alpha > 0 && pulse.currentRadius < pulse.maxRadius) { // Use pulse specific maxRadius
              ctx.beginPath();
              ctx.arc(pulse.startX, pulse.startY, pulse.currentRadius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(0, 225, 255, ${pulse.alpha})`;
              ctx.lineWidth = pulse.lineWidth; // Use pulse specific width
              ctx.stroke();
          } else {
              // Remove pulse if faded or too large
              activePulses.current.splice(i, 1);
          }
        }
        ctx.restore();

        // --- PASS 2: Draw Nodes --- 
        for (let i = 0; i < nodes.current.length; i++) {
          const node = nodes.current[i];
          const waveX = node.baseX + Math.sin(time.current + i) * WAVE_AMPLITUDE;
          const waveY = node.baseY + Math.cos(time.current + i) * WAVE_AMPLITUDE;

          // Calculate distance to mouse for spotlight effect
          const distToMouse = mouse.current.x && mouse.current.y 
            ? dist(waveX, waveY, mouse.current.x, mouse.current.y)
            : Infinity;

          /* --- START: Commented Out Hover Effect (Nodes) ---
          // Calculate spotlight intensity (0 to 1) and apply easing
          const rawNodeIntensity = Math.max(0, 1 - (distToMouse / NODE_HOVER_RADIUS));
          const easedNodeIntensity = easeOutQuad(rawNodeIntensity);

          // Apply smoothed spotlight effect
          const baseNodeRadius = 6;
          const maxNodeRadiusIncrease = 6;
          const nodeRadius = baseNodeRadius + (maxNodeRadiusIncrease * easedNodeIntensity);
          const nodeShadowBlur = 20 * easedNodeIntensity;
          const nodeShadowAlpha = easedNodeIntensity * 0.8;
          */
          // --- Apply Node Highlight ---
          const nodeHighlightIntensity = node.highlightIntensity || 0; // Default to 0 if invalid
          if (nodeHighlightIntensity > 0.01) { // Log intensity just before drawing if > 0.01
             console.log(`Draw Node ${node.id}: highlightIntensity = ${nodeHighlightIntensity}`); // DEBUG LOG 2
          }
          const baseNodeRadius = 6;
          const nodeRadius = baseNodeRadius + (baseNodeRadius * 0.5 * nodeHighlightIntensity); // Node scales up slightly
          const nodeShadowBlur = 20 * nodeHighlightIntensity;
          const nodeShadowAlpha = nodeHighlightIntensity * 0.8;
          // --- END: Commented Out Hover Effect (Nodes) ---

          ctx.beginPath();
          ctx.arc(waveX, waveY, nodeRadius, 0, Math.PI * 2);
          // Fill with solid color, opacity handled by shadow/glow
          ctx.fillStyle = 'rgba(0, 225, 255, 1)';
          ctx.shadowColor = `rgba(0, 225, 255, ${nodeShadowAlpha})`; // Smooth shadow alpha
          ctx.shadowBlur = nodeShadowBlur; // Smooth shadow blur
          ctx.fill();
          ctx.shadowBlur = 0;

          // --- Check for Hover and Trigger Pulses ---
          if (mouse.current.x && mouse.current.y) {
            const distToMouse = dist(waveX, waveY, mouse.current.x, mouse.current.y);

            if (distToMouse < NODE_HOVER_RADIUS) {
              // Check if a pulse for this node is already active
              const pulseExists = activePulses.current.some(p => p.nodeId === node.id);
              if (!pulseExists) {
                // Trigger a new pulse
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

          // --- Update Progress and Fading ---
          let shouldRemove = false;
          if (energyLine.progress < 1) {
            energyLine.progress += BOLT_SPEED;
            energyLine.progress = Math.min(energyLine.progress, 1); // Clamp progress to 1
          } else {
            // Once progress reaches 1, start fading the whole bolt
            energyLine.alpha -= LIGHTNING_FADE_SPEED; // Use existing fade speed
            if (energyLine.alpha <= 0) {
              shouldRemove = true;
            }
          }

          // --- Find Nodes ---
          const fromNode = nodes.current.find(n => n.id === energyLine.fromId);
          const toNode = nodes.current.find(n => n.id === energyLine.toId);

          if (!fromNode || !toNode) {
            shouldRemove = true; // Remove if nodes are gone
          }

          if (shouldRemove) {
            energyLines.current.splice(i, 1);
            continue;
          }

          // --- Calculate Dynamic Path ---
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

          // --- Draw using strokeDashoffset ---
          if (path.length < 2) continue;

          const totalPathLength = getPathLength(path); // Calculate length

          if (totalPathLength < 1) continue; // Avoid issues with zero length

          ctx.save(); // Save context state

          // Style for electricity
          ctx.strokeStyle = `rgba(200, 240, 255, ${energyLine.alpha})`;
          ctx.lineWidth = 1 + energyLine.alpha * 1.5;
          ctx.shadowColor = `rgba(150, 220, 255, ${energyLine.alpha * 0.7})`;
          ctx.shadowBlur = 15 + 10 * energyLine.alpha;
          ctx.lineCap = 'round'; // Looks better for dashed lines

          // Set the dash pattern to reveal the line
          // Dash length = path length, Gap length = path length
          ctx.setLineDash([totalPathLength, totalPathLength]);
          // Offset starts at totalPathLength (fully hidden) and moves to 0 (fully visible)
          // as progress goes from 0 to 1.
          ctx.lineDashOffset = totalPathLength * (1 - energyLine.progress);

          // Draw the complete path
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let j = 1; j < path.length; j++) {
            ctx.lineTo(path[j].x, path[j].y);
          }
          ctx.stroke();

          ctx.restore(); // Restore context state (removes dash settings, shadow, linecap, etc.)

          // Old drawing code (removed/replaced by dash offset logic)
          /*
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let j = 1; j < path.length; j++) {
            ctx.lineTo(path[j].x, path[j].y);
          }
          ctx.strokeStyle = `rgba(200, 240, 255, ${energyLine.alpha})`;
          ctx.lineWidth = 1 + energyLine.alpha * 1.5;
          ctx.shadowColor = `rgba(150, 220, 255, ${energyLine.alpha * 0.7})`;
          ctx.shadowBlur = 15 + 10 * energyLine.alpha;
          ctx.stroke();
          ctx.shadowBlur = 0; // Reset shadow for next elements
          */

          // Old fade logic (handled earlier now)
          /*
          energyLine.alpha -= LIGHTNING_FADE_SPEED;
          if (energyLine.alpha <= 0) {
            energyLines.current.splice(i, 1); // Remove faded line
          }
          */
        }

      } catch (error) {
          console.error("Error during canvas draw:", error);
          // Optionally stop the loop if errors persist
          // cancelAnimationFrame(animationFrameId);
          // return; 
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    console.log("Starting initial animation frame..."); // Log before initial draw call
    draw(); // Start animation loop

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      // Remove touch listeners from window on cleanup
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);

      clearInterval(lightningTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [handleResize]); // Rerun effect if handleResize changes (it won't due to useCallback)

  // Function to spawn a periodic pulse from the hovered node
  const spawnPeriodicPulse = useCallback(() => {
    if (hoveredNodeId.current !== null) {
      const node = nodes.current.find(n => n.id === hoveredNodeId.current);
      if (node) {
        // Use current wave position for pulse origin
        const waveX = node.baseX + Math.sin(time.current + node.id) * WAVE_AMPLITUDE;
        const waveY = node.baseY + Math.cos(time.current + node.id) * WAVE_AMPLITUDE;
        activePulses.current.push({
          nodeId: node.id, // Keep track if needed, though not strictly necessary now
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
  }, []); // Empty dependency array - relies on refs

  // Set up the interval timer for periodic pulses
  useEffect(() => {
    const pulseTimer = setInterval(spawnPeriodicPulse, PERIODIC_PULSE_INTERVAL);
    // Cleanup: clear interval on unmount
    return () => clearInterval(pulseTimer);
  }, [spawnPeriodicPulse]); // Re-run if spawnPeriodicPulse changes (it won't due to useCallback)

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

  console.log("InteractiveNetwork component function end - returning JSX"); // Log component end
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