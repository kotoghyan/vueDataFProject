/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    screens: {
      lg: '1440px',
      md: '768px',
      '-lg': { max: '1439px' },
      '-md': { max: '767px' },
    },
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-8': 'var(--primary-8)',
        'lightness-primary': 'var(--lightness-primary)',
        'ultralight-primary': 'var(--ultralight-primary)',
        'light-primary': 'var(--light-primary)',
        dark: 'var(--dark)',
        'dark-primary': 'var(--dark-primary)',
        'strong-primary': 'var(--strong-primary)',
        'dark-blue': 'var(--dark-blue)',
        gray: 'var(--gray)',
        'light-gray': 'var(--light-gray)',
        red: 'var(--red)',
        'light-red': 'var(--light-red)',
        green: 'var(--green)',
        'dark-green': 'var(--dark-green)',
        'light-green': 'var(--light-green)',
        'black-16': 'var(--black-16)',
      },
      transitionDuration: {
        DEFAULT: 'var(--transition-duration)',
      },
      transitionTimingFunction: {
        DEFAULT: 'var(--transition-timing-function)',
      },
      animation: {
        marquee: 'marquee 5s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      spacing: {
        7.5: '1.875rem',
        popover: 'var(--popover-padding)',
      },
      fontSize: {
        '2.5xl': ['1.75rem', '2.125rem'],
      },
    },
  },
  plugins: [],
}
