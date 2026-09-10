export interface SiteConfig {
  title: string;
  subtitle: string;
  description: string;
  author: string;
  siteUrl: string;
  tracks: {
    quant: {
      name: string;
      enName: string;
      description: string;
      categories: { id: string; name: string; description: string }[];
    };
    ai: {
      name: string;
      enName: string;
      description: string;
      categories: { id: string; name: string; description: string }[];
    };
  };
  nav: { title: string; href: string; badge?: string }[];
}

export const siteConfig: SiteConfig = {
  title: '智量双线 | Quant & AI',
  subtitle: '量化研究与人工智能双主线技术手记',
  description: '建设以中文阅读为主的量化与人工智能双主线个人技术博客，持续分享因子研究、策略回测、Agent 工作流与模型实战。',
  author: 'QuantAI Lab',
  siteUrl: 'https://blog-quant.example.com',
  tracks: {
    quant: {
      name: '量化频道',
      enName: 'Quantitative Research',
      description: '专注数据工程、多因子模型、CTA与动量策略、统计套利与风险归因。',
      categories: [
        { id: 'data-engineering', name: '数据工程', description: '数据清洗、本地投研数据库构建、高频/日线行情处理' },
        { id: 'factor-research', name: '因子研究', description: 'Alpha因子挖掘、因子有效性检验与IC衰减分析' },
        { id: 'backtesting', name: '策略回测', description: '向量化回测、事件驱动回测、交易摩擦与样本外检验' },
        { id: 'market-review', name: '市场观察', description: '跨资产动量、宏观流动性与盘面异动复盘' },
        { id: 'paper-replication', name: '研报复现', description: '经典学术论文与头部券商金工研报复现' },
      ],
    },
    ai: {
      name: 'AI 频道',
      enName: 'Artificial Intelligence',
      description: '探索大语言模型、Agent 智能体工作流、量化辅助研究与工程化落地实践。',
      categories: [
        { id: 'models-papers', name: '模型与论文', description: '基础模型架构、前沿论文解读与长文本/推理模型评测' },
        { id: 'agent-workflows', name: 'Agent 实践', description: '多智能体协作、投研助手工作流与自动化决策链' },
        { id: 'tool-evaluation', name: '工具评测', description: '开源开发框架、向量数据库与深度学习工具链评测' },
        { id: 'engineering', name: '工程经验', description: '模型微调、RAG 检索增强系统架构与高并发推理部署' },
      ],
    },
  },
  nav: [
    { title: '首页', href: '/' },
    { title: '量化', href: '/quant/' },
    { title: 'AI', href: '/ai/' },
    { title: '快讯日报', href: '/news/', badge: 'Daily' },
    { title: '专题', href: '/series/' },
    { title: '全部文章', href: '/blog/' },
    { title: '关于', href: '/about/' },
  ],
};
