import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101922",
        steel: "#1f2f3f",
        accent: "#f97316",
        paper: "#f8fafc",
        skyline: "#dbeafe"
      },
      boxShadow: {
        card: "0 12px 28px rgba(16, 25, 34, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
