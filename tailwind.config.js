/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'background': '#051520',
        'surface-container-lowest': '#020f1b',
        'surface-container-low': '#0e1d29',
        'surface-container': '#12212d',
        'surface-container-high': '#1d2b38',
        'surface-container-highest': '#283643',
        'surface-bright': '#2c3b48',
        'surface-dim': '#051520',
        'surface-variant': '#283643',
        'surface-tint': '#3adfab',
        'surface': '#051520',

        'primary': '#42e5b0',
        'primary-container': '#00c896',
        'on-primary': '#003828',
        'on-primary-container': '#004d38',
        'primary-fixed': '#60fcc6',
        'primary-fixed-dim': '#3adfab',
        'on-primary-fixed': '#002116',
        'on-primary-fixed-variant': '#00513b',

        'secondary': '#c1c7d3',
        'secondary-container': '#464c56',
        'on-secondary': '#2b313a',
        'on-secondary-container': '#b6bcc8',
        'secondary-fixed': '#dde2ef',
        'secondary-fixed-dim': '#c1c7d3',
        'on-secondary-fixed': '#161c25',
        'on-secondary-fixed-variant': '#414751',

        'tertiary': '#ffbca2',
        'tertiary-container': '#ff9467',
        'on-tertiary': '#591d00',
        'on-tertiary-container': '#762b05',
        'tertiary-fixed': '#ffdbce',
        'tertiary-fixed-dim': '#ffb598',
        'on-tertiary-fixed': '#370e00',
        'on-tertiary-fixed-variant': '#7b2f09',

        'error': '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',

        'on-surface': '#d5e4f5',
        'on-surface-variant': '#bbcac1',
        'on-background': '#d5e4f5',
        'inverse-surface': '#d5e4f5',
        'inverse-on-surface': '#23323e',
        'inverse-primary': '#006c4f',

        'outline': '#85948c',
        'outline-variant': '#3c4a43',

        // Salvo semantic tokens
        'recovered': '#00C896',
        'risk': '#FF6B4A',
      },
      borderRadius: {
        'DEFAULT': '0.125rem',
        'lg': '0.25rem',
        'xl': '0.5rem',
        'full': '0.75rem'
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'base': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'sidebar_width': '240px',
        'gutter': '24px'
      },
      fontFamily: {
        'body-sm': ['Geist', 'Inter', 'sans-serif'],
        'body-md': ['Geist', 'Inter', 'sans-serif'],
        'headline-sm': ['Geist', 'Inter', 'sans-serif'],
        'headline-md': ['Geist', 'Inter', 'sans-serif'],
        'display-lg': ['Geist', 'Inter', 'sans-serif'],
        'metric-md': ['JetBrains Mono', 'monospace'],
        'metric-lg': ['JetBrains Mono', 'monospace'],
        'label-caps': ['JetBrains Mono', 'monospace'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '500' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '500' }],
        'display-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'metric-md': ['16px', { lineHeight: '20px', fontWeight: '500' }],
        'metric-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.04em', fontWeight: '500' }],
        'label-caps': ['11px', { lineHeight: '16px', letterSpacing: '0.06em', fontWeight: '600' }]
      }
    },
  },
  plugins: [],
};
