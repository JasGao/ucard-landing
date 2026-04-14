"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollOpacityBackground({
  imageUrl,
  className = "",
  minOpacity = 0.35,
  maxOpacity = 1,
  centerRange = 0.9,
  overlayClassName = "absolute inset-0 bg-black/45",
}) {
  const blockRef = useRef(null);
  const [opacity, setOpacity] = useState(minOpacity);

  useEffect(() => {
    let ticking = false;

    const updateOpacity = () => {
      const block = blockRef.current;
      if (!block) return;

      const rect = block.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const blockCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distanceToCenter = Math.abs(blockCenter - viewportCenter);
      const visibilityFactor = Math.max(
        0,
        1 - distanceToCenter / (viewportHeight * centerRange)
      );
      const nextOpacity = minOpacity + visibilityFactor * (maxOpacity - minOpacity);

      setOpacity(nextOpacity);
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        updateOpacity();
        ticking = false;
      });
    };

    updateOpacity();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [centerRange, maxOpacity, minOpacity]);

  return (
    <div
      ref={blockRef}
      className={className}
      style={{
        backgroundImage: `url('${imageUrl}')`,
        opacity,
        transition: "opacity 250ms linear",
      }}
    >
      <div className={overlayClassName} />
    </div>
  );
}
