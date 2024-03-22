import { useState, useEffect } from 'react';

//  Custom Hook example
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    //  On page load invoke
    handleResize();

    // on window resize event
    //  Here is a chance of memory leak to occur as it's called inside useEffect hook
    window.addEventListener('resize', handleResize);

    const cleanUp = () => {
      console.log(`Runs if a useEffect dependency changes!`);
      window.removeEventListener('resize', handleResize);
    };

    return cleanUp;
  }, []);

  return windowSize;
};

export default useWindowSize;
