"use client";

import ReactDOM from "react-dom";

export default function PreloadResources() {
  ReactDOM.preload("/models/card.optimized.glb", {
    as: "fetch",
    crossOrigin: "anonymous",
  });
  return null;
}
