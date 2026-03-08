/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:     '#1a56db',
        'primary-d': '#1340b0',
        'primary-l': '#e8effc',
        'primary-b': '#c3d4f7',
        txt:         '#1a1f36',
        muted:       '#6b7280',
        border:      '#e5e7eb',
        danger:      '#ef4444',
        success:     '#10b981',
        bg:          '#f5f6fa',
      },
      fontFamily: {
        brand: ['Rajdhani', 'sans-serif'],
        body:  ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
