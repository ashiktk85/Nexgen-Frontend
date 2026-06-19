const GRADIENTS = [
  "linear-gradient(135deg,#6366f1,#818cf8)",
  "linear-gradient(135deg,#0ea5e9,#38bdf8)",
  "linear-gradient(135deg,#f59e0b,#fbbf24)",
  "linear-gradient(135deg,#10b981,#34d399)",
  "linear-gradient(135deg,#ec4899,#f472b6)",
  "linear-gradient(135deg,#8b5cf6,#a78bfa)",
];

const getGrad = (letter = "E") => {
  const index =
    ((letter.toUpperCase().charCodeAt(0) - 65) % GRADIENTS.length + GRADIENTS.length) %
    GRADIENTS.length;
  return GRADIENTS[index];
};

const getInitial = (name = "") => {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "E";
};

const SIZES = {
  sm: { width: 36, height: 36, fontSize: 14 },
  md: { width: 40, height: 40, fontSize: 16 },
};

const EmployerNameAvatar = ({ name, size = "sm", className = "" }) => {
  const initial = getInitial(name);
  const dims = SIZES[size] || SIZES.sm;

  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-bold text-white ${className}`}
      style={{
        width: dims.width,
        height: dims.height,
        fontSize: dims.fontSize,
        background: getGrad(initial),
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
      aria-label={name ? `${name} avatar` : "Employer avatar"}
    >
      {initial}
    </div>
  );
};

export default EmployerNameAvatar;
