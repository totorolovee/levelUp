import { useRef, useState, type PointerEvent, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  isRussian: boolean;
};

export function HorizontalGameCarousel({ children, isRussian }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
    };
    track.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !trackRef.current) return;
    const distance = drag.current.startX - event.clientX;
    if (Math.abs(distance) > 5) drag.current.moved = true;
    trackRef.current.scrollLeft = drag.current.scrollLeft + distance;
  };

  const stopDrag = (event: PointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    if (trackRef.current?.hasPointerCapture(event.pointerId)) {
      trackRef.current.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * .72, behavior: 'smooth' });
  };

  return (
    <div className="game-carousel">
      <button
        aria-label={isRussian ? 'Предыдущие игры' : 'Previous games'}
        className="carousel-arrow previous"
        onClick={() => scroll(-1)}
        type="button"
      >‹</button>
      <div
        className={isDragging ? 'game-carousel-track dragging' : 'game-carousel-track'}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
          }
        }}
        onPointerCancel={stopDrag}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        ref={trackRef}
      >
        {children}
      </div>
      <button
        aria-label={isRussian ? 'Следующие игры' : 'Next games'}
        className="carousel-arrow next"
        onClick={() => scroll(1)}
        type="button"
      >›</button>
    </div>
  );
}
