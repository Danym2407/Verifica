import React from 'react';
import { motion } from 'framer-motion';

const Gauge = ({ value, size = 200, label = "Autenticidad" }) => {
  // Determine color scheme based on value
  const getColor = (val) => {
    if (val >= 75) return { start: '#22c55e', end: '#15803d', text: 'text-green-600' }; // Green
    if (val >= 40) return { start: '#eab308', end: '#a16207', text: 'text-yellow-600' }; // Yellow
    return { start: '#ef4444', end: '#b91c1c', text: 'text-red-600' }; // Red
  };

  const colors = getColor(value);
  
  // Circle properties
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  // 270 degrees (3/4 circle), leaving 90 degrees open at bottom
  const arcLength = circumference * 0.75; 
  const strokeDasharray = `${arcLength} ${circumference}`;
  
  // Calculate offset
  // max offset (empty) = circumference
  // min offset (full 75%) = circumference - arcLength
  // We map 0-100 value to 0-arcLength range
  const offset = circumference - ((value / 100) * arcLength);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          className="rotate-[135deg] drop-shadow-md" 
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="0"
          />

          {/* Filled Track */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }} // Elastic spring effect
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={`text-4xl md:text-5xl font-bold ${colors.text}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {value}%
          </motion.span>
          <motion.span 
            className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {label}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default Gauge;