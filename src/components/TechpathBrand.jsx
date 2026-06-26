import TechpathLogo from "./TechpathLogo";

export const BRAND_BLUE = "#2E40BB";
export const BRAND_BLUE_DARK = "#003f87";

export const BRAND_SIZES = {
  nav: { logoHeight: 56, textSize: 32 },
  page: { logoHeight: 48, textSize: 28 },
  compact: { logoHeight: 42, textSize: 24 },
};

export default function TechpathBrand({
  logoHeight = BRAND_SIZES.nav.logoHeight,
  showText = true,
  showIcon = true,
  textSize,
  className = "",
  textColor = BRAND_BLUE,
  techWeight = 500,
  pathWeight = 800,
}) {
  const fontSize = textSize ?? Math.round(logoHeight * 0.58);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
      }}
    >
      {showIcon && <TechpathLogo height={logoHeight} />}
      {showText && (
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            fontSize,
            whiteSpace: "nowrap",
            transition: "color 0.18s ease",
          }}
        >
          <span style={{ color: textColor, fontWeight: techWeight }}>Tech</span>
          <span style={{ color: textColor, fontWeight: pathWeight }}>Path</span>
        </span>
      )}
    </div>
  );
}
