import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B4D2E",
          dark: "#143B23",
          light: "#E8F0EA"
        },
        surface: "#FFFFFF",
        canvas: "#F5F7F5",
        border: "#E3E8E4",
        muted: "#77817A",
        danger: "#C83D3D"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      borderRadius: {
        panel: "12px"
      },
      boxShadow: {
        panel: "0 2px 12px rgb(20 40 25 / 8%)"
      }
    }
  },
  plugins: []
} satisfies Config;
