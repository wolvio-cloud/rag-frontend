/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#ffffff',
        'surface-muted': '#fafafa',
        'surface-subtle': '#f4f4f5',
        ink: '#18181b',
        'ink-secondary': '#52525b',
        'ink-muted': '#a1a1aa',
        line: '#e4e4e7',
        'line-strong': '#d4d4d8',
        accent: '#18181b',
        'accent-soft': '#f4f4f5',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(24, 24, 27, 0.04), 0 8px 24px rgba(24, 24, 27, 0.06)',
        card: '0 1px 3px rgba(24, 24, 27, 0.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
