export default function TechpathLogo({ height, className = "", alt = "Techpath" }) {
  const size = height || 42;

  return (
    <img
      src="/techpath.svg"
      alt={alt}
      className={className}
      style={{
        height: size,
        width: size,
        objectFit: "contain",
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}
