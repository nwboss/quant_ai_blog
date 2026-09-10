import rss from '@astrojs/rss';
import { siteConfig } from '../site.config';
import { getPublicPosts, getPostSlug } from '../lib/content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getPublicPosts();

  return rss({
    title: `${siteConfig.title} - ${siteConfig.subtitle}`,
    description: siteConfig.description,
    site: context.site?.toString() || siteConfig.siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.description,
      link: `/blog/${getPostSlug(post)}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
