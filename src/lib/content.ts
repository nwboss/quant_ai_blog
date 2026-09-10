import { getCollection, type CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;
export type SeriesEntry = CollectionEntry<'series'>;
export type NewsEntry = CollectionEntry<'news'>;

/**
 * Extract canonical slug for a post
 */
export function getPostSlug(post: PostEntry): string {
  // If slug is defined in frontmatter, use it; otherwise fallback to filename without path & extension
  const idSlug = post.id.replace(/\.(md|mdx)$/, '').split('/').pop() || post.id;
  return idSlug;
}

/**
 * Filter public posts: draft === false and publishedAt <= now
 */
export function isPublicPost(post: PostEntry): boolean {
  const isDraft = post.data.draft;
  const isFuture = new Date(post.data.publishedAt).getTime() > Date.now();
  return !isDraft && !isFuture;
}

/**
 * Get all public posts sorted by published date descending
 */
export async function getPublicPosts(): Promise<PostEntry[]> {
  const allPosts = await getCollection('posts');
  return allPosts
    .filter(isPublicPost)
    .sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime());
}

/**
 * Get public posts by track ('quant' or 'ai')
 */
export async function getTrackPosts(track: 'quant' | 'ai'): Promise<PostEntry[]> {
  const posts = await getPublicPosts();
  return posts.filter((p) => p.data.track === track);
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(): Promise<PostEntry[]> {
  const posts = await getPublicPosts();
  return posts.filter((p) => p.data.featured);
}

/**
 * Get all unique tags with count
 */
export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  const posts = await getPublicPosts();
  const tagCountMap: Record<string, number> = {};

  for (const post of posts) {
    if (Array.isArray(post.data.tags)) {
      for (const tag of post.data.tags) {
        const trimmed = tag.trim();
        if (trimmed) {
          tagCountMap[trimmed] = (tagCountMap[trimmed] || 0) + 1;
        }
      }
    }
  }

  return Object.entries(tagCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<PostEntry[]> {
  const posts = await getPublicPosts();
  const decoded = decodeURIComponent(tag).toLowerCase();
  return posts.filter((p) =>
    p.data.tags.some((t) => t.toLowerCase() === decoded)
  );
}

/**
 * Get public series
 */
export async function getPublicSeries(): Promise<SeriesEntry[]> {
  const allSeries = await getCollection('series');
  return allSeries.sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
}

/**
 * Get related posts for a given post
 */
export async function getRelatedPosts(currentPost: PostEntry, limit = 3): Promise<PostEntry[]> {
  const posts = await getPublicPosts();
  const currentSlug = getPostSlug(currentPost);
  const currentTags = new Set(currentPost.data.tags.map((t) => t.toLowerCase()));

  const scored = posts
    .filter((p) => getPostSlug(p) !== currentSlug)
    .map((p) => {
      let score = 0;
      // same track gets base score
      if (p.data.track === currentPost.data.track) score += 2;
      // same category gets additional score
      if (p.data.category === currentPost.data.category) score += 3;
      // shared tags
      for (const t of p.data.tags) {
        if (currentTags.has(t.toLowerCase())) {
          score += 4;
        }
      }
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.post);
}

/**
 * Format mappings for labels
 */
export const formatLabels: Record<string, string> = {
  tutorial: '教程',
  research: '研究',
  evaluation: '评测',
  review: '观察',
  weekly: '周报',
};

/**
 * Extract canonical slug for a news daily report
 */
export function getNewsSlug(item: NewsEntry): string {
  const idSlug = item.id.replace(/\.(md|mdx)$/, '').split('/').pop() || item.id;
  return idSlug;
}

/**
 * Filter public news: draft === false and date <= now
 */
export function isPublicNews(item: NewsEntry): boolean {
  const isDraft = item.data.draft;
  const isFuture = new Date(item.data.date).getTime() > Date.now() + 86400000; // allow current day
  return !isDraft && !isFuture;
}

/**
 * Get all public news sorted by date descending
 */
export async function getPublicNews(): Promise<NewsEntry[]> {
  const allNews = await getCollection('news');
  return allNews
    .filter(isPublicNews)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}

/**
 * Get latest daily news report
 */
export async function getLatestDailyNews(): Promise<NewsEntry | null> {
  const newsList = await getPublicNews();
  return newsList[0] || null;
}

