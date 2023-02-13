// @ts-check
const { plugin: ancestorVariants, toTheme } = require('./lib/index.cjs')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  theme: {
    ...toTheme([
      'theme-1',
      'theme-2',
      'theme-3',

      'user',
      'admin',
      'anon',

      'native',
      'browser',

      { variant: 't', selector: '.typography', specificity: 0, disableSelector: '.not-typography' },
    ]),
  },
  plugins: [
    ancestorVariants
  ]
}
