# Local Development

## Prerequisites

- [Node.js](https://nodejs.org/) (for Tailwind CSS / PostCSS)
- [Hugo](https://gohugo.io/installation/) (CLI)

## Run locally

1. Install dependencies:  
   `npm install`
2. Start the development server:  
   `npm run dev`

The site is available at http://localhost:1313/

To build the site for production:  
`npm run build`  
Output is written to `public/`.

## Note: CSS (Tailwind / PostCSS)

CSS is processed by Hugo Pipes using PostCSS (Tailwind, Autoprefixer). Run `npm install` before the first start and after any change to `package.json`. No environment variable is required; Hugo automatically uses `postcss.config.js` and the PostCSS CLI from `node_modules`.
