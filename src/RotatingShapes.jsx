import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const RotatingShapes = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // Create rotating shapes
    const shapes = [];
    for (let i = 0; i < 6; i++) {
      const shapeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const shapeMaterial = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
      });
      const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);

      // Position shapes in a circle
      const angle = (i / 6) * Math.PI * 2;
      shape.position.set(
        Math.cos(angle) * 3,
        Math.sin(angle) * 3,
        Math.random() - 0.5
      );

      shapes.push(shape);
      scene.add(shape);
    }

    camera.position.z = 8;

    // GSAP Animation
    gsap.to(shapes.map((shape) => shape.rotation), {
      x: "+=6.28", // Rotate around X-axis
      y: "+=6.28", // Rotate around Y-axis
      repeat: -1,
      duration: 5,
      ease: "linear",
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      shapes.forEach((shape) => scene.remove(shape));
    };
  }, []);

  return <div ref={containerRef} className="w-full h-[400px]" />;
};

export default RotatingShapes;
