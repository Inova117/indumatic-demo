/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Azul industrial — paleta principal Indumatic
        brand: {
          50: '#eef5fc',
          100: '#d6e6f7',
          200: '#aecbef',
          300: '#7dabe3',
          400: '#4b86d4',
          500: '#2a67bd',
          600: '#1e4f9c',
          700: '#193f7d',
          800: '#163461',
          900: '#12264a',
          950: '#0b1830',
        },
        wa: {
          // Verde WhatsApp
          header: '#075e54',
          headerLight: '#128c7e',
          bubble: '#dcf8c6',
          bg: '#e5ddd5',
          tick: '#34b7f1',
          green: '#25d366',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 40, 74, 0.04), 0 4px 16px -4px rgba(16, 40, 74, 0.08)',
        cardHover: '0 2px 4px 0 rgba(16, 40, 74, 0.06), 0 12px 28px -8px rgba(16, 40, 74, 0.16)',
        panel: '-8px 0 40px -12px rgba(11, 24, 48, 0.35)',
        toast: '0 8px 30px -6px rgba(16, 40, 74, 0.25)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateX(24px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        bubbleIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        flash: {
          '0%': { backgroundColor: 'rgba(37, 211, 102, 0.18)' },
          '100%': { backgroundColor: 'rgba(37, 211, 102, 0)' },
        },
        flashBlue: {
          '0%': { backgroundColor: 'rgba(42, 103, 189, 0.16)' },
          '100%': { backgroundColor: 'rgba(42, 103, 189, 0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        pingDot: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '75%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        fadeIn: 'fadeIn 0.4s ease-out both',
        slideInRight: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        toastIn: 'toastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        bubbleIn: 'bubbleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        flash: 'flash 1.1s ease-out',
        flashBlue: 'flashBlue 1.1s ease-out',
        pulseSoft: 'pulseSoft 1.6s ease-in-out infinite',
        pingDot: 'pingDot 1.4s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}
