/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {

  
    animation: {
      'fade-in': 'fadeIn 1s ease-out forwards',
      'slide-in-top': 'slideInTop 0.8s ease-out forwards',
      'pop-in': 'popIn 0.5s ease-out forwards',
      'float1': 'float1 6s ease-in-out infinite',
      'float2': 'float2 8s ease-in-out infinite',
    
    'slide-in': 'slideIn 0.6s ease-out',
     'bounce-slow': 'bounceSlow 1s infinite',
     'fade-in-fast': 'fadeInFast 0.3s ease-out',
    },
    keyframes: {
     fadeIn: {
      '0%': { opacity: 0, transform: 'scale(0.95)' },
      '100%': { opacity: 1, transform: 'scale(1)' },
    },
     fadeInFast: {
      '0%': { opacity: 0, transform: 'scale(0.95)' },
      '100%': { opacity: 1, transform: 'scale(1)' },
    },
     bounceSlow: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-6%)' },
    },
      slideInTop: {
        '0%': { opacity: 0, transform: 'translateY(-40px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      slideIn: {
      '0%': { opacity: 0, transform: 'translateY(30px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
      popIn: {
        '0%': { opacity: 0, transform: 'scale(0.95)' },
        '100%': { opacity: 1, transform: 'scale(1)' },
      },
      float1: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-12px)' },
      },
      float2: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(14px)' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        
      primary: '#0047AB',
      secondary: '#020E1E',
        primary: {
         // mine: '#E6F5FF',
          light: '#E1F3FE',
          DEFAULT: '#C5E7F8', //blue
          dark: '#94D3F4',
          //041D56
        },
        secondary: {
          light: '#FAFAFA',
          DEFAULT: '#F9F9F9',
          dark: '#F0F0F0',
        },
        accent: {
          light: '#F0F9FF',
          DEFAULT: '#BDE6FA',
          dark: '#8AD1F5',
        },
        success: {
          light: '#ECFDF5',
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        warning: {
          light: '#FFFBEB',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        error: {
          light: '#FEF2F2',
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        }
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }, 
     
    animation: {
      'float': 'float 6s ease-in-out infinite',
      'bounce-slow': 'bounce 4s infinite',
    },
    keyframes: {
      float: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-6px)' },
      },
    },
    extend: {
  animation: {
    'fade-in': 'fadeIn 1s ease-out',
    'fade-in-slow': 'fadeIn 1.5s ease-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },
}

  

    },
  },
},
  plugins: [],
};