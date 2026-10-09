import { heroui } from "@heroui/react";

// Fleet dark fintech theme: #0d1012 page, #14181b surfaces, #4c9ffe accent.
export default heroui({
  themes: {
    light: {
      colors: {
        background: "#f6f7f9",
        foreground: "#111417",
        focus: "#4c9ffe",
        content1: "#ffffff",
        content2: "#eef1f4",
        content3: "#e4e9ed",
        divider: "#e3e7eb",
        primary: { DEFAULT: "#1f7fff", foreground: "#ffffff" },
      },
    },
    dark: {
      colors: {
        background: "#0d1012",
        foreground: "#e6ebf0",
        focus: "#4c9ffe",
        content1: "#14181b",
        content2: "#171c20",
        content3: "#1e242a",
        divider: "#232a2f",
        primary: { DEFAULT: "#4c9ffe", foreground: "#0d1012" },
      },
    },
  },
});