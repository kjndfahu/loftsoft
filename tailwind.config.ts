import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xxl: "1850px",
        xl: "1600px",
        lg: "1380px",
        mdbvp: "1280px",
        md: "1100px",
        mds: "800px",
        sml: "650px",
        sm: "480px"
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        footer: "linear-gradient(126.44deg, #516DEB -1.33%, #D6DDFF 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
