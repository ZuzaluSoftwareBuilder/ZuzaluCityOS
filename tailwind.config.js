import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': 'rgba(125, 255, 209, var(--tw-bg-opacity))',
        'inactive-white': 'rgba(255, 255, 255, 0.05)',
        b: {
          'w-10': 'rgba(255,255,255,0.10)',
          'w-20': 'rgba(255,255,255,0.20)',
        },
      },
      backgroundImage: (theme) => ({
        'custom-gradient':
          'linear-gradient(90deg, rgba(125, 255, 209, 0.16) 0%, rgba(125, 255, 209, 0.00) 100%)',
      }),
    },
  },
  plugins: [heroui()],
};

export default config;
