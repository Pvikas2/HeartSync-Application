"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MovingNoButton({ onYes, onNo, question }) {
  // Calculate initial position (slightly to the right of YES button)
  const getInitialPosition = () => {
    if (typeof window !== 'undefined') {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      return { 
        x: centerX, // 100px to the right of center
        y: centerY   // Slightly above center
      };
    }
    return { x: 400, y: 300 }; // Fallback for SSR
  };

  const [noButtonPosition, setNoButtonPosition] = useState(getInitialPosition());
  const [attempts, setAttempts] = useState(0);

  // EXACT ORDER: Starts with "Please no 😭" FIRST
  const funnyMessages = [
    "Please no 😭",
    "I'm gonna cry 🥺", 
    "Don't do this to me 💔",
    "This could be a mistake!",
    "Think again 😊"
  ];

  const moveNoButton = () => {
    // Convert rem to pixels (1rem = 16px)
    const remToPx = 16;
    const movementRem = 15; // Move 15rem each time
    const movementPx = movementRem * remToPx; // 15rem = 240px
    
    // Get viewport center as reference point
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    const buttonWidth = 120;
    
    // Pattern: Down → Up → Left → Right (repeats)
    const movePattern = attempts % 4; // 0, 1, 2, 3, then loops
    
    let newX = noButtonPosition.x;
    let newY = noButtonPosition.y;
    
    switch(movePattern) {
      case 0: // First click: Move DOWN 15rem
        newY = centerY + movementPx;
        newX = centerX;
        break;
        
      case 1: // Second click: Move UP 30rem (from bottom to top)
        newY = centerY - movementPx;
        newX = centerX;
        break;
        
      case 2: // Third click: Move LEFT 15rem
        newX = centerX - movementPx;
        newY = centerY;
        break;
        
      case 3: // Fourth click: Move RIGHT 30rem (from left to right)
        newX = centerX + movementPx;
        newY = centerY;
        break;
    }
    
    // Ensure button stays within safe bounds
    newX = Math.max(20, Math.min(newX, viewportWidth - buttonWidth - 20));
    newY = Math.max(100, Math.min(newY, viewportHeight - 100));
    
    setNoButtonPosition({ x: newX, y: newY });
    setAttempts(prev => prev + 1);
  };

  const handleNoHover = () => {
    moveNoButton();
  };

  const handleNoClick = () => {
    moveNoButton();
  };

  // Get current message (loops through the array)
  const getCurrentMessage = () => {
    if (attempts === 0) return null;
    return funnyMessages[(attempts - 1) % funnyMessages.length];
  };

  return (
    <div 
      style={{
        position: "relative",
        minHeight: "350px",
        width: "100%",
        padding: "2rem",
        background: "linear-gradient(135deg, rgba(255,182,193,0.1), rgba(255,240,245,0.1))",
        borderRadius: "30px",
        marginTop: "2rem"
      }}
    >
      {/* Question Text */}
      <div style={{
        textAlign: "center",
        marginBottom: "3rem"
      }}>
        <h3 style={{
          fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
          color: "#333",
          marginBottom: "0.5rem",
          fontWeight: "700",
          lineHeight: "1.3"
        }}>
          {question.replace('?', '')}? 💖 💕
        </h3>
        <p style={{
          fontSize: "0.9rem",
          color: "#999",
          fontStyle: "italic"
        }}>
          Choose wisely. (The "No" button is... shy.)
        </p>
      </div>

      {/* Funny Message Display - Shows current message */}
      <AnimatePresence mode="wait">
        {getCurrentMessage() && (
          <motion.div
            key={attempts}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              padding: "1rem 1.5rem",
              background: "rgba(255,255,255,0.9)",
              borderRadius: "20px",
              border: "2px solid #ffb6c1",
              boxShadow: "0 5px 20px rgba(255,182,193,0.3)",
              maxWidth: "300px",
              margin: "0 auto 2rem auto"
            }}
          >
            <span style={{
              fontSize: "1.1rem",
              color: "#ff69b4",
              fontWeight: "600"
            }}>
              {getCurrentMessage()}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YES Button Container - Only YES button here */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100px"
      }}>
        {/* YES Button - Static and prominent */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onYes}
          style={{
            padding: "1.2rem 3rem",
            background: "linear-gradient(135deg, #ff6b9d, #c44569)",
            border: "none",
            borderRadius: "50px",
            color: "#fff",
            fontSize: "1.3rem",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(255,107,157,0.4)",
            zIndex: 10,
            position: "relative"
          }}
        >
          YES 💖
        </motion.button>
      </div>

      {/* Floating Hearts Animation */}
      <div style={{
        position: "absolute",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "1rem",
        fontSize: "2rem",
        opacity: 0.3,
        pointerEvents: "none"
      }}>
        <motion.span
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          💕
        </motion.span>
        <motion.span
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        >
          💖
        </motion.span>
        <motion.span
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6
          }}
        >
          💗
        </motion.span>
      </div>

      {/* NO Button - FIXED POSITION, moves across ENTIRE VIEWPORT */}
      <motion.button
        animate={{ 
          top: noButtonPosition.y,
          left: noButtonPosition.x
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseEnter={handleNoHover}
        onTouchStart={handleNoHover}
        onClick={handleNoClick}
        style={{
          position: "fixed", // FIXED to viewport
          padding: "0.9rem 2rem",
          background: "rgba(200,200,200,0.95)",
          border: "2px solid #ddd",
          borderRadius: "50px",
          color: "#666",
          fontSize: "1.1rem",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
          zIndex: 999999, // MAXIMUM z-index - above EVERYTHING
          userSelect: "none",
          pointerEvents: "auto",
          willChange: "top, left" // Performance optimization
        }}
      >
        NO
      </motion.button>
    </div>
  );
}
