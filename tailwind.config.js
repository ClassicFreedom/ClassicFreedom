/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
            a: {
              color: '#0d9488',
              '&:hover': {
                color: '#0f766e',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  safelist: [
    'bg-gray-50',
    'text-gray-600',
    'text-gray-900',
    'text-xl',
    'hover:text-gray-900',
    'bg-teal-600',
    'hover:bg-teal-700',
  ]
} 