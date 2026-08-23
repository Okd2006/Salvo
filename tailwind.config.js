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
        // Deep-space command center palette
        'background': '#03081A',
        'surface': '#020626',
        'surface-card': '#020626',
        'surface-elevated': '#090E38',
        'surface-hover': '#0C1340',

        // Hairline & structural borders
        'border-hairline': '#292F66',
        'border-secondary': '#4D5499',
        'outline-variant': '#292F66',
        'outline': '#4D5499',

        // Primary action & cobalt brand
        'primary': '#3D50FC',
        'primary-hover': '#5264FF',
        'primary-container': '#3D50FC',
        'on-primary': '#FFFFFF',

        // AI / System Telemetry
        'ai-signal': '#05E0E0',
        'cyan': '#05E0E0',

        // Typography colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#AAB1F2',
        'text-tertiary': '#7A83CC',
        'on-surface': '#FFFFFF',
        'on-surface-variant': '#AAB1F2',

        // Strict Financial Semantics
        'recovered': '#00C896',
        'risk': '#FF6B4A',
        'error': '#FF6B4A',
        'warning': '#F5A623',

        // Material / Stitch legacy mapping compatibility
        'surface-container-lowest': '#01030F',
        'surface-container-low': '#020626',
        'surface-container': '#020626',
        'surface-container-high': '#060B30',
        'surface-container-highest': '#0B1245',
      },
      borderRadius: {
        'card': '35px',
        'input': '35px',
        'btn': '48px',
        'tag': '17px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '35px',
        '3xl': '48px',
        'full': '9999px',
        'DEFAULT': '12px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'base': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        'sidebar_width': '240px',
        'gutter': '24px',
      },
      fontFamily: {
        'sans': ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'body-sm': ['Geist', 'Inter', 'sans-serif'],
        'body-md': ['Geist', 'Inter', 'sans-serif'],
        'headline-sm': ['Geist', 'Inter', 'sans-serif'],
        'headline-md': ['Geist', 'Inter', 'sans-serif'],
        'display-lg': ['Geist', 'Inter', 'sans-serif'],
        'metric-md': ['JetBrains Mono', 'monospace'],
        'metric-lg': ['JetBrains Mono', 'monospace'],
        'label-caps': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['76px', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '300' }],
        'page-title': ['44px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '300' }],
        'section-title': ['28px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '400' }],
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '300' }],
        'headline-md': ['28px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '400' }],
        'headline-sm': ['20px', { lineHeight: '1.35', fontWeight: '500' }],
        'body-md': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'metric-lg': ['36px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '500' }],
        'metric-md': ['15px', { lineHeight: '1.2', fontWeight: '500' }],
        'label-caps': ['11px', { lineHeight: '1.3', letterSpacing: '0.08em', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
