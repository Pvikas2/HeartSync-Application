"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function MovingNoButton({ onYes, onNo, question }) {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const noButtonRef = useRef(null);
  const containerRef = useRef(null);

  const moveNoButton = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const maxX = container.width - 150; // Button width
    const maxY = container.height - 60; // Button height
    
    // Random position
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    setNoButtonPosition({ x: newX, y: newY });
    setAttempts(prev => prev + 1);
  };

  const handleNoHover = () => {
    moveNoButton();
  };

  const handleNoClick = () => {
    if (attempts > 5) {
      // After 6 attempts, show a sweet message
      alert("Aww, looks like you really want to say no! 💔 But we'll keep this answer as 'Maybe later?' 😊");
      onNo();
    } else {
      moveNoButton();
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "200px",
        width: "100%",
        padding: "2rem",
        background: "rgba(255,255,255,0.03)",
        borderRadius: "20px",
        marginTop: "2rem"
      }}
    >
      <div style={{
        textAlign: "center",
        marginBottom: "3rem"
      }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ fontSize: "4rem", marginBottom: "1rem" }}
        >
          💍
        </motion.div>
        <h3 style={{
          fontSize: "2rem",
          color: "#ff9800",
          marginBottom: "1rem",
          fontWeight: "700"
        }}>
          {question}
        </h3>
      </div>

      <div style={{
        display: "flex",
        gap: "2rem",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "120px"
      }}>
        {/* YES Button - Static, always accessible */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onYes}
          style={{
            padding: "1.2rem 3rem",
            background: "linear-gradient(135deg, #4caf50, #45a049)",
            border: "none",
            borderRadius: "50px",
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(76,175,80,0.4)",
            zIndex: 10
          }}
        >
          💚 YES! 💚
        </motion.button>

        {/* NO Button - Moves away on hover */}
        <motion.button
          ref={noButtonRef}
          animate={noButtonPosition}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          onMouseEnter={handleNoHover}
          onTouchStart={handleNoHover}
          onClick={handleNoClick}
          style={{
            position: "absolute",
            padding: "1rem 2rem",
            background: "rgba(244,67,54,0.8)",
            border: "none",
            borderRadius: "50px",
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 5px 20px rgba(244,67,54,0.3)",
            zIndex: 5
          }}
        >
          No 💔
        </motion.button>
      </div>

      {attempts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "#ff9800",
            fontSize: "1.1rem"
          }}
        >
          {attempts === 1 && "Oops! The button moved! 😅"}
          {attempts === 2 && "Hmm, trying again? 😏"}
          {attempts === 3 && "You really want to click No? 🥺"}
          {attempts === 4 && "Come on, YES is right there! 💕"}
          {attempts === 5 && "I believe in you! Choose YES! ✨"}
          {attempts > 5 && "Okay okay, you win! Click one more time if you really mean it... 💔"}
        </motion.div>
      )}
    </div>
  );
}