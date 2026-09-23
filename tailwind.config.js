/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#07161E',
        card: '#10232C',
        accent: {
          DEFAULT: '#00D4FF',
          dark: '#00A3C4',
          light: '#66E5FF',
        },
        danger: {
          DEFAULT: '#FF4B55',
          dark: '#D92D37',
        },
        warning: {
          DEFAULT: '#FFB000',
          dark: '#CC8D00',
        },
        success: {
          DEFAULT: '#3DDC84',
          dark: '#2CB366',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#AAB6C3',
          muted: '#6C7A89',
        },
        border: {
          DEFAULT: '#1E3440',
          light: '#2A4656',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
};
