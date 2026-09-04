import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1220',
        gold: '#f4b942',
        teal: '#1fb8a6',
        sand: '#f7f0e6',
        coral: '#ef7d57'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(31, 184, 166, 0.18)',
        panel: '0 24px 64px rgba(11, 18, 32, 0.12)'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 20% 20%, rgba(244, 185, 66, 0.18), transparent 28%), radial-gradient(circle at 80% 0%, rgba(31, 184, 166, 0.18), transparent 30%), linear-gradient(135deg, rgba(11, 18, 32, 0.96), rgba(16, 32, 58, 0.94))'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
