import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(`Failed to load: ${src}`);
    document.head.appendChild(script);
  });
}

async function main() {
  await loadScript("https://aframe.io/releases/1.2.0/aframe.min.js");
  await loadScript("https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.min.js");

  console.log("AFRAME version:", (window as any).AFRAME?.version);
  console.log("AFRAME.components['arjs-camera']:", (window as any).AFRAME?.components?.['arjs-camera']);

  createRoot(document.getElementById("root")!).render(<App />);
}

main().catch(console.error);
