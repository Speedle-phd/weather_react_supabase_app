/** @type {import('tailwindcss').Config} */
export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
      fontFamily: {
         sans: ['Ubuntu', 'sans-serif'],
         serif: ['Vollkorn', 'serif'],
      },
      extend: {
         boxShadow: {
            'whiteShadow': '0 25px 50px -20px rgba(255, 255, 255, 0.4)',
      }
      },
   },
   plugins: [],
}
