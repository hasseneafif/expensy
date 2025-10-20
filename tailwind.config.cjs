/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))'
      }
    }
  },
  plugins: [
    plugin(function({ addComponents }) {
      addComponents({
        '.glass-card': {
          '@apply relative p-6 rounded-2xl': {},
          '@apply bg-slate-900/20 backdrop-blur-xl': {},
          '@apply border border-slate-700/30': {},
          '@apply transition-all duration-300': {},
          '@apply hover:bg-slate-900/30 hover:border-slate-600/40': {},
          '@apply hover:scale-[1.02]': {}
        },
        '.btn-primary': {
          '@apply px-4 py-2 rounded-xl': {},
          '@apply bg-gradient-to-r from-cyan-500 to-blue-500': {},
          '@apply border border-cyan-500/30': {},
          '@apply text-white font-medium': {},
          '@apply transition-all duration-300': {},
          '@apply hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20': {}
        },
        '.btn-secondary': {
          '@apply px-4 py-2 rounded-xl': {},
          '@apply bg-slate-900/50': {},
          '@apply border border-slate-700/50': {},
          '@apply text-slate-300 font-medium': {},
          '@apply transition-all duration-300': {},
          '@apply hover:bg-slate-800/50 hover:border-slate-600/50': {}
        }
      })
    })
  ]
};
