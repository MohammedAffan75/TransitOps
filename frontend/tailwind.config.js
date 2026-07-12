/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#111111',
        sidebar: '#181818',
        card: '#1E1E1E',
        border: '#2A2A2A',
        primary: {
          DEFAULT: '#C88719',
          hover: '#D99A2A',
          light: '#F4A62A',
        },
        success: '#4CAF50',
        warning: '#F4A62A',
        danger: '#F87171',
        blue: '#5DA9FF',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        manrope: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        card: '12px',
        badge: '6px',
        btn: '8px',
      },
      width: {
        sidebar: '260px',
      },
      height: {
        navbar: '72px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        sidebar: '2px 0 16px rgba(0,0,0,0.3)',
        glow: '0 0 20px rgba(200,135,25,0.2)',
      },
    },
  },
  plugins: [],
}
