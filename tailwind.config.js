/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D2691E',
        secondary: '#8B4513',
        accent: '#FF6B35',
        surface: '#FFF8F3',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #D2691E 0%, #FF6B35 100%)',
        'gradient-surface': 'linear-gradient(135deg, #FFF8F3 0%, #FAFAFA 100%)',
        'gradient-overlay': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
      },
      borderRadius: {
        'lg': '12px',
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0,0,0,0.1)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.15)',
        'floating': '0 8px 32px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}