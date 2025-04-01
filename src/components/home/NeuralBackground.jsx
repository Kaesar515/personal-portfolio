import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NeuralBackground = () => {
  const mountRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const particles = useRef([]);
  const connections = useRef([]);
  const time = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.0);
    mountRef.current.appendChild(renderer.domElement);

    // Create particles in a grid
    const particleGeometry = new THREE.SphereGeometry(0.08, 32, 32);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
    });

    // Create grid of particles
    const gridSize = { x: 10, y: 6 };
    const spacing = { x: 1.5, y: 1.5 };
    
    for (let i = 0; i < gridSize.x; i++) {
      for (let j = 0; j < gridSize.y; j++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        
        // Calculate grid position with more significant random offset
        const randomOffset = {
          x: (Math.random() - 0.5) * spacing.x * 0.8, // Increased random offset
          y: (Math.random() - 0.5) * spacing.y * 0.8  // Increased random offset
        };
        
        particle.position.set(
          (i - gridSize.x / 2) * spacing.x + randomOffset.x,
          (j - gridSize.y / 2) * spacing.y + randomOffset.y,
          0
        );
        
        // Store original position for reference
        particle.userData.originalPosition = particle.position.clone();
        particle.userData.scale = 1;
        
        scene.add(particle);
        particles.current.push(particle);
      }
    }

    // Create electric connections with longer maximum distance
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3,
    });

    // Connect nearby particles with increased connection distance
    particles.current.forEach((particle1, i) => {
      particles.current.slice(i + 1).forEach(particle2 => {
        const distance = particle1.position.distanceTo(particle2.position);
        if (distance < 2.5) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            particle1.position,
            particle2.position,
          ]);
          const line = new THREE.Line(geometry, lineMaterial.clone());
          scene.add(line);
          connections.current.push({
            line,
            particle1,
            particle2,
            baseOpacity: 0.15 + Math.random() * 0.15,
          });
        }
      });
    });

    camera.position.z = 8;

    // Mouse move handler
    const handleMouseMove = (event) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time.current += 0.015;

      // Update particles
      particles.current.forEach((particle) => {
        // Convert mouse position to world coordinates
        const mouseVector = new THREE.Vector3(
          mousePosition.current.x * 8,
          mousePosition.current.y * 4,
          0
        );
        
        const distanceToMouse = particle.position.distanceTo(mouseVector);
        const mouseInfluence = 1 - Math.min(distanceToMouse / 2, 1);
        
        // Scale particle based on mouse proximity
        const targetScale = 1 + mouseInfluence * 0.5;
        particle.userData.scale += (targetScale - particle.userData.scale) * 0.1;
        particle.scale.set(
          particle.userData.scale,
          particle.userData.scale,
          particle.userData.scale
        );

        // Subtle ambient movement
        const originalPos = particle.userData.originalPosition;
        particle.position.x = originalPos.x + Math.sin(time.current + originalPos.y) * 0.05;
        particle.position.y = originalPos.y + Math.cos(time.current + originalPos.x) * 0.05;
      });

      // Update connections
      connections.current.forEach(({ line, particle1, particle2, baseOpacity }) => {
        const points = [particle1.position, particle2.position];
        line.geometry.setFromPoints(points);

        // Calculate electric effect with increased intensity
        const electricEffect = Math.sin(time.current * 3 + particle1.position.x + particle2.position.y) * 0.6 + 0.6;
        
        // Mouse proximity effect on connections
        const mouseVector = new THREE.Vector3(
          mousePosition.current.x * 8,
          mousePosition.current.y * 4,
          0
        );
        const avgDistanceToMouse = (
          particle1.position.distanceTo(mouseVector) +
          particle2.position.distanceTo(mouseVector)
        ) / 2;
        const mouseInfluence = 1 - Math.min(avgDistanceToMouse / 2, 1);

        // Combine base opacity, electric effect, and mouse influence with increased intensity
        line.material.opacity = (baseOpacity + electricEffect * 0.3) * (1 + mouseInfluence * 1.2);
        
        // Color variation based on electric effect with increased brightness
        const hue = 0.5 + electricEffect * 0.15;
        line.material.color.setHSL(hue, 1, 0.6);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full opacity-0 animate-[fadeIn_1.5s_ease-in_forwards]"
      style={{
        zIndex: 0,
      }}
    />
  );
};

export default NeuralBackground; 