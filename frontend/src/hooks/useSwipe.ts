import { useRef, useEffect } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface TouchPosition {
  x: number;
  y: number;
}

export function useSwipe(handlers: SwipeHandlers) {
  const ref = useRef<HTMLDivElement>(null);
  const startPos = useRef<TouchPosition>({ x: 0, y: 0 });
  const isSwipe = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
      isSwipe.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipe.current) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - startPos.current.x);
        const deltaY = Math.abs(touch.clientY - startPos.current.y);
        
        // Consider it a swipe if movement is more than 10px
        if (deltaX > 10 || deltaY > 10) {
          isSwipe.current = true;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwipe.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startPos.current.x;
      const deltaY = touch.clientY - startPos.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Minimum swipe distance (50px)
      const minSwipeDistance = 50;

      if (absDeltaX > minSwipeDistance || absDeltaY > minSwipeDistance) {
        // Determine swipe direction
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers]);

  return ref;
}