import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    track: z.enum(['quant', 'ai']),
    category: z.string(),
    format: z.enum(['tutorial', 'research', 'evaluation', 'review', 'weekly']),
    tags: z.array(z.string()).default([]),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(true),
    featured: z.boolean().default(false),
    cover: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    sources: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        accessDate: z.string().optional(),
      })
    ).optional(),
    codeUrl: z.string().optional(),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    track: z.enum(['quant', 'ai', 'mixed']),
    order: z.number().default(0),
    posts: z.array(z.string()), // list of post IDs/slugs in order
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    track: z.enum(['mixed', 'quant', 'ai']).default('mixed'),
    marketHighlights: z.array(z.string()).default([]),
    aiHighlights: z.array(z.string()).default([])
,
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
  }),
});

export const collections = {
  posts,
  series,
  news,
};

