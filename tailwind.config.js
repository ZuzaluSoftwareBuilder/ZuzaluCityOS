/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': 'rgba(125, 255, 209, var(--tw-bg-opacity))',
        'inactive-white': 'rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: (theme) => ({
        'custom-gradient':
          'linear-gradient(90deg, rgba(125, 255, 209, 0.16) 0%, rgba(125, 255, 209, 0.00) 100%)',
      }),
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'lg-c': '1200px',
      'xl': '1280px',
    }
  },
  plugins: [],
};
