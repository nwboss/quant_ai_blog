import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Pages deployment support:
// In GitHub Actions (CI=true), default to '/quant_ai_blog'. In local dev, use '/'.
const isCI = Boolean(process.env.CI);
const base = process.env.ASTRO_BASE || (isCI ? '/quant_ai_blog' : '/');

export default defineConfig({
  site: 'https://nwboss.github.io',
  base: base,
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: false,
    },
  },
});
