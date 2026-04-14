export default function BlackEdgeVideo({
  src,
  className = "",
  videoClassName =
    "h-[68vh] w-full object-cover sm:h-[64vh] md:h-[100dvh] md:min-h-[100dvh]",
}) {
  return (
    <div className={`relative overflow-hidden rounded-[32px] bg-black ${className}`}>
      <video
        className={videoClassName}
        src={src}
        autoPlay
        loop
        muted
        playsInline
      />
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          backgroundImage: [
            "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0) 26%)",
            "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0) 26%)",
          ].join(","),
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          backgroundImage: [
            "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0) 26%)",
            "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0) 26%)",
            "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0) 22%)",
            "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0) 22%)",
            "radial-gradient(circle at top left, rgba(0,0,0,0.95), rgba(0,0,0,0) 36%)",
            "radial-gradient(circle at top right, rgba(0,0,0,0.95), rgba(0,0,0,0) 36%)",
            "radial-gradient(circle at bottom left, rgba(0,0,0,0.95), rgba(0,0,0,0) 36%)",
            "radial-gradient(circle at bottom right, rgba(0,0,0,0.95), rgba(0,0,0,0) 36%)",
          ].join(","),
        }}
      />
    </div>
  );
}
