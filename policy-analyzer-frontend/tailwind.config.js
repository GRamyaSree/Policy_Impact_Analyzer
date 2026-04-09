/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'glow-purple': 'rgba(168, 85, 247, 0.5)',
        'glow-cyan': 'rgba(34, 211, 238, 0.5)',
      },
      boxShadow: {
        'lg-glow': '0 0 30px rgba(168, 85, 247, 0.4)',
        'xl-glow': '0 0 40px rgba(34, 211, 238, 0.3)',
        'neon-cyan': '0 0 20px rgba(34, 211, 238, 0.6)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.6)',
        'card-soft': '0 10px 40px rgba(0, 0, 0, 0.3)',
        'card-intense': '0 20px 60px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'wiggle': 'wiggle 0.3s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
      },
    },
  },
  plugins: [],
};
