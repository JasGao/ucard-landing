"use client";

import ReactDOM from "react-dom";

export default function PreloadResources() {
  ReactDOM.preload("/models/card.glb", { as: "fetch", crossOrigin: "anonymous" });
  return null;
}
