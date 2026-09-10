import rss from '@astrojs/rss';
import { siteConfig } from '../../site.config';
import { getPublicNews, getNewsSlug } from '../../lib/content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const newsList = await getPublicNews();

  return rss({
    title: `${siteConfig.title} - 每日快讯早报`,
    description: '追踪全球宏观权益、量化因子动向与前沿 AI 推理模型的每日技术早报。',
    site: context.site?.toString() || siteConfig.siteUrl,
    items: newsList.map((item) => ({
      title: item.data.title,
      pubDate: item.data.date,
      description: item.data.description,
      link: `/news/${getNewsSlug(item)}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
