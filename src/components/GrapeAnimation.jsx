import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../assets/Illustrations/Animation 01/drawkit-grape-animation-1-LOOP.json'

const GrapeAnimation = () => {
  const animationContainer = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: animationContainer.current, 
      renderer: 'svg', 
      loop: true,
      autoplay: true, 
      animationData: animationData, 
    });

    return () => {
      animation.destroy(); 
    };
  }, []);

  return (
    <div
      ref={animationContainer}
      className="w-64 h-80 mx-auto" // Tailwind classes for styling
    ></div>
  );
};

export default GrapeAnimation;
