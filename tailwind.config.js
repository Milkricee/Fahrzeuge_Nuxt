/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./assets/**/*.{css,scss}"  // Achte darauf, dass der Pfad zu allen relevanten CSS/SCSS-Dateien hier steht
  ],
  theme: {
    extend: {
      colors: {
        primary: {  // Tailwind Farben von Aktiv Industrie
          DEFAULT: '#6492A7',
          50: '#F2F7F9',
          100: '#DFEAEE',
          200: '#C3D7DE',
          300: '#99BAC7',
          400: '#6492A7',
          500: '#4C788E',
          600: '#426478',
          700: '#3A5364',
          800: '#364854',
          900: '#303D49',
          950: '#1C2630',
        },
      },
      backgroundImage: {  // Definiert das Hintergrundbild
        'body-background': "url('/assets/images/logo_standard.svg')",
      },
      boxShadow: {  // Definiert den Schatten
        custom: '0px 2px 8px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}