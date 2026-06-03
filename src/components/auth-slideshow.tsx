"use client";

import { useState, useEffect } from "react";

const SLIDES = [
  "/assets/IMG_8651.jpg",
  "/assets/IMG_9965.jpg",
  "/assets/auth-brushes.png",
];

export function AuthSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {SLIDES.map((src, i) => (
        <div
          key={src}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.5s ease",
          }}
        />
      ))}
    </div>
  );
}
