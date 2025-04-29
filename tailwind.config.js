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
    screens: {
      xl: { min: '1445px' },
      pc: { min: '1200px' },
      tablet: { min: '810px', max: '1199px' },
      mobile: { min: '1px', max: '809px' },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
      },
      colors: {
        'custom-green': 'rgba(125, 255, 209, var(--tw-bg-opacity))',
        'inactive-white': 'rgba(255, 255, 255, 0.05)',
        error: '#ff5e5e',
        b: {
          'w-5': 'rgba(255,255,255,0.05)',
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
  plugins: [
    heroui({
      defaultTheme: 'dark',
      defaultExtendTheme: 'dark',
      layout: {
        borderWidth: {
          small: '1px',
          medium: '1px',
          large: '2px',
        },
        radius: {
          medium: '10px',
          large: '14px',
        },
      },
      themes: {
        dark: {
          colors: {
            error: '#FF5E5E',
            // success: '#55D7A9',
            // heroUI
            secondary: {
              DEFAULT: 'rgba(255, 255, 255, 0.05)',
              hover: 'rgba(255,255,255,0.1)',
              disabled: 'rgba(255, 255, 255, 0.05)',
            },
            // follow by figma
            active: '#7DFFD1',
            command: '#67DBFF',
            control: '#FFC77D',
            important: '#FF9C66',
            issue: '#FF5E5E',
            // custom
            submit: {
              DEFAULT: 'rgba(103, 219, 255, 0.1)',
              hover: 'rgba(103,219,255,0.3)',
              disabled: 'rgba(103, 219, 255, 0.1)',
            },
          },
        },
      },
    }),
  ],
};

export default config;
