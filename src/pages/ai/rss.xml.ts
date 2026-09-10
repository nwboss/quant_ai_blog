import rss from '@astrojs/rss';
import { siteConfig } from '../../site.config';
import { getTrackPosts, getPostSlug } from '../../lib/content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getTrackPosts('ai');
  const aiInfo = siteConfig.tracks.ai;

  return rss({
    title: `${siteConfig.title} - ${aiInfo.name}`,
    description: aiInfo.description,
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
