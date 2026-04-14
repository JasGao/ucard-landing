"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollMoveImage({
  startSectionId,
  endSectionId,
  src,
  alt,
  className = "",
  startOffset = 0,
  minTravel = 260,
  startViewportFactor = 0.12,
  endViewportFactor = 0.28,
  stopAtEndSectionOffset = -55,
}) {
  const [translateY, setTranslateY] = useState(startOffset);
  const imageRef = useRef(null);
  const initialDocTopRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      const startSection = document.getElementById(startSectionId);
      const endSection = document.getElementById(endSectionId);
      const imageElement = imageRef.current;
      if (!startSection || !endSection || !imageElement) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const startTop = startSection.offsetTop;
      const endTop = endSection.offsetTop;

      if (initialDocTopRef.current === null) {
        const rect = imageElement.getBoundingClientRect();
        initialDocTopRef.current = rect.top + scrollY - startOffset;
      }

      const startScroll = startTop - viewportHeight * startViewportFactor;
      const endScroll = endTop - viewportHeight * endViewportFactor;
      const progress = Math.max(
        0,
        Math.min(1, (scrollY - startScroll) / Math.max(1, endScroll - startScroll))
      );

      const travelDistance = Math.max(minTravel, endTop - startTop + 80);
      const targetTranslate = startOffset + progress * travelDistance;

      // Hard clamp movement when reaching desired position near section 4.
      const initialDocTop = initialDocTopRef.current;
      const stopDocTop = endTop + stopAtEndSectionOffset;
      const stopTranslate = stopDocTop - initialDocTop;

      const nextTranslate = Math.max(startOffset, Math.min(targetTranslate, stopTranslate));
      setTranslateY(nextTranslate);
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        updatePosition();
        ticking = false;
      });
    };

    initialDocTopRef.current = null;
    updatePosition();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [
    endSectionId,
    endViewportFactor,
    minTravel,
    stopAtEndSectionOffset,
    startOffset,
    startSectionId,
    startViewportFactor,
  ]);

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className={className}
      style={{
        transform: `translateY(${translateY}px)`,
      }}
    />
  );
}
