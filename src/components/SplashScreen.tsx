"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Check if we've already shown the splash screen in this session
    const hasShown = sessionStorage.getItem("nauka_splash_shown");
    if (hasShown) {
      setShow(false);
      return;
    }

    // Set the flag in session storage
    sessionStorage.setItem("nauka_splash_shown", "true");

    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 2000);

    // Completely unmount after 3 seconds (2s hold + 1s fade)
    const unmountTimer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative w-48 h-48 md:w-64 md:h-64 animate-splash-logo">
        <Image 
          src="/logo.jpeg" 
          alt="Nauka Logo" 
          fill 
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
