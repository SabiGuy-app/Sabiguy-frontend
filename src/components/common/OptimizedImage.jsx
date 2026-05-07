import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Lazy loading by default
 * - Async decoding to prevent main thread blocking
 * - Smooth fade-in animation on load
 * - Fallback to original if optimized version fails
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  priority = false,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Determine the optimized path
  // Assumes optimized images are in /home/optimized/ and are .webp
  const getOptimizedSrc = (originalSrc) => {
    if (originalSrc.startsWith('/home/') && !originalSrc.includes('/optimized/')) {
      const fileName = originalSrc.split('/').pop().split('.')[0];
      return `/home/optimized/${fileName}.webp`;
    }
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-100 animate-pulse z-10"
          />
        )}
      </AnimatePresence>
      
      <motion.img
        src={error ? src : optimizedSrc}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`w-full h-full object-cover ${isLoaded ? '' : 'invisible'}`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
