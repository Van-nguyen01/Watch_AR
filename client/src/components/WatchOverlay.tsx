import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function WatchOverlay({ wrist, modelUrl }: { wrist: {x: number, y: number, z: number} | null, modelUrl: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || !modelUrl) return;
    let renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.z = 2;

    let light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(light);

    let model: THREE.Object3D | undefined;
    const loader = new GLTFLoader();
    loader.load(modelUrl, gltf => {
      const loadedModel = gltf.scene;
      loadedModel.scale.set(0.5, 0.5, 0.5);
      scene.add(loadedModel);
      model = loadedModel;
    });

    function animate() {
      requestAnimationFrame(animate);
      if (model && wrist) {
        // Chuyển đổi tọa độ cổ tay sang vị trí trên canvas
        // (Cần tinh chỉnh lại cho đúng vị trí cổ tay trên video)
        model.position.x = (wrist.x - 0.5) * 2; // từ [0,1] sang [-1,1]
        model.position.y = -(wrist.y - 0.5) * 2;
        model.rotation.z += 0.01; // Xoay thử, bạn có thể dùng hướng cổ tay thực tế
      }
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelUrl, wrist]);

  return <div ref={mountRef} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", width: "100vw", height: "100vh", zIndex: 2 }} />;
}