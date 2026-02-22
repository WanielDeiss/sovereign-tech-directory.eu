module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.md',
    './assets/css/main.css'
  ],
  safelist: [
    'score-badge-range-low',
    'score-badge-range-limited',
    'score-badge-range-good',
    'score-badge-range-high'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        accent: '#0d9488',
        muted: '#64748b',
        yes: '#15803d',
        no: '#b91c1c',
        border: '#e2e8f0'
      },
      maxWidth: {
        content: '960px'
      },
      borderRadius: {
        DEFAULT: '8px',
        card: '14px'
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)'
      },
      fontSize: {
        'page-title': ['1.75rem', { lineHeight: '1.3' }],
        'section': ['1.125rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }]
      }
    }
  }
}
