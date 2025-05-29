import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    './app/**/*.{js,ts,jsx,tsx}',
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
        sm: "480px",
        s:"380px"
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        footer: "linear-gradient(126.44deg, #516DEB -1.33%, #D6DDFF 100%)",
        banner2: "url('/img/banner-2.avif')",
        banner3: "url('/img/banner-3.avif')",
        banner4: "url('/img/banner-4.avif')",
        banner5: "url('/img/banner-5.avif')",
        guarantee: "url('/img/guarantee-bg.avif')",
        microsoft: "url('/img/microsoft-office-bg.avif')",
        windows: "url('/img/microsoft-windows.avif')"
      },
    },
  },
  plugins: [],
};
export default config;
