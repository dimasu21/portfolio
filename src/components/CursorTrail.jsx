import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CursorTrail = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouch();

    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main cursor dot */}
          <motion.div
            className="fixed pointer-events-none z-[9999] mix-blend-difference"
            animate={{
              x: mousePosition.x - 8,
              y: mousePosition.y - 8,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 28,
              mass: 0.5,
            }}
          >
            <div className="w-4 h-4 bg-white rounded-full" />
          </motion.div>

          {/* Trailing glow effect */}
          <motion.div
            className="fixed pointer-events-none z-[9998]"
            animate={{
              x: mousePosition.x - 20,
              y: mousePosition.y - 20,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 15,
              mass: 0.8,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/30 to-teal-500/30 blur-md" />
          </motion.div>

          {/* Outer ring */}
          <motion.div
            className="fixed pointer-events-none z-[9997]"
            animate={{
              x: mousePosition.x - 24,
              y: mousePosition.y - 24,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 1,
            }}
          >
            <div className="w-12 h-12 rounded-full border border-blue-400/20" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CursorTrail;
