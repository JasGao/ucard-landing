"use client";

import { Suspense, useRef, useEffect, useLayoutEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function flushGroupWorldMatrix(group) {
  if (!group?.updateMatrixWorld) return;
  group.updateMatrix();
  group.updateMatrixWorld(true);
}

const CARD_URL = "/models/card.optimized.glb";
/** 模型材质上环境贴图强度（IBL 反射）；偏暗时可调到 2～3 */
const ENV_MAP_INTENSITY = 3;
/** drei Environment 整体倍率，默认 1 */
const ENVIRONMENT_INTENSITY = 2;
/** Balance startup speed and clarity on first load. */
const CANVAS_DPR = [1, 1.5];
const TEXTURE_ANISOTROPY_CAP = 4;
const MQ_DESKTOP = "(min-width: 768px)";

/**
 * Hero（页面顶部、未滚动或时间轴 progress≈0）时卡片在场景里的姿态。
 * - position: 右 +x，上 +y，朝向镜头 +z；要「在画面里往下」→ 减小 y
 * - rotation: 弧度，15° ≈ 0.262，45° ≈ 0.785
 */
const CARD_INITIAL_POSITION = [0, -0.85, 0.38];
const CARD_INITIAL_SCALE = 15.8;
const CARD_INITIAL_ROTATION = [1.21, 0, 0];
const CARD_INITIAL_POSITION_MOBILE = [0, -0.16, 0.32];
const CARD_INITIAL_SCALE_MOBILE = 13.5;
const CARD_INITIAL_ROTATION_MOBILE = [1.12, 0, 0];

function uniformScale(s) {
  return { x: s, y: s, z: s };
}


const CARD_K0 = {
  position: { x: CARD_INITIAL_POSITION[0], y: CARD_INITIAL_POSITION[1], z: CARD_INITIAL_POSITION[2] },
  rotation: { x: CARD_INITIAL_ROTATION[0], y: CARD_INITIAL_ROTATION[1], z: CARD_INITIAL_ROTATION[2] },
  scale: CARD_INITIAL_SCALE,
};

const CARD_K0_MOBILE = {
  position: {
    x: CARD_INITIAL_POSITION_MOBILE[0],
    y: CARD_INITIAL_POSITION_MOBILE[1],
    z: CARD_INITIAL_POSITION_MOBILE[2],
  },
  rotation: {
    x: CARD_INITIAL_ROTATION_MOBILE[0],
    y: CARD_INITIAL_ROTATION_MOBILE[1],
    z: CARD_INITIAL_ROTATION_MOBILE[2],
  },
  scale: CARD_INITIAL_SCALE_MOBILE,
};

const CARD_K1_DESKTOP = {
  position: { x: 1.6, y: -0.4, z: 0 },
  rotation: {
    x: CARD_INITIAL_ROTATION[0],
    y: Math.PI*2,
    z: Math.PI*3,
  },
  scale: 16.9,
};

const CARD_K1_MOBILE = {
  position: { x: -0.4, y: 0, z: 0.3 },
  rotation: {
    x: CARD_INITIAL_ROTATION[0],
    y: 1,
    z: Math.PI*2,
  },
  scale: 9,
};

const CARD_K2_DESKTOP = {
  position: { x: 1.6, y: 0.55, z: 0 },
  rotation: {
    x: 1.6,
    y: Math.PI*2,
    z: Math.PI*2,
  },
  scale: 16.5,
};

const CARD_K2_MOBILE = {
  position: { x: 0.4, y: -0.1, z: 0.35 },
  rotation: {
    x: 1.05,
    y: Math.PI * 1.2,
    z: Math.PI * 1.1,
  },
  scale: 9,
};

const CARD_K3_DESKTOP = {
  position: { x: 1.55, y: 0.5, z: 0 },
  rotation: {
    x: 1.6,
    y: Math.PI*2,
    z: Math.PI*2,
  },
  scale: 16.5,
};

const CARD_K3_MOBILE = {
  position: { x: -0.3, y: 0.1, z: 0.4 },
  rotation: {
    x: 0.88,
    y: Math.PI * 0.95,
    z: Math.PI * 2,
  },
  scale: 10,
};

const CARD_K4_DESKTOP = {
  position: { x: 0, y: -0.2, z: 0 },
  rotation: {
    x: CARD_INITIAL_ROTATION[1],
    y: Math.PI*3,
    z: Math.PI*2,
  },
  scale: 16.5,
};

const CARD_K4_MOBILE = {
  position: { x: -0.16, y: 0, z: 0.46 },
  rotation: {
    x: 0.72,
    y: Math.PI * 4,
    z: Math.PI*3,
  },
  scale: 10,
};

const CARD_K5_DESKTOP = {
  position: { x: 0, y: 0, z: 0 },
  rotation: {
    x: CARD_INITIAL_ROTATION[0],
    y: Math.PI*2,
    z: Math.PI*2,
  },
  scale: 16.5,
};

const CARD_K5_MOBILE = {
  position: { x: 0, y: 0.3, z: 0.52 },
  rotation: {
    x: CARD_INITIAL_ROTATION[0],
    y: Math.PI*2,
    z: Math.PI*2,
  },
  scale: 10.4,
};

const CARD_K6_DESKTOP = {
  position: { x: 1.3, y: 0, z: 0 },
  rotation: {
    x: Math.PI*2.4,
    y: Math.PI*4.1,
    z: Math.PI*2.1,
  },
  scale: 16.5,
};

const CARD_K6_MOBILE = {
  position: { x: -0.07, y: 0.3, z: 0.21 },
  rotation: {
    x: 4.6068,
    y: 3.0068,
    z: -2.8432,
  },
  scale: 8.59,
};


const CARD_KEYFRAMES_DESKTOP = [
  CARD_K0,
  CARD_K1_DESKTOP,
  CARD_K2_DESKTOP,
  CARD_K3_DESKTOP,
  CARD_K4_DESKTOP,
  CARD_K5_DESKTOP,
  CARD_K6_DESKTOP,
];

const CARD_KEYFRAMES_MOBILE = [
  CARD_K0_MOBILE,
  CARD_K1_MOBILE,
  CARD_K2_MOBILE,
  CARD_K3_MOBILE,
  CARD_K4_MOBILE,
  CARD_K5_MOBILE,
  CARD_K6_MOBILE,
];

const CARD_SEGMENT1_MID_POSITION = {
  desktop: { x: 0.5, y: -0.35, z: 0.85 },
  mobile: { x: 0, y: -1.15, z: 0.35 },
};

const CARD_SEGMENT1_MID_ROTATION = {
  desktop: { x: CARD_INITIAL_ROTATION[0], y: Math.PI, z: Math.PI },
  mobile: { x: CARD_INITIAL_ROTATION[0] * 0.45, y: Math.PI, z: 0 },
};

const CARD_SCROLL_SECTION_IDS = [
  "#section-2",
  "#section-3",
  "#section-4",
  "#section-5",
  "#section-6",
  "#section-7",
];

const CAMERA_POSITION = [0, 0, 5];
const CAMERA_FOV = 35;
const PHONE_FOLLOW_START_ID = "section-3";
const PHONE_FOLLOW_END_ID = "section-4";
const PHONE_IMAGE_ALT = "UCard phone preview";
const PHONE_STICK_START_VIEWPORT_FACTOR = 0.1;
const PHONE_FOLLOW_END_VIEWPORT_FACTOR = 0.3;
const PHONE_IMAGE_START_VIEWPORT_FACTOR = 0.1;
const PHONE_IMAGE_END_VIEWPORT_FACTOR = 0.3;
const PHONE_3D_LEAVE_AFTER_PHONE_SCROLL_PX = 100;
const PHONE_FOLLOW_WORLD_X = 1.6;
const PHONE_FOLLOW_WORLD_Z = 0;
// Pixel-to-world mapping for matching phone image drift speed.
// Lowered to keep 3D card follow pace in sync with the 2D phone image.
const PHONE_FOLLOW_WORLD_Y_FACTOR = 0.00175;
const PHONE_FOLLOW_RELEASE_BLEND_PX = 120;


function setMeshEnvIntensity(mesh, value) {
  const { material } = mesh;
  if (!material) return;
  const mats = Array.isArray(material) ? material : [material];
  for (const m of mats) {
    if (m && "envMapIntensity" in m) m.envMapIntensity = value;
  }
}

/** 略提暗色 PBR 面的底光，（很弱，主要靠灯光 + IBL） */
function boostMeshReadability(mesh) {
  const { material } = mesh;
  if (!material) return;
  const mats = Array.isArray(material) ? material : [material];
  for (const m of mats) {
    if (!m || !("emissive" in m)) continue;
    if (m.emissiveIntensity > 0.05) continue;
    m.emissive?.set?.("#1a1c22");
    m.emissiveIntensity = 0.12;
  }
}

function getScrollProgressWhenSectionCentered(scrollTrigger, sectionEl) {
  if (!sectionEl) return 0;
  const rect = sectionEl.getBoundingClientRect();
  const docTop = rect.top + window.scrollY;
  const centerY = docTop + rect.height / 2;
  const scrollY = centerY - window.innerHeight / 2;
  const range = scrollTrigger.end - scrollTrigger.start;
  if (!range) return 0;
  return gsap.utils.clamp(0, 1, (scrollY - scrollTrigger.start) / range);
}

function getSectionCenterScrollY(sectionEl) {
  if (!sectionEl) return null;
  const rect = sectionEl.getBoundingClientRect();
  const docTop = rect.top + window.scrollY;
  return docTop + rect.height / 2 - window.innerHeight / 2;
}

function scrollYToScrollProgress(scrollTrigger, scrollY) {
  const range = scrollTrigger.end - scrollTrigger.start;
  if (!range) return 0;
  return gsap.utils.clamp(0, 1, (scrollY - scrollTrigger.start) / range);
}

/**
 * breaks[i] = 滚动 progress 到达第 i 个关键帧的时刻（i=0 为 Hero，i=1 对应 section-2 对齐 …）
 * timeline 时间：第 k 段 ∈ [k, k+1]，共 keyframeCount-1 段
 */
function scrollProgressToTimelineTime(scrollProgress, breaks) {
  const maxTime = breaks.length - 1;
  if (scrollProgress <= breaks[0]) return 0;
  if (scrollProgress >= breaks[breaks.length - 1]) return maxTime;

  for (let i = 0; i < maxTime; i++) {
    if (scrollProgress < breaks[i + 1]) {
      const a = breaks[i];
      const b = breaks[i + 1];
      const denom = Math.max(b - a, 1e-6);
      return i + gsap.utils.clamp(0, 1, (scrollProgress - a) / denom);
    }
  }
  return maxTime;
}

/** 首帧（desktop/mobile 各自 initial）与滚动 t=0 一致；作用在 <group> 上 */
function seedKeyframeZeroPose(obj, isDesktop) {
  const initialPosition = isDesktop
    ? CARD_INITIAL_POSITION
    : CARD_INITIAL_POSITION_MOBILE;
  const initialRotation = isDesktop
    ? CARD_INITIAL_ROTATION
    : CARD_INITIAL_ROTATION_MOBILE;
  const initialScale = isDesktop ? CARD_INITIAL_SCALE : CARD_INITIAL_SCALE_MOBILE;

  gsap.set(obj.position, {
    x: initialPosition[0],
    y: initialPosition[1],
    z: initialPosition[2],
  });
  gsap.set(obj.rotation, {
    x: initialRotation[0],
    y: initialRotation[1],
    z: initialRotation[2],
  });
  gsap.set(obj.scale, uniformScale(initialScale));
  flushGroupWorldMatrix(obj);
}

function getTranslateYFromTransform(transformValue) {
  if (!transformValue || transformValue === "none") return 0;
  if (transformValue.startsWith("matrix3d(")) {
    const values = transformValue
      .slice(9, -1)
      .split(",")
      .map((v) => Number(v.trim()));
    return Number.isFinite(values[13]) ? values[13] : 0;
  }
  if (transformValue.startsWith("matrix(")) {
    const values = transformValue
      .slice(7, -1)
      .split(",")
      .map((v) => Number(v.trim()));
    return Number.isFinite(values[5]) ? values[5] : 0;
  }
  return 0;
}

function getPhoneImageCurrentTranslateY() {
  const phoneImage = document.querySelector(`img[alt="${PHONE_IMAGE_ALT}"]`);
  if (!phoneImage) return null;
  const transform = window.getComputedStyle(phoneImage).transform;
  return getTranslateYFromTransform(transform);
}

function getPhoneImageStopScrollY() {
  const endSection = document.getElementById(PHONE_FOLLOW_END_ID);
  if (!endSection) return null;

  const viewportHeight = window.innerHeight;
  const endTop = endSection.offsetTop;
  // Keep this deterministic and aligned with ScrollMoveImage's progress mapping:
  // progress = (scrollY - startScroll) / (endScroll - startScroll)
  // The 3D timeline uses this "endScroll" as the end of the phone-motion phase,
  // otherwise refresh-time measurement drift can make the 3D card leave early.
  const phoneUiEndScroll = endTop - viewportHeight * PHONE_IMAGE_END_VIEWPORT_FACTOR;
  return phoneUiEndScroll + PHONE_3D_LEAVE_AFTER_PHONE_SCROLL_PX;
}

function getPhoneImageStartScrollY() {
  const startSection = document.getElementById(PHONE_FOLLOW_START_ID);
  if (!startSection) return null;
  return (
    startSection.offsetTop - window.innerHeight * PHONE_IMAGE_START_VIEWPORT_FACTOR
  );
}

function applyPhoneFollowPose(obj, followState) {
  const startSection = document.getElementById(PHONE_FOLLOW_START_ID);
  const endSection = document.getElementById(PHONE_FOLLOW_END_ID);
  if (!startSection || !endSection) return;
  const defaultStickStartScroll =
    startSection.offsetTop - window.innerHeight * PHONE_STICK_START_VIEWPORT_FACTOR;
  const stickStartScroll = getPhoneImageStartScrollY() ?? defaultStickStartScroll;
  const defaultStickEndScroll =
    endSection.offsetTop - window.innerHeight * PHONE_FOLLOW_END_VIEWPORT_FACTOR;
  const stickEndScroll = getPhoneImageStopScrollY() ?? defaultStickEndScroll;
  if (window.scrollY < stickStartScroll) {
    followState.isStuck = false;
    return;
  }
  if (window.scrollY > stickEndScroll) {
    followState.isStuck = false;
    return;
  }

  const timelineX = obj.position.x;
  const timelineY = obj.position.y;
  const timelineZ = obj.position.z;
  const phoneTranslateY = getPhoneImageCurrentTranslateY();
  if (phoneTranslateY === null) return;
  if (!followState.isStuck) {
    followState.isStuck = true;
    followState.baseTranslateY = phoneTranslateY;
    followState.baseY = obj.position.y;
  }

  const translateDelta = phoneTranslateY - followState.baseTranslateY;
  const followX = PHONE_FOLLOW_WORLD_X;
  const followZ = PHONE_FOLLOW_WORLD_Z;
  const followY = followState.baseY - translateDelta * PHONE_FOLLOW_WORLD_Y_FACTOR;

  // Smoothly hand control back to timeline before follow end to avoid a hard jump.
  const blendStartScroll = Math.max(
    stickStartScroll,
    stickEndScroll - PHONE_FOLLOW_RELEASE_BLEND_PX,
  );
  const blendDenom = Math.max(1, stickEndScroll - blendStartScroll);
  const releaseBlend = gsap.utils.clamp(
    0,
    1,
    (window.scrollY - blendStartScroll) / blendDenom,
  );

  obj.position.x = gsap.utils.interpolate(followX, timelineX, releaseBlend);
  obj.position.y = gsap.utils.interpolate(followY, timelineY, releaseBlend);
  obj.position.z = gsap.utils.interpolate(followZ, timelineZ, releaseBlend);
}

function buildMasterTimeline(obj, isDesktop) {
  const keyframes = isDesktop ? CARD_KEYFRAMES_DESKTOP : CARD_KEYFRAMES_MOBILE;
  const midPos = isDesktop ? CARD_SEGMENT1_MID_POSITION.desktop : CARD_SEGMENT1_MID_POSITION.mobile;
  const midRot = isDesktop ? CARD_SEGMENT1_MID_ROTATION.desktop : CARD_SEGMENT1_MID_ROTATION.mobile;
  const k0 = keyframes[0];
  const k1 = keyframes[1];

  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });

  tl.fromTo(
    obj.position,
    { ...k0.position },
    { ...midPos, duration: 0.5, ease: "none" },
    0,
  )
    .to(obj.position, { ...k1.position, duration: 0.5, ease: "none" }, 0.5)
    .fromTo(
      obj.rotation,
      { ...k0.rotation },
      { ...midRot, duration: 0.5, ease: "none" },
      0,
    )
    .to(obj.rotation, { ...k1.rotation, duration: 0.5, ease: "none" }, 0.5)
    .fromTo(
      obj.scale,
      uniformScale(k0.scale),
      { ...uniformScale(k1.scale), duration: 1, ease: "none" },
      0,
    );

  const lastIndex = keyframes.length - 1;
  for (let i = 1; i < lastIndex; i++) {
    const from = keyframes[i];
    const to = keyframes[i + 1];
    const tStart = i;
    tl.fromTo(
      obj.position,
      { ...from.position },
      { ...to.position, duration: 1, ease: "none" },
      tStart,
    );
    tl.fromTo(
      obj.rotation,
      { ...from.rotation },
      { ...to.rotation, duration: 1, ease: "none" },
      tStart,
    );
    tl.fromTo(
      obj.scale,
      uniformScale(from.scale),
      { ...uniformScale(to.scale), duration: 1, ease: "none" },
      tStart,
    );
  }

  return tl;
}

function createCardScrollController(obj, isDesktop, invalidateCanvas) {
  seedKeyframeZeroPose(obj, isDesktop);
  const masterTl = buildMasterTimeline(obj, isDesktop);
  const phoneFollowState = { isStuck: false, baseTranslateY: 0, baseY: 0 };
  const keyframes = isDesktop ? CARD_KEYFRAMES_DESKTOP : CARD_KEYFRAMES_MOBILE;
  const keyframeCount = keyframes.length;
  const lastTime = keyframeCount - 1;
  const FINAL_POSE_SNAP_PROGRESS_EPS = 1e-3;
  const k6SectionId = CARD_SCROLL_SECTION_IDS[CARD_SCROLL_SECTION_IDS.length - 1];
  let breaks = Array.from({ length: keyframeCount }, (_, i) =>
    i / Math.max(keyframeCount - 1, 1),
  );

  function getK6LockScrollY() {
    const k6SectionEl = document.querySelector(k6SectionId);
    const k6CenterScrollY = getSectionCenterScrollY(k6SectionEl);
    if (k6CenterScrollY === null) return null;
    const maxScrollableY = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    return Math.min(Math.max(0, k6CenterScrollY), maxScrollableY);
  }

  function snapToFinalPoseIfNeeded(scrollProgress) {
    if (scrollProgress < 1 - FINAL_POSE_SNAP_PROGRESS_EPS) return false;
    const finalPose = keyframes[lastTime];
    obj.position.set(finalPose.position.x, finalPose.position.y, finalPose.position.z);
    obj.rotation.set(finalPose.rotation.x, finalPose.rotation.y, finalPose.rotation.z);
    obj.scale.set(finalPose.scale, finalPose.scale, finalPose.scale);
    return true;
  }

  function applyPoseFromProgress(progress) {
    // Physical cutoff: keep card hard-reset at page top.
    if (typeof window !== "undefined" && window.scrollY < 20) {
      seedKeyframeZeroPose(obj, isDesktop);
      phoneFollowState.isStuck = false;
      invalidateCanvas();
      return;
    }

    const k6LockScrollY = getK6LockScrollY();
    const reachedK6Lock =
      k6LockScrollY !== null &&
      typeof window !== "undefined" &&
      window.scrollY >= k6LockScrollY;
    const t = scrollProgressToTimelineTime(progress, breaks);
    masterTl.time(t);
    const didSnapFinalPose = reachedK6Lock || snapToFinalPoseIfNeeded(progress);
    if (didSnapFinalPose) {
      snapToFinalPoseIfNeeded(1);
    }
    if (!didSnapFinalPose && isDesktop) applyPhoneFollowPose(obj, phoneFollowState);
    flushGroupWorldMatrix(obj);
    invalidateCanvas();
  }

  const st = ScrollTrigger.create({
    trigger: "main",
    start: "top top",
    end: () => {
      const k6LockScrollY = getK6LockScrollY();
      if (k6LockScrollY === null) return "bottom bottom";
      return k6LockScrollY;
    },
    scrub: 1.5,
    invalidateOnRefresh: true,
    onRefresh(self) {
      const next = [0];
      for (const id of CARD_SCROLL_SECTION_IDS) {
        const el = document.querySelector(id);
        next.push(getScrollProgressWhenSectionCentered(self, el));
      }

      const phoneStartScrollY = getPhoneImageStartScrollY();
      const phoneStopScrollY = getPhoneImageStopScrollY();
      if (phoneStartScrollY !== null && phoneStopScrollY !== null && next.length >= 4) {
        const phoneStartProgress = scrollYToScrollProgress(self, phoneStartScrollY);
        const phoneStopProgress = scrollYToScrollProgress(self, phoneStopScrollY);

        // Align keyframe breaks for the section-3 -> section-4 phase to phone motion.
        next[2] = Math.max(next[1] + 1e-4, phoneStartProgress);
        next[3] = Math.max(next[2] + 1e-4, phoneStopProgress);
      }

      for (let i = 1; i < next.length; i++) {
        if (next[i] <= next[i - 1]) next[i] = next[i - 1] + 1e-4;
      }
      breaks = next;
      applyPoseFromProgress(self.progress);
    },
    onUpdate(self) {
      applyPoseFromProgress(self.progress);
    },
  });

  function syncTimelineToScroll() {
    ScrollTrigger.refresh();
    applyPoseFromProgress(st.progress);
  }

  syncTimelineToScroll();
  let raf2 = 0;
  const raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(() => syncTimelineToScroll());
  });
  const onLoad = () => syncTimelineToScroll();
  window.addEventListener("load", onLoad);

  return () => {
    cancelAnimationFrame(raf1);
    cancelAnimationFrame(raf2);
    window.removeEventListener("load", onLoad);
    st.kill();
    masterTl.kill();
  };
}

function Card({ url }) {
  const groupRef = useRef(null);
  const { scene } = useGLTF(url);
  const invalidateCanvas = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    const targetAnisotropy = Math.min(maxAnisotropy, TEXTURE_ANISOTROPY_CAP);
    scene.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      setMeshEnvIntensity(child, ENV_MAP_INTENSITY);
      boostMeshReadability(child);

      const mats = Array.isArray(child.material) ? child.material : [child.material];
      for (const mat of mats) {
        if (!mat) continue;
        for (const key of ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap"]) {
          const tex = mat[key];
          if (!tex?.isTexture) continue;
          const nextAnisotropy = Math.max(tex.anisotropy || 1, targetAnisotropy);
          if (nextAnisotropy !== tex.anisotropy) {
            tex.anisotropy = nextAnisotropy;
            tex.needsUpdate = true;
          }
        }
      }
    });
    invalidateCanvas();
  }, [scene, gl, invalidateCanvas]);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const mql = window.matchMedia(MQ_DESKTOP);
    const setup = () => {
      const isDesktop = mql.matches;
      return createCardScrollController(group, isDesktop, invalidateCanvas);
    };

    let cleanup = setup();
    const onMqChange = () => {
      cleanup();
      cleanup = setup();
    };
    mql.addEventListener("change", onMqChange);

    return () => {
      mql.removeEventListener("change", onMqChange);
      cleanup();
    };
  }, [scene, invalidateCanvas]);

  return (
    <group 
      ref={groupRef}
      position={CARD_INITIAL_POSITION}
      rotation={CARD_INITIAL_ROTATION}
      scale={CARD_INITIAL_SCALE}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(CARD_URL);

export default function UCardScene() {
  return (
    <div className="h-full w-full pointer-events-none">
      <Canvas
        style={{ pointerEvents: "none" }}
        dpr={CANVAS_DPR}
        camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={2} />
        <hemisphereLight
          color="#f0f2ff"
          groundColor="#080810"
          intensity={1.05}
        />
        <directionalLight
          position={[5, 8, 6]}
          intensity={1.25}
          color="#ffffff"
        />
        <directionalLight
          position={[-4, 3, 5]}
          intensity={0.4}
          color="#b8c8ff"
        />
        <pointLight position={[4, 1.9, 4]} intensity={0.8} color="#ffffff" />
        <Environment resolution={128} environmentIntensity={ENVIRONMENT_INTENSITY}>
          <Lightformer
            intensity={2.2}
            rotation={[0, Math.PI / 2, 0]}
            position={[5, 1, 1]}
            scale={[10, 8, 1]}
          />
          <Lightformer
            intensity={1.8}
            rotation={[0, -Math.PI / 2, 0]}
            position={[-5, 1, 1]}
            scale={[10, 8, 1]}
          />
          <Lightformer
            intensity={1.2}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 5, 0]}
            scale={[8, 8, 1]}
          />
          <Lightformer
            intensity={0.9}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -4, 0]}
            scale={[6, 6, 1]}
          />
        </Environment>
        <Suspense fallback={null}>
          <Card url={CARD_URL} />
        </Suspense>
      </Canvas>
    </div>
  );
}
