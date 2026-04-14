 "use client";

import { useEffect, useState } from "react";
import ScrollOpacityBackground from "./components/ScrollOpacityBackground";
import BlackEdgeVideo from "./components/BlackEdgeVideo";
import ScrollMoveImage from "./components/ScrollMoveImage";
import UCardScene from "./components/UCardScene";

export default function Home() {
  const [canvasPinnedToSection7, setCanvasPinnedToSection7] = useState(false);
  const [canvasDocTop, setCanvasDocTop] = useState(0);
  const getCardButtonClassName =
    "inline-flex items-center justify-center rounded-full bg-[#1d6bff] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(29,107,255,0.45)] transition hover:bg-[#2f79ff]";

  useEffect(() => {
    let ticking = false;
    let pinned = false;

    const getK6CenterScrollY = () => {
      const section7 = document.getElementById("section-7");
      if (!section7) return null;
      return section7.offsetTop + section7.offsetHeight / 2 - window.innerHeight / 2;
    };

    const updateCanvasMode = () => {
      const k6CenterScrollY = getK6CenterScrollY();
      if (k6CenterScrollY === null) return;
      const shouldPinToSection7 = window.scrollY >= k6CenterScrollY;

      if (shouldPinToSection7 && !pinned) {
        pinned = true;
        setCanvasDocTop(window.scrollY);
        setCanvasPinnedToSection7(true);
        return;
      }

      if (!shouldPinToSection7 && pinned) {
        pinned = false;
        setCanvasPinnedToSection7(false);
      }
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateCanvasMode();
        ticking = false;
      });
    };

    updateCanvasMode();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  const canvasContainerClassName = canvasPinnedToSection7
    ? "pointer-events-none absolute inset-x-0 z-40 h-screen w-full"
    : "pointer-events-none fixed inset-0 z-40 h-screen w-full";

  const canvasContainerStyle = canvasPinnedToSection7
    ? { top: `${canvasDocTop}px` }
    : undefined;

  return (
    <div className="relative min-h-screen bg-[#000000] text-white">
      <div
        id="canvas-container"
        aria-hidden="true"
        className={canvasContainerClassName}
        style={canvasContainerStyle}
      >
        <UCardScene />
      </div>
      <header className="absolute inset-x-0 top-2 z-50">
        <div className="flex w-full items-center justify-between px-6 py-4 sm:px-8 md:px-12">
          <div className="text-3xl font-semibold tracking-[-0.02em] md:text-[31px]">
            UCard
          </div>
          <a
            href="https://app.ucard.credit/login"
            className={getCardButtonClassName}
          >
            Get A Card
          </a>
        </div>
      </header>

      <main className="relative z-30 flex w-full flex-col gap-14 pb-14 pt-24 sm:gap-16 sm:pt-28 md:gap-20 md:pb-16">
        <section
          id="section-1"
          className="relative w-full overflow-hidden min-h-screen"
        >
          <video
            className="pointer-events-none relative left-1/2 h-auto w-[300%] max-w-none -translate-x-[53%] object-contain opacity-95 sm:w-[135%] sm:-translate-x-1/2 md:w-[112%] md:-translate-x-[53%]"
            src="/earth.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,40,90,0.16),rgba(0,0,0,0.68)_56%,rgba(0,0,0,0.96)_100%)]" />

          <div className="absolute inset-x-0 top-0 z-10 flex w-full flex-col items-center px-6 pt-14 text-center sm:px-8 sm:pt-16 md:px-10">
            <h1 className="text-6xl font-semibold leading-none tracking-[-0.03em] sm:text-7xl md:text-9xl">
              UCard
            </h1>
            <h2 className="mt-2 whitespace-nowrap text-[clamp(1.75rem,6.2vw,5.5rem)] font-semibold leading-none tracking-[-0.03em] md:text-[6.2rem]">
              Infinite Possibilities
            </h2>
            <p className="mt-5 w-full max-w-5xl px-2 text-sm leading-6 text-zinc-200 sm:mt-6 sm:text-base sm:leading-7 md:mt-8 md:px-0 md:text-[22px] md:leading-[1.35]">
              The premium Mastercard designed for your digital wealth. Connect your
              crypto to the world.
            </p>
          </div>
        </section>

        <section
          id="section-2"
          className="relative z-10 mx-auto -mt-10 w-full max-w-7xl px-6 sm:mt-24 sm:px-8 md:-mt-28"
        >
          <article className="relative flex min-h-[600px] items-center overflow-hidden rounded-[42px] bg-[#191a1f] p-7 sm:min-h-[600px] sm:p-12 md:min-h-[600px] md:p-14">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-[-140px] h-[280px] opacity-90"
              style={{
                backgroundImage:
                  "url('https://cdn-imgs.dora.run/design/GOD69hj2iIlIsUrNSjJFv6.png/w/4096/h/4096/format/webp?')",
                backgroundPosition: "center bottom",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
            <div className="relative z-10">
              <div>
                <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                  The Speed of Tron.
                  <br />
                  The Power of Mastercard.
                </h2>
                <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg sm:leading-9 md:text-[20px] md:leading-[1.85]">
                  Deposit USDT and other assets via the TRC-20 network for
                  near-instant confirmations and ultra-low fees. UCard
                  eliminates the friction of traditional banking, giving you
                  immediate access to your capital.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section
          id="section-3"
          className="mx-auto mt-25 w-full max-w-7xl px-6 text-left sm:mt-34 sm:px-8"
        >
          <article className="relative rounded-[32px] bg-black p-8 text-left sm:p-10 md:p-12">
            <div className="max-w-xl md:pr-8">
              <h3 className="text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                Virtual & Physical Agility
              </h3>
              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg sm:leading-9 md:text-[20px] md:leading-[1.85]">
                Issue an instant virtual card for secure online spending or a premium
                physical card for the real world.
                <br />
                Manage everything seamlessly via the UCard dashboard.
              </p>
              <div className="mt-8 h-2 w-16 rounded-full bg-lime-300" />
            </div>
            <ScrollMoveImage
              startSectionId="section-3"
              endSectionId="section-4"
              src="/phone.png"
              alt="UCard phone preview"
              startViewportFactor={0.1}
              endViewportFactor={0.3}
              className="pointer-events-none absolute right-4 top-2 hidden w-[250px] max-w-[38%] object-contain md:block lg:right-8 lg:w-[290px]"
            />
          </article>

        </section>

        <section
          id="section-4"
          className="mx-auto mt-35 w-full max-w-7xl px-6 text-left sm:mt-40 sm:px-8"
        >
          <article className="rounded-[32px] bg-black p-8 text-left sm:p-10 md:p-12">
            <div className="max-w-xl">
              <h3 className="text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                Multi-Card Management
              </h3>
              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg sm:leading-9 md:text-[20px] md:leading-[1.85]">
                Scale your reach by managing multiple cards under one account.
                <br />
                Perfectly organize your finances by separating business, travel, and
                personal expenses.
              </p>
              <div className="mt-8 h-2 w-16 rounded-full bg-fuchsia-500" />
            </div>
          </article>
        </section>

        <section
          id="section-5"
          className="mx-auto mt-40 w-full max-w-7xl px-6 sm:mt-48 sm:px-8"
        >
          <article className="overflow-hidden rounded-[32px] bg-black">
            <div className="grid min-h-[420px] md:grid-cols-2">
              <ScrollOpacityBackground
                imageUrl="/merchant.png"
                className="relative min-h-[220px] bg-cover bg-center md:min-h-full"
              />
              <div className="flex items-center bg-black p-8 sm:p-10 md:p-12">
                <div className="max-w-xl">
                  <h3 className="text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                    Global ATM & Merchant Access
                  </h3>
                  <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg sm:leading-9 md:text-[20px] md:leading-[1.85]">
                    Spend at over 100 million locations worldwide. Access local
                    currency whenever you need it with seamless withdrawal support at
                    any global ATM.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section
          id="section-6"
          className="mx-auto mt-14 w-full max-w-[90rem] px-4 sm:mt-16 sm:px-6"
        >
          <div className="relative">
            <BlackEdgeVideo src="/star.mp4" />
            <div className="absolute inset-x-0 bottom-0 z-10 sm:bottom-3 md:bottom-5">
              <div className="mx-auto w-full px-4 py-7 sm:px-6 sm:py-9 md:px-8">
                <h3 className="mx-auto w-full max-w-[20ch] text-center text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:max-w-[24ch] sm:text-4xl md:max-w-full md:text-6xl">
                  Superior tech for the modern crypto holder
                </h3>
                <div className="mt-6 flex flex-col items-center justify-center gap-4 text-zinc-100 sm:mt-8 sm:flex-row sm:gap-10">
                  <div className="flex items-center gap-3 text-sm sm:text-base">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 text-[12px]">
                      ◔
                    </span>
                    <span>Instant conversions.</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm sm:text-base">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 text-[12px]">
                      ◌
                    </span>
                    <span>Enterprise encryption.</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm sm:text-base">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 text-[12px]">
                      ✓
                    </span>
                    <span>One-tap top-ups.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="section-7"
          className="mx-auto mt-14 w-full max-w-7xl px-4 sm:mt-16 sm:px-6"
        >
          <article className="relative overflow-x-hidden overflow-y-visible rounded-[32px] bg-black px-5 py-8 sm:px-7 sm:py-10 md:px-9 md:py-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-95"
              style={{
                background:
                  "radial-gradient(120% 90% at 24% 100%, rgba(93,22,140,0.45), rgba(0,0,0,0) 58%), radial-gradient(85% 70% at 80% 90%, rgba(154,78,22,0.35), rgba(0,0,0,0) 60%), linear-gradient(180deg, rgba(0,0,0,0.95), rgba(0,0,0,0.75))",
              }}
            />
            <div className="relative z-10 max-w-3xl">
              <h3 className="text-[2.65rem] font-semibold leading-[1.04] tracking-[-0.025em] sm:text-6xl md:text-7xl">
                <span className="block whitespace-nowrap">Get your card in</span>
                <span className="block whitespace-nowrap">just 5min</span>
              </h3>
              <div
                className="mt-6 h-36 w-full sm:hidden"
                aria-hidden="true"
              />
              <ol className="mt-12 space-y-1 text-lg leading-8 text-zinc-200 sm:mt-11 sm:text-xl sm:leading-9">
                <li>1. Complete a secure KYC check</li>
                <li>2. Choose your card type</li>
                <li>3. Settle the card opening fee</li>
                <li>4. Receive rapid approval to activate your card.</li>
              </ol>
              <a
                href="https://www.ucard.credit/login"
                className={`mt-8 ${getCardButtonClassName} sm:mt-10`}
              >
                Get A Card
              </a>
            </div>
          </article>
        </section>
      </main>

      <footer className="relative z-30 border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-400">
        All copyright reserve to @UCard
      </footer>
    </div>
  );
}
