import React, { useRef, useEffect } from "react";

export default function CameraFeed({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement> }) {
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      style={{ width: "100vw", height: "100vh", objectFit: "cover", position: "absolute", top: 0, left: 0, zIndex: 1 }}
    />
  );
}