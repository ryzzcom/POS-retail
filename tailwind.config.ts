import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Direct Brand Shorthands
        primary: "var(--brand-primary)",
        accent: "var(--brand-accent)",
        secondary: "var(--brand-secondary)",

        // Background Utilities
        page: "var(--bg-page)",
        subtle: "var(--bg-subtle)",
        card: "var(--bg-card)",
        theme: "var(--bg-theme)",
        "bg-page": "var(--bg-page)",
        "bg-subtle": "var(--bg-subtle)",
        "bg-card": "var(--bg-card)",
        "bg-theme": "var(--bg-theme)",

        // Text Utilities
        heading: "var(--text-heading-primary)",
        "heading-primary": "var(--text-heading-primary)",
        body: "var(--text-body-secondary)",
        "body-secondary": "var(--text-body-secondary)",
        muted: "var(--text-muted)",
        "dark-primary": "var(--text-dark-primary)",
        "dark-secondary": "var(--text-dark-secondary)",

        // Border & Ring Utilities
        "border-default": "var(--border-default)",
        "border-focus": "var(--border-focus)",
        "border-dark": "var(--border-dark)",

        // Status Utilities
        "status-success": "var(--status-success)",
        "status-success-bg": "var(--status-success-bg)",
        "status-warning": "var(--status-warning)",
        "status-warning-bg": "var(--status-warning-bg)",
        "status-error": "var(--status-error)",
        "status-error-bg": "var(--status-error-bg)",
      },
      borderColor: {
        DEFAULT: "var(--border-default)",
        default: "var(--border-default)",
        focus: "var(--border-focus)",
        dark: "var(--border-dark)",
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        sans: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

