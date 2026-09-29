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
      setTimeout(() => setShow(false), 0);
      return;
    }

    // Set the flag in session storage
    sessionStorage.setItem("nauka_splash_shown", "true");

    // Start fade out at 2.4 seconds (exactly when the logo starts exploding)
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 2400);

    // Completely unmount after 3 seconds
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
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Immersive Blurred Background */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <Image 
          src="/logo.jpeg" 
          alt="Background Blur" 
          fill 
          className="object-cover blur-[100px] opacity-60 scale-125"
          priority
        />
        {/* Dark overlay to ensure the center logo still pops */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Center Logo Card */}
      <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 animate-splash-logo rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/50">
        <Image 
          src="/logo.jpeg" 
          alt="Nauka Logo" 
          fill 
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
