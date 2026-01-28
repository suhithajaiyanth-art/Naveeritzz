// Design tokens and constants
export const colors = {
  cream: "#FDFBF7",
  gold: "#E8A25D",
  teal: "#B9E2E5",
  darkTeal: "#1B3C40",
  lightTeal: "#2E8B57",
  wood: "#8B5E3C"
};

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "4xl": "5rem"
};

export const shadows = {
  sm: "0_20px_50px_rgba(0,0,0,0.1)",
  md: "0_25px_60px_rgba(0,0,0,0.15)",
  lg: "0_15px_40px_rgba(0,0,0,0.15)",
  teal: "0_25px_50px_rgba(185,226,229,0.7)",
  dark: "0_10px_30px_rgba(0,0,0,0.5)"
};

export const fontFamilies = {
  serif: "'Cormorant Garamond', serif",
  sans: "'Montserrat', sans-serif",
  accent: "'Great Vibes', cursive"
};

// Reusable class patterns
export const baseButtonClasses = "rounded-full h-14 tracking-[0.3em] text-[10px] font-bold transition-all duration-500 shadow-lg";
export const baseCardClasses = "rounded-[2.5rem] border border-[#1B3C40]/5 shadow-sm hover:shadow-md transition-all duration-500";
export const baseLabelClasses = "text-[10px] font-bold uppercase tracking-[0.4em] text-[#1B3C40]/30 ml-2";
export const baseInputClasses = "bg-white border-none rounded-2xl h-16 px-6 text-sm focus-visible:ring-1 focus-visible:ring-[#B9E2E5] shadow-sm";
export const baseTextareaClasses = "bg-white border-none rounded-2xl min-h-[160px] p-6 text-sm focus-visible:ring-1 focus-visible:ring-[#B9E2E5] resize-none shadow-sm";
