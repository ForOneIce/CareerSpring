import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Compass, 
  MapPin, 
  CheckCircle2, 
  Heart, 
  LayoutDashboard, 
  PlusCircle, 
  Search,
  MessageSquareHeart,
  ChevronRight,
  Loader2,
  Calendar,
  Sparkles,
  ArrowLeft,
  PenLine,
  Download,
  Globe,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Briefcase,
  Trash2,
  Edit2,
  Filter,
  BarChart2,
  Link as LinkIcon,
  Star,
  MapPin as MapPinIcon,
  Tag,
  Clock,
  MoreHorizontal,
  Cpu,
  Headphones,
  FileText,
  Database,
  Layers,
  Wand2,
  Check,
  X,
  ChevronDown,
  Upload,
  Copy,
  Layout,
  Terminal,
  Users,
  Building2,
  Share2,
  Settings,
  Coffee,
  Cloud,
  CloudUpload,
  CloudDownload,
  Shield,
  FileSpreadsheet,
  FileJson,
  FileCode,
  Trees,
  Flag,
  MessageSquare,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  generateEncouragement, 
  generateIkigaiSynthesis, 
  analyzeIndustry, 
  parseJobPosting,
  generateResumeOptimization
} from './lib/gemini';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';

type Page = 'dashboard' | 'resume_workshop' | 'tracker' | 'know_self' | 'know_others' | 'podcast' | 'job_channels';

interface AssetRecord {
  id: string;
  category: 'work' | 'project' | 'edu' | 'skill' | 'honor' | 'portfolio' | 'social' | 'language' | 'volunteer';
  title: string;
  organization?: string;
  timeRange: string;
  description: string; // STAR or bullet points
  tags: string[];
  results?: string;
  isVisible: boolean;
}

interface ResumeVersion {
  id: string;
  name: string;
  targetJD: string;
  selectedAssetIds: string[];
  lastModified: string;
  aiSuggestions?: any;
}

function KnowOthers() {
  const [activeTab, setActiveTab] = useState('macro');
  const [keyword, setKeyword] = useState('');
  const [industryResult, setIndustryResult] = useState('');
  const [loading, setLoading] = useState(false);
  const aiResultRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    if (!keyword) return;
    setLoading(true);
    try {
      const res = await analyzeIndustry(keyword);
      setIndustryResult(res);
    } catch (e) {
      setIndustryResult('获取资讯失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  const downloadAIResult = async () => {
    if (!aiResultRef.current) return;
    const canvas = await html2canvas(aiResultRef.current, {
      backgroundColor: '#5B7052', // Using brand-primary hex
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const link = document.createElement('a');
    link.download = `industry-insight-${keyword}-${format(new Date(), 'yyyyMMdd')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const resourceCategories = [
    { 
      id: 'macro', 
      name: '宏观数据', 
      icon: <BarChart3 size={18} />,
      items: [
        { name: '国家统计局 AI 平台', url: 'https://www.stats.gov.cn/znwd/', desc: '智能问答助手，直接提问获取宏观经济数据' },
        { name: '智慧问答政务服务网', url: 'https://www.gdzwfw.gov.cn/zhwd/', desc: '提问失业金、就业帮扶条件等政务办事指引' },
        { name: 'ILO 中国劳动力市场概况', url: 'https://ilostat.ilo.org/data/country-profiles/chn/', desc: '国际劳工组织官方数据，包含就业质量、工时及劳动画像分析' },
        { name: '世界银行数据中心', url: 'https://data.worldbank.org.cn', desc: '全球经济对比与趋势' }
      ]
    },
    { 
      id: 'reports', 
      name: '行业研报', 
      icon: <Briefcase size={18} />,
      items: [
        { name: '发现报告', url: 'https://www.fxbaogao.com', desc: '收录海量券商研报与深度行研' },
        { name: '麦肯锡 (McKinsey) 中国', url: 'https://www.mckinsey.com.cn/', desc: '全球顶尖咨询机构，提供深度行业洞察与数字化转型白皮书' },
        { name: '哈佛商业评论 (HBR) 精选清单', url: 'https://hbr.org/reading-lists', desc: '管理学顶级智库，针对复杂商业问题的深度专题指引' },
        { name: '哈佛商业评论·中文版 案例库', url: 'https://www.hbrcitic.com/#/home/case?id=2966', desc: '深度商业案例研究，复盘名企决策路径与管理智慧' }
      ]
    },
    { 
      id: 'salary', 
      name: '薪酬需求', 
      icon: <TrendingUp size={18} />,
      items: [
        { name: '罗兰贝格 (Roland Berger)', url: 'https://www.rolandberger.com', desc: '发布权威的中国年度行业趋势报告' },
        { 
          name: 'AI Jobs Net Salaries', 
          url: 'https://aijobs.net/', 
          desc: '全球 AI/ML/大数据领域匿名薪资调查',
          highlight: true,
          tooltip: '按条件筛选后点击search，在结果详情中点击apply可跳转招聘方官网投递简历'
        }
      ]
    },
    { 
      id: 'media', 
      name: '行业资讯', 
      icon: <MessageSquareHeart size={18} />,
      items: [
        { name: '36氪', url: 'https://36kr.com', desc: '科技、创投、互联网前沿深度剖析' },
        { name: '虎嗅网', url: 'https://www.huxiu.com', desc: '商业分析与科技趋势见解' },
        { name: '雪球', url: 'https://xueqiu.com', desc: '投资者社区，实时掌握上市公司财报动态' },
        { name: '东方财富·上市公司公告搜索', url: 'https://so.eastmoney.com/ann/s?keyword=web3', desc: '实时检索上市公司公告，透视企业在 Web3/新技术领域的真实战略布局' }
      ]
    },
    { 
      id: 'policy', 
      name: '政策风口', 
      icon: <ShieldCheck size={18} />,
      items: [
        { name: '工信部官网', url: 'https://www.miit.gov.cn/search/zcwjk.html?websiteid=110000000000000&pg=&p=&tpl=14&category=183&q=', desc: '制造业及数字经济最新政策' },
        { name: '国家发改委', url: 'https://www.ndrc.gov.cn', desc: '产业规划与重点投资方向' },
        { name: 'a16z Policy', url: 'https://a16zpolicy.substack.com/archive?sort=new', desc: '硅谷顶尖风投 a16z 政策观察，从资本视角透视全球科技监管与产业趋势' },
        { name: '国家职业标准查询', url: 'https://www.osta.org.cn/career', desc: '官方职业资格查询系统，透视国家对各行业工种的技能要求与分级定义' }
      ]
    },
    { 
      id: 'ai', 
      name: 'AI研判', 
      icon: <Cpu size={18} />,
      items: [
        { name: 'Perplexity AI', url: 'https://www.perplexity.ai', desc: '实时搜索行业动态，结构化总结' }
      ]
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-medium text-brand-ink italic">广度知彼：外部全景指南</h2>
        <p className="text-sm text-brand-secondary max-w-2xl">
          了解大盘，锁定行业。在投入具体求职前，请先用这些专业工具看清你所处的坐标系。
        </p>
      </header>

      {/* AI Industry Search */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-brand-primary">
          <Sparkles size={20} />
          <h3 className="font-bold">AI 行业深度洞察 (Beta)</h3>
        </div>
        <div className="glass-card p-8 bg-brand-primary text-white space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary opacity-50" size={18} />
              <input 
                type="text" 
                placeholder="输入你感兴趣的行业关键词（如：AI制药、低空经济、数字化咨询）..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-white text-brand-ink px-12 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#ffffff33] transition-all"
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={loading || !keyword}
              className="bg-white text-brand-primary px-8 py-4 rounded-2xl font-bold hover:bg-brand-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              一键研判
            </button>
          </div>
          
          <AnimatePresence>
            {industryResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div 
                  ref={aiResultRef}
                  className="bg-[#ffffff1a] p-8 rounded-3xl border border-[#ffffff33] backdrop-blur-sm shadow-inner"
                >
                  <div className="flex justify-between items-center mb-6 border-b border-[#ffffff33] pb-4">
                    <div className="flex items-center gap-2 text-white">
                      <Sparkles size={18} />
                      <span className="font-serif italic font-bold text-lg">AI 深度研判报告：{keyword}</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest opacity-60">Generate by AI Resilience Hub</div>
                  </div>
                  <div className="max-w-none text-white leading-relaxed italic text-sm markdown-body">
                    <ReactMarkdown>{industryResult}</ReactMarkdown>
                  </div>
                  <div className="mt-8 pt-4 border-t border-[#ffffff33] text-[10px] opacity-40 text-center uppercase tracking-tighter">
                    © {new Date().getFullYear()} 重启能量站 | 面向未来的求职深度指南
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={downloadAIResult}
                    className="flex items-center gap-2 px-6 py-2 bg-[#ffffff26] hover:bg-[#ffffff40] text-white rounded-full text-xs font-bold transition-all border border-[#ffffff33]"
                  >
                    <Download size={14} /> 保存研判结果图片
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Resource Explorer */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-brand-primary">
          <Briefcase size={20} />
          <h3 className="font-bold">行业研究工具箱大全</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {resourceCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === cat.id 
                  ? 'bg-brand-primary text-white custom-shadow-sm' 
                  : 'bg-white text-brand-secondary border border-brand-divider hover:border-brand-muted'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resourceCategories.find(c => c.id === activeTab)?.items.map((item: any, i) => (
            <a 
              key={i} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              title={item.tooltip}
              className={`glass-card p-6 bg-white border-brand-divider hover:border-brand-primary hover:-translate-y-1 transition-all group ${item.highlight ? 'ring-2 ring-brand-primary border-brand-primary bg-brand-active/10' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-brand-ink group-hover:text-brand-primary transition-colors">{item.name}</h4>
                <ChevronRight size={16} className="text-brand-muted group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-brand-secondary leading-relaxed serif underline decoration-[#5B705233] underline-offset-4">
                {item.desc}
              </p>
            </a>
          ))}
        </div>
      </section>
      
      {/* Ending Quote */}
      <div className="p-10 text-center space-y-4">
        <p className="text-lg font-serif italic text-brand-secondary">
          "避免目标发散的关键，不是看更多行业，而是做好一个行业的深度研究。"
        </p>
        <div className="w-12 h-0.5 bg-brand-divider mx-auto"></div>
      </div>
    </div>
  );
}

function PodcastPage() {
  const podcastCategories = [
    {
      name: '商业与投资',
      items: [
        { name: '大方谈钱', url: 'https://www.xiaoyuzhoufm.com/podcast/66ed1e69dbf9bb012f843e39', desc: '探讨ETF、基建、游戏、消费等领域的投资逻辑' },
        { name: '一周富盘 (有富同享)', url: 'https://www.xiaoyuzhoufm.com/podcast/67210f3733c798676ff0f99e', desc: '每周复盘财经市场热点，解读AI、算力、股市、政策等投资机会' },
        { name: '半拿铁·周刊', url: 'https://www.xiaoyuzhoufm.com/podcast/648b0b641c48983391a63f98', desc: '每周盘点商业科技领域的重要事件，涵盖公司动态、行业趋势和社会热点' },
        { name: '铜镜', url: 'https://www.xiaoyuzhoufm.com/podcast/60502e253c92d4f62c2a9577', desc: '探讨地缘政治、宏观经济、投资策略及AI技术应用的交叉影响' }
      ]
    },
    {
      name: '科技与前沿',
      items: [
        { name: '十字路口', url: 'https://www.xiaoyuzhoufm.com/podcast/6627fda4b56459544087d86a', desc: '访谈Z世代年轻人及AI领域创业者，探讨AI时代的职业选择和创业机会' },
        { name: '卫诗婕｜漫谈 Light the Star', url: 'https://www.xiaoyuzhoufm.com/podcast/5e7cc741418a84a046b0c2bd', desc: '深度访谈科技商业领域的创新者，关注技术进步与公共利益' },
        { name: '42 章经', url: 'https://www.xiaoyuzhoufm.com/podcast/685e568f8d5a9c9c2e59bc59', desc: '与商业和科技领域的“聪明人”进行深度对话，分享独到认知' },
        { name: 'She Rewires Digital (她原力数字)', url: 'https://www.xiaoyuzhoufm.com/podcast/67b92c728671d63e927d8eee', desc: '科技女性社群的知识分享，内容涉及职业发展、AI技术和可持续发展' },
        { name: '码农姐妹', url: 'https://www.xiaoyuzhoufm.com/podcast/682c566cc7c5f17595635a2c', desc: '访谈科技领域的女性从业者，分享技术岗位的成长故事和职业规划' }
      ]
    },
    {
      name: '职场与职业发展',
      items: [
        { name: '咱们女的', url: 'https://www.xiaoyuzhoufm.com/podcast/63d945ece725b5378a158d29', desc: '聚焦女性在职场、生活、自我认知方面的成长与困惑' },
        { name: 'Women at Work (职场女性说/精怪)', url: 'https://www.xiaoyuzhoufm.com/podcast/625635587bfca4e73e990703', desc: '解答具体职场困惑，如向上管理、冲突处理、焦虑应对等' },
        { name: 'BYM 职场系列', url: 'https://www.xiaoyuzhoufm.com/podcast/65b9c7c3a27e56484f5eaf54', desc: '分享职业发展中的方法论，涵盖面试、晋升、管理等话题' },
        { name: '菲说不可 | 职业规划会客厅', url: 'https://www.xiaoyuzhoufm.com/podcast/605a9eec154dad0489a292e7', desc: '由资深HR/职业规划师分享职场故事、法律知识和规划建议' },
        { name: '转行芝士', url: 'https://www.xiaoyuzhoufm.com/podcast/685d6dacf5fd5b06d4ee7c80', desc: '分享不同行业人士的转行故事和经验' },
        { name: '职场脱轨指南 Out of Office', url: 'https://www.xiaoyuzhoufm.com/podcast/6854eb7973016f3aea8a6f8f', desc: '探讨副业、创业、职场焦虑等，寻找工作与生活的其他可能性' },
        { name: '公司茶水间', url: 'https://www.xiaoyuzhoufm.com/podcast/65d41a956a963a082d9b7291', desc: '围绕职场困惑、职业选择和生活状态进行访谈' }
      ]
    },
    {
      name: '女性成长与生活',
      items: [
        { name: '岩中花述', url: 'https://www.xiaoyuzhoufm.com/podcast/65b23bb30bef6c20743377f5', desc: '主持人鲁豫与各界女性的深度对话，探讨生命体验和成长' },
        { name: '她们的选择', url: 'https://www.xiaoyuzhoufm.com/podcast/5e280fac418a84a0461fafd6', desc: '探讨25-35岁女性如何自定义人生，平衡职业、生活与外界期待' },
        { name: '与她有关', url: 'https://www.xiaoyuzhoufm.com/podcast/650a6a3e3c280acc06af6770', desc: '聚焦女性在职场、创业、生活方式和自我探索方面的成长' },
        { name: '海那边的女子', url: 'https://www.xiaoyuzhoufm.com/podcast/5e7c91bf418a84a046f9b318', desc: '记录普通女性在海外开启第二人生的真实经历与感悟' },
        { name: '姐妹悄悄話', url: 'https://www.xiaoyuzhoufm.com/podcast/6278b07ad6e7a5551f799dd0', desc: '两位女性主持人闲聊情感、关系、沟通和自我成长等生活话题' },
        { name: '搞钱女孩', url: 'https://www.xiaoyuzhoufm.com/podcast/63e33eb37cd428dce00343d7', desc: '分享女性在理财、创业、消费降级等方面的真实故事和经验' },
        { name: '看见她', url: 'https://www.xiaoyuzhoufm.com/podcast/61ab42d1d28510c8f75c7fc2', desc: '对话100个宝藏小姐姐，聚焦多元女性人生、职业突破与成长叙事' },
        { name: '闪光少女', url: 'https://www.xiaoyuzhoufm.com/podcast/604f3cd042d469df009c3e0d', desc: '陪伴年轻女孩成长的平台，分享闪闪发光的女性故事，呈现女性的状态、能量与智慧' }
      ]
    },
    {
      name: '文化与社会观察',
      items: [
        { name: '随机波动 Stochastic Volatility', url: 'https://www.xiaoyuzhoufm.com/podcast/654e17a8aa96f6e642698936', desc: '三位女性媒体人主持，深入探讨文化、社会、影视及女性议题' },
        { name: '人间，小事', url: 'https://www.xiaoyuzhoufm.com/podcast/675a4c03c3c61573b7564b74', desc: '主播分享生活感悟，内容涵盖养生、旅行、投资和心灵成长' }
      ]
    },
    {
      name: '生活方式与人物纪实',
      items: [
        { name: '100 种生活', url: 'https://www.xiaoyuzhoufm.com/podcast/645657b2a49ee05e1201aebe', desc: '每期带你走进一个不同的生活方式，采访不同背景人士，分享职场与生活的真实故事与思考' },
        { name: '半拿铁·商业沉浮录', url: 'https://www.xiaoyuzhoufm.com/podcast/65dcb1addaf4f3db3e5378d0', desc: '讲述中国商业史上的著名公司和人物沉浮故事' },
        { name: '故事FM', url: 'https://www.xiaoyuzhoufm.com/podcast/652775ef36a1383a663c94c7', desc: '亲历者自述真实故事，涵盖社会、情感、职业等多元人生体验' }
      ]
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 pb-20">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-medium text-brand-ink italic">听见可能：播客深度洞察</h2>
        <p className="text-sm text-brand-secondary max-w-2xl">
          在声音中寻找共鸣与启发。通过深度访谈与商业复盘，拓宽你的认知边界，发现职场与生活的无限可能。
        </p>
      </header>

      <div className="space-y-12">
        {podcastCategories.map((category, idx) => (
          <section key={idx} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-brand-primary rounded-full"></div>
              <h3 className="text-lg font-bold text-brand-ink">{category.name}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, i) => (
                <a 
                  key={i} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="glass-card p-6 bg-white border-brand-divider hover:border-brand-primary hover:-translate-y-1 transition-all group relative overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <Headphones size={80} />
                  </div>
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <h4 className="font-bold text-brand-ink group-hover:text-brand-primary transition-colors pr-8">
                      {item.name}
                    </h4>
                    <Headphones size={16} className="text-brand-muted group-hover:text-brand-primary transition-colors flex-shrink-0" />
                  </div>
                  
                  <p className="text-xs text-brand-secondary leading-relaxed serif relative z-10">
                    {item.desc}
                  </p>
                  
                  <div className="mt-4 flex items-center text-[10px] text-brand-muted font-bold uppercase tracking-widest gap-1 group-hover:text-brand-primary transition-colors relative z-10">
                    <span>Listen on Little Universe</span>
                    <ChevronRight size={10} />
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="p-10 text-center space-y-6 border-t border-brand-divider mt-10">
        <p className="text-lg font-serif italic text-brand-secondary">
          "有时候，改变人生的不是一本书，而是一段刚好在此时此地传入耳中的对话。"
        </p>
        <div className="space-y-2">
          <div className="w-12 h-0.5 bg-brand-divider mx-auto"></div>
          <p className="text-[10px] text-brand-muted uppercase tracking-widest font-bold">
            Released under CC BY-NC-SA 4.0
          </p>
          <p className="text-[9px] text-brand-muted opacity-60">
            本项目采用 Creative Commons BY-NC-SA 4.0 协议开源
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem('RESILIENCE_GEMINI_KEY') || '';
  });

  // --- Lifted States ---
  const [assets, setAssets] = useState<AssetRecord[]>(() => {
    const saved = localStorage.getItem('resilience_assets');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        category: 'work',
        title: '高级新媒体运营',
        organization: '某大厂电商',
        timeRange: '2022.01 - 2024.03',
        description: '负责公众号运营，利用数据分析提升转化。撰写10+篇爆款文章，累计获阅读量100万+。',
        tags: ['内容运营', '数据分析', '互联网'],
        results: 'DAU 提升 15%，转化率翻倍',
        isVisible: true
      }
    ];
  });
  
  const [versions, setVersions] = useState<ResumeVersion[]>(() => {
    const saved = localStorage.getItem('resilience_resume_versions');
    return saved ? JSON.parse(saved) : [];
  });

  const [jobs, setJobs] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('resilience_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('resilience_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('resilience_resume_versions', JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    localStorage.setItem('resilience_jobs', JSON.stringify(jobs));
  }, [jobs]);

  // --- Workspace Sync Logic ---
  const handleBackupToGoogle = async () => {
    setSyncStatus('loading');
    setSyncMessage('正在初始化数据同步...');
    
    try {
      // 1. Export Assets to CSV-like format for Spreadsheet
      const assetHeader = "ID,分类,标题,机构,时间范围,描述,标签,成果\n";
      const assetContent = assets.map(a => 
        `"${a.id}","${a.category}","${a.title}","${a.organization}","${a.timeRange}","${a.description.replace(/"/g, '""')}","${a.tags.join(',')}","${a.results || ''}"`
      ).join('\n');
      const assetBlob = new Blob([assetHeader + assetContent], { type: 'text/csv' });

      // 2. Export Jobs to JSON
      const jobsBlob = new Blob([JSON.stringify(jobs, null, 2)], { type: 'application/json' });

      // 3. Export Versions to JSON
      const versionsBlob = new Blob([JSON.stringify(versions, null, 2)], { type: 'application/json' });

      // Create download links for now as a fallback if OAuth is not yet completed in UI
      const timestamp = format(new Date(), 'yyyyMMdd_HHmm');
      
      const download = (blob: Blob, name: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
      };

      download(assetBlob, `能量站_经验资产库_${timestamp}.csv`);
      download(jobsBlob, `能量站_投递记录_${timestamp}.json`);
      download(versionsBlob, `能量站_简历版本_${timestamp}.json`);

      setSyncStatus('success');
      setSyncMessage('备份文件已生成并下载。我们建议您将其保存到 Google Drive 的“重启能量站”文件夹中。');
    } catch (err) {
      setSyncStatus('error');
      setSyncMessage('备份失败，请检查浏览器权限。');
    }
  };

  const handleImportAssets = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim());
        const imported: AssetRecord[] = [];
        
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (parts && parts.length >= 6) {
            const clean = (s: string) => s.replace(/^"|"$/g, '').replace(/""/g, '"');
            imported.push({
              id: clean(parts[0]) || Date.now().toString() + i,
              category: clean(parts[1]) as any,
              title: clean(parts[2]),
              organization: clean(parts[3]),
              timeRange: clean(parts[4]),
              description: clean(parts[5]),
              tags: parts[6] ? clean(parts[6]).split(',') : [],
              results: parts[7] ? clean(parts[7]) : '',
              isVisible: true
            });
          }
        }
        
        if (imported.length > 0) {
          setAssets(prev => {
            const existingIds = new Set(prev.map(a => a.id));
            const uniqueNew = imported.filter(a => !existingIds.has(a.id));
            return [...uniqueNew, ...prev];
          });
          alert(`成功导入 ${imported.length} 条记录！`);
        }
      } catch (err) {
        alert('文件解析失败，请确保格式正确。');
      }
    };
    reader.readAsText(file);
  };

  const saveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem('RESILIENCE_GEMINI_KEY', key);
    } else {
      localStorage.removeItem('RESILIENCE_GEMINI_KEY');
    }
    setIsSettingsOpen(false);
    window.location.reload(); // Reload to apply new key
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink font-sans flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1280px] bg-white rounded-[40px] custom-shadow-sm border border-brand-border overflow-hidden flex flex-col h-[calc(100vh-4rem)] md:h-[800px]">
        {/* Top Header */}
        <AnimatePresence>
          {isSyncOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-ink/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[40px] shadow-2xl p-10 w-full max-w-xl relative border border-brand-divider"
              >
                <button 
                  onClick={() => setIsSyncOpen(false)}
                  className="absolute top-6 right-6 p-2 text-brand-muted hover:text-brand-ink transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-brand-primary mb-2">
                      <div className="p-2 bg-brand-hover rounded-xl">
                        <Cloud size={24} />
                      </div>
                      <h3 className="text-2xl font-serif font-medium text-brand-ink italic">云端同步与本地备份</h3>
                    </div>
                    <p className="text-xs text-brand-secondary leading-relaxed">
                      虽然本站不强制联网数据库以保护隐私，但我们强烈建议您定期备份数据。您可以选择“安全导出”到本地。
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Backup Section */}
                    <div className="p-6 bg-brand-surface rounded-3xl border border-brand-divider space-y-4">
                      <div className="flex items-center gap-2 text-brand-ink font-bold text-sm">
                        <CloudUpload size={18} className="text-brand-primary" />
                        一键导出备份
                      </div>
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-[10px] text-brand-secondary">
                           <FileSpreadsheet size={12} /> 经验资产库 (.csv)
                         </div>
                         <div className="flex items-center gap-2 text-[10px] text-brand-secondary">
                           <FileCode size={12} /> 简历版本 (.json)
                         </div>
                         <div className="flex items-center gap-2 text-[10px] text-brand-secondary">
                           <FileJson size={12} /> 投递记录 (.json)
                         </div>
                      </div>
                      <button 
                        onClick={handleBackupToGoogle}
                        className="w-full py-3 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-sm hover:-translate-y-0.5 transition-all"
                      >
                        生成并下载备份
                      </button>
                    </div>

                    {/* Import Section */}
                    <div className="p-6 border border-brand-divider border-dashed rounded-3xl space-y-4">
                      <div className="flex items-center gap-2 text-brand-ink font-bold text-sm">
                        <CloudDownload size={18} className="text-[#3B82F6]" />
                        经验资产导入
                      </div>
                      <p className="text-[10px] text-brand-muted leading-relaxed">
                        仅支持导入之前导出的经验资产 CSV 文件。
                      </p>
                      <label 
                        className="block w-full py-3 bg-white border border-brand-divider text-brand-ink rounded-xl text-xs font-bold text-center cursor-pointer hover:bg-brand-hover transition-colors"
                      >
                        选择 CSV 文件
                        <input type="file" accept=".csv" className="hidden" onChange={handleImportAssets} />
                      </label>
                    </div>
                  </div>

                  {syncStatus !== 'idle' && (
                    <div className={`p-4 rounded-2xl text-[10px] font-medium ${
                      syncStatus === 'success' ? 'bg-[#F2F4ED] text-brand-primary border border-brand-divider' : 
                      syncStatus === 'loading' ? 'bg-brand-surface text-brand-secondary' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {syncMessage}
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-brand-hover rounded-2xl">
                    <Shield size={20} className="text-brand-primary shrink-0 opacity-40" />
                    <p className="text-[9px] text-brand-secondary leading-relaxed">
                      <strong>隐私警示</strong>：本站所有数据均存储在您的本地浏览器中。如果您清除浏览器缓存或更换设备，数据将会丢失。请务必妥善保管导出的 JSON/CSV 文件。
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <header className="px-10 pt-10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-brand-divider">
          <div>
            <h1 className="text-3xl font-serif font-medium text-brand-primary italic mb-1">重启能量站</h1>
            <p className="text-sm text-brand-secondary tracking-wide uppercase">Resilience Path: Your Healing Career Journey</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 bg-brand-surface hover:bg-brand-hover text-brand-secondary rounded-full transition-all border border-brand-divider shadow-sm group"
              title="设置 API Key"
             >
               <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
             </button>
          </div>
        </header>

        <AnimatePresence>
          {isSettingsOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-ink/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[40px] shadow-2xl p-10 w-full max-w-md relative border border-brand-divider"
              >
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="absolute top-6 right-6 p-2 text-brand-muted hover:text-brand-ink transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-medium text-brand-ink italic">设置 API Key</h3>
                    <p className="text-xs text-brand-secondary leading-relaxed">
                      你可以配置自己的 Gemini API Key 来获得更高的使用限额或更稳定的体验。如果不配置，将使用系统默认 Key。
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Gemini API Key</label>
                       <input 
                        type="password"
                        placeholder="在此输入你的 API Key..."
                        value={customApiKey}
                        onChange={(e) => setCustomApiKey(e.target.value)}
                        className="w-full bg-brand-surface border border-brand-divider rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm font-mono"
                       />
                       <p className="text-[10px] text-brand-muted italic">
                         提示：Key 项目将安全地保存在您的本地浏览器缓存中。
                       </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                        onClick={() => saveApiKey(customApiKey)}
                        className="flex-1 bg-brand-primary text-white py-4 rounded-2xl font-bold custom-shadow-sm hover:-translate-y-0.5 transition-all"
                       >
                         保存设置
                       </button>
                       <button 
                        onClick={() => {
                          setCustomApiKey('');
                          saveApiKey('');
                        }}
                        className="flex-1 bg-brand-surface text-brand-ink border border-brand-divider py-4 rounded-2xl font-bold hover:bg-brand-hover transition-all"
                       >
                         恢复默认
                       </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-brand-divider text-center">
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-brand-primary font-bold uppercase tracking-widest hover:underline"
                    >
                      获取免费的 Gemini API Key →
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-1 overflow-hidden">
          {/* Navigation Sidebar */}
          <aside className="w-20 md:w-64 border-r border-brand-divider p-6 flex flex-col gap-2 bg-white">
            <div className="hidden md:block px-4 py-2 text-[11px] font-bold text-brand-muted uppercase tracking-tighter mb-2">求职生命周期</div>
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="01. 愈心面板" 
              active={currentPage === 'dashboard'} 
              onClick={() => setCurrentPage('dashboard')} 
            />
            <NavItem 
              icon={<Search size={18} />} 
              label="02. 深度知己" 
              active={currentPage === 'know_self'} 
              onClick={() => setCurrentPage('know_self')} 
            />
            <NavItem 
              icon={<Globe size={18} />} 
              label="03. 广度知彼" 
              active={currentPage === 'know_others'} 
              onClick={() => setCurrentPage('know_others')} 
            />
            <NavItem 
              icon={<Terminal size={18} />} 
              label="04. 求职渠道" 
              active={currentPage === 'job_channels'} 
              onClick={() => setCurrentPage('job_channels')} 
            />
            <NavItem 
              icon={<Layers size={18} />} 
              label="05. 简历工坊" 
              active={currentPage === 'resume_workshop'} 
              onClick={() => setCurrentPage('resume_workshop')} 
            />
            <NavItem 
              icon={<MapPin size={18} />} 
              label="06. 探索记录" 
              active={currentPage === 'tracker'} 
              onClick={() => setCurrentPage('tracker')} 
            />
            <NavItem 
              icon={<Headphones size={18} />} 
              label="07. 听见可能" 
              active={currentPage === 'podcast'} 
              onClick={() => setCurrentPage('podcast')} 
            />

            <div className="pt-2">
              <button 
                onClick={() => setIsSyncOpen(true)}
                className="w-full py-4 bg-brand-surface hover:bg-brand-hover text-brand-secondary border border-brand-divider rounded-[24px] flex items-center justify-center gap-3 text-xs font-bold transition-all group shadow-sm active:scale-95"
              >
                <Cloud size={16} className="text-brand-primary group-hover:scale-110 transition-transform" />
                <span>数据同步与备份</span>
              </button>
            </div>
            
            <div className="mt-auto hidden md:block p-4 bg-brand-hover rounded-[24px]">
              <p className="text-xs italic leading-relaxed text-brand-secondary">"最深沉的休息，是找回与自己价值观共振的方向。"</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-brand-surface overflow-y-auto relative p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {currentPage === 'dashboard' && <Dashboard />}
                {currentPage === 'job_channels' && <JobChannels />}
                {currentPage === 'resume_workshop' && (
                  <ResumeWorkshop 
                    assets={assets} 
                    setAssets={setAssets} 
                    versions={versions} 
                    setVersions={setVersions} 
                  />
                )}
                {currentPage === 'know_self' && <KnowSelf />}
                {currentPage === 'know_others' && <KnowOthers />}
                {currentPage === 'tracker' && (
                  <Tracker 
                    jobs={jobs} 
                    setJobs={setJobs} 
                  />
                )}
                {currentPage === 'podcast' && <PodcastPage />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Ko-fi Floating Widget */}
      <a 
        href="https://ko-fi.com/iceflake0" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-[200] group flex items-center gap-3 bg-white border border-brand-divider p-3 pl-4 rounded-full custom-shadow-lg hover:border-brand-primary transition-all hover:-translate-y-1 active:translate-y-0"
      >
        <div className="flex flex-col items-start leading-none pr-1">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest group-hover:text-brand-primary transition-colors">Support Me</span>
          <span className="text-xs font-serif italic text-brand-secondary">Buy me a tea</span>
        </div>
        <div className="w-10 h-10 bg-brand-hover text-brand-primary rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
          <Coffee size={20} />
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-brand-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
      </a>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={active ? 'sidebar-btn-active w-full' : 'sidebar-btn w-full'}
    >
      {active && <div className="w-2 h-2 rounded-full bg-brand-primary"></div>}
      {!active && <div className="w-2 h-2 rounded-full border border-brand-secondary"></div>}
      <span className="hidden md:block font-medium">{label}</span>
    </button>
  );
}

interface Tool {
  name: string;
  value: string;
  desc: string;
  toolId?: string;
  link?: string;
}

function KnowSelf() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const dimensions: { id: number, title: string, subtitle: string, tools: Tool[] }[] = [
    { 
      id: 0, 
      title: '性格与偏好', 
      subtitle: '我是谁？适合什么环境？',
      tools: [
        { name: '霍兰德职业兴趣测试 (RIASEC)', value: '职场定位金标准', desc: '将职业兴趣分为六种类型，帮助你缩小行业范围。适合判断职业大方向。', toolId: 'riasec' }
      ]
    },
    { 
      id: 1, 
      title: '价值观与动机', 
      subtitle: '我想要什么？什么能驱动我？',
      tools: [
        { name: '埃德加·施恩的职业锚', value: '不愿放弃的核心观', desc: '识别技术型、管理型、独立型等八大锚点，提前过滤“三观不合”的岗位。', toolId: 'career_anchors' }
      ]
    },
    { 
      id: 2, 
      title: '天赋与优势', 
      subtitle: '我擅长什么？核心竞争力在哪？',
      tools: [
        { name: '盖洛普优势识别器 (CliftonStrengths)', value: '四大天赋领域测评', desc: '识别你的执行、影响、关系建立与战略思考维度，找到你的核心天赋原动力。', toolId: 'strengths' }
      ]
    },
    { 
      id: 3, 
      title: '整合与聚焦', 
      subtitle: '如何避免目标发散？',
      tools: [
        { name: 'Ikigai (生之意义) 图谱', value: '跨领域整合框架', desc: '结合热爱、擅长、世界需要、能获报酬四个圆圈，锁定最佳职业交集。', toolId: 'ikigai' }
      ]
    }
  ];

  if (selectedToolId === 'ikigai') {
    return <IkigaiTool onBack={() => setSelectedToolId(null)} />;
  }

  if (selectedToolId === 'riasec') {
    return <HollandTestTool onBack={() => setSelectedToolId(null)} />;
  }

  if (selectedToolId === 'career_anchors') {
    return <CareerAnchorsTool onBack={() => setSelectedToolId(null)} />;
  }

  if (selectedToolId === 'strengths') {
    return <StrengthsTool onBack={() => setSelectedToolId(null)} />;
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-medium italic text-brand-ink">深度知己：建立清晰自知</h2>
        <p className="text-sm text-brand-secondary max-w-2xl leading-relaxed">
          “了解自己”是求职中最能节省时间的环节。通过多维度的深度剖析，将模糊的感觉转化为清晰的策略，避免盲目投递产生的内耗。
        </p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-brand-divider overflow-x-auto no-scrollbar">
        {dimensions.map((dim) => (
          <button
            key={dim.id}
            onClick={() => setActiveTab(dim.id)}
            className={`px-6 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
              activeTab === dim.id 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-brand-muted hover:text-brand-secondary'
            }`}
          >
            {dim.title}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
          <span className="text-brand-secondary italic text-sm">{dimensions[activeTab].subtitle}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dimensions[activeTab].tools.map((tool, idx) => (
            <div key={idx} className="glass-card p-8 group hover:border-brand-primary bg-white flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-brand-ink group-hover:text-brand-primary transition-colors">{tool.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-hover px-2 py-1 rounded">
                    {tool.value}
                  </span>
                </div>
                <p className="text-sm text-brand-secondary leading-relaxed mb-6">
                  {tool.desc}
                </p>
              </div>
              {tool.toolId ? (
                <button 
                  onClick={() => setSelectedToolId(tool.toolId)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary hover:gap-3 transition-all pt-4 border-t border-brand-divider w-full text-left"
                >
                  开启站内互动工具 <PenLine size={14} className="ml-1" />
                </button>
              ) : (
                <a 
                  href={tool.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary hover:gap-3 transition-all pt-4 border-t border-brand-divider w-full"
                >
                  查看资源/测试 <ChevronRight size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Guidance Note */}
      <div className="p-8 bg-brand-primary text-white rounded-[40px] custom-shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        <h4 className="text-lg font-serif italic mb-4">💡 整合聚焦建议</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium">
          <div className="bg-[#ffffff1a] p-4 rounded-2xl">
            <span className="block opacity-60 mb-2">步骤 01</span>
            测霍兰德 (定行业大方向)
          </div>
          <div className="bg-[#ffffff1a] p-4 rounded-2xl">
            <span className="block opacity-60 mb-2">步骤 02</span>
            测职业锚 (定公司类型/价值观)
          </div>
          <div className="bg-[#ffffff1a] p-4 rounded-2xl">
            <span className="block opacity-60 mb-2">步骤 03</span>
            测盖洛普 (定具体岗位职能)
          </div>
          <div className="bg-white text-brand-primary p-4 rounded-2xl border-2 border-brand-active custom-shadow-lg relative overflow-hidden group">
            <span className="block text-brand-muted mb-2 font-bold uppercase">步骤 04</span>
            <span className="font-bold block">开启 Ikigai 互动工具 (做最终决策)</span>
            <div className="mt-2 text-[10px] opacity-80 leading-snug">
              ✨ 如果你已经足够了解自己，可以跳过前三步直接开始这里。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IkigaiTool({ onBack }: { onBack: () => void }) {
  const [love, setLove] = useState('');
  const [goodAt, setGoodAt] = useState('');
  const [need, setNeed] = useState('');
  const [pay, setPay] = useState('');
  const [synthesis, setSynthesis] = useState('');
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSynthesize = async () => {
    if (!love || !goodAt || !need || !pay) return;
    setLoading(true);
    try {
      const res = await generateIkigaiSynthesis(love, goodAt, need, pay);
      setSynthesis(res || '');
    } catch (e) {
      setSynthesis('分析中遇到了一些波折，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: '#f7f8f2',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `ikigai-${format(new Date(), 'yyyyMMdd')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity">
          <ArrowLeft size={18} /> 返回深度知己
        </button>
        {synthesis && (
          <button 
            onClick={handleDownload}
            className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity bg-brand-hover px-4 py-2 rounded-full"
          >
            <Download size={18} /> 保存结果图
          </button>
        )}
      </div>

      <div ref={resultRef} className="p-8 rounded-[40px] bg-[#f7f8f2]">
        <header className="space-y-2 mb-8">
          <h2 className="text-3xl font-serif font-medium italic text-brand-ink">Ikigai (生之意义) 图谱</h2>
          <p className="text-sm text-brand-secondary max-w-2xl">找回与世界对话节奏的探索，锁定最佳职业交集。</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Editor Side */}
          <div className="space-y-6 print:hidden">
          <IkigaiInput 
            label="我热爱的 (Love)" 
            placeholder="什么事让你忘记时间？你的热情所在？" 
            value={love} 
            onChange={setLove} 
            color="text-[#EC4899]" 
            bgColor="bg-[#FDF2F8]"
          />
          <IkigaiInput 
            label="我擅长的 (Good At)" 
            placeholder="你的天赋、技能、学识？别人夸你什么？" 
            value={goodAt} 
            onChange={setGoodAt} 
            color="text-[#3B82F6]"
            bgColor="bg-[#EFF6FF]"
          />
          <IkigaiInput 
            label="世界需要的 (Need)" 
            placeholder="社会有哪些痛点你可以解决？哪些行业在增长？" 
            value={need} 
            onChange={setNeed} 
            color="text-[#22C55E]"
            bgColor="bg-[#F0FDF4]"
          />
          <IkigaiInput 
            label="能获报酬的 (Paid For)" 
            placeholder="哪些技能可以变现？市场上愿意买单的职位？" 
            value={pay} 
            onChange={setPay} 
            color="text-[#CA8A04]"
            bgColor="bg-[#FEFCE8]"
          />

          <button 
            onClick={handleSynthesize}
            disabled={loading || !love || !goodAt || !need || !pay}
            className="w-full py-4 bg-brand-primary text-white rounded-[24px] font-bold custom-shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            AI 深度合成职业交集
          </button>
        </div>

        {/* Visual & Result Side */}
        <div className="space-y-8">
          {/* Simple Visual Rep */}
          <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center">
            {/* Love */}
            <div className={`absolute top-0 w-2/3 h-2/3 rounded-full bg-[rgba(244,114,182,0.2)] border-2 border-[#F472B6] flex items-center justify-center mix-blend-multiply transition-all ${love ? 'opacity-100' : 'opacity-30'}`}>
              <span className="text-[10px] uppercase font-bold text-[#DB2777]">Love</span>
            </div>
            {/* GoodAt */}
            <div className={`absolute left-0 w-2/3 h-2/3 rounded-full bg-[rgba(96,165,250,0.2)] border-2 border-[#60A5FA] flex items-center justify-center mix-blend-multiply transition-all ${goodAt ? 'opacity-100' : 'opacity-30'}`}>
              <span className="text-[10px] uppercase font-bold text-[#2563EB]">Good At</span>
            </div>
            {/* Need */}
            <div className={`absolute right-0 w-2/3 h-2/3 rounded-full bg-[rgba(74,222,128,0.2)] border-2 border-[#4ADE80] flex items-center justify-center mix-blend-multiply transition-all ${need ? 'opacity-100' : 'opacity-30'}`}>
              <span className="text-[10px] uppercase font-bold text-[#16A34A]">Need</span>
            </div>
            {/* Paid For */}
            <div className={`absolute bottom-0 w-2/3 h-2/3 rounded-full bg-[rgba(250,204,21,0.2)] border-2 border-[#FACC15] flex items-center justify-center mix-blend-multiply transition-all ${pay ? 'opacity-100' : 'opacity-30'}`}>
              <span className="text-[10px] uppercase font-bold text-[#CA8A04]">Paid For</span>
            </div>
            
            <div className="absolute z-10 w-12 h-12 bg-white rounded-full custom-shadow-lg flex items-center justify-center border-2 border-brand-primary">
              <span className="text-xl">✨</span>
            </div>
          </div>

          {/* AI Result */}
          <AnimatePresence>
            {synthesis && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 bg-white border-[#5B70524D]"
              >
                <div className="flex items-center gap-2 text-brand-primary border-b border-brand-divider pb-4 mb-4">
                  <Sparkles size={20} />
                  <h4 className="font-bold">Ikigai 合成报告</h4>
                </div>
                <div className="max-w-none serif italic leading-relaxed text-[#2D332ACC] whitespace-pre-wrap text-sm">
                  {synthesis}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
);
}

function IkigaiInput({ label, placeholder, value, onChange, color, bgColor }: { label: string, placeholder: string, value: string, onChange: (v: string) => void, color: string, bgColor: string }) {
  return (
    <div className="space-y-2">
      <label className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>{label}</label>
      <textarea 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${bgColor} border-2 border-transparent focus:border-current rounded-[24px] p-4 outline-none transition-all min-h-[80px] text-sm ${color}`}
      />
    </div>
  );
}

// --- Job Channels Components ---

function JobChannels() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      id: 'direct',
      name: '全网职位直连',
      icon: <Search size={18} />,
      desc: '直接从全网索引中打捞最新的公开招聘信息',
      subtext: '基础公式: "职位名称" ("招聘" OR "求职" OR "hiring") "城市"',
      chips: [
        { label: '"产品经理"', val: '"产品经理"' },
        { label: '"数据分析师"', val: '"数据分析师"' },
        { label: '"运营"', val: '"运营"' },
        { label: '"北京"', val: '"北京"' },
        { label: '"上海"', val: '"上海"' },
        { label: '"远程"', val: '"远程"' },
        { label: '"招聘"', val: '"招聘"' },
        { label: '"急招"', val: '"急招"' },
        { label: 'OR', val: 'OR' },
        { label: 'AND', val: 'AND' }
      ]
    },
    {
      id: 'official',
      name: '官网大厂直达',
      icon: <Building2 size={18} />,
      desc: '跳过中间平台，直接在企业官网 Career 页面搜索',
      subtext: '进阶: site:域名 ("招聘" OR "Careers" OR "职位")',
      chips: [
        { label: '阿里 site:alibaba.com', val: 'site:alibaba.com ("招聘" OR "职位")' },
        { label: '腾讯 site:tencent.com', val: 'site:tencent.com ("加入我们" OR "careers")' },
        { label: '字节 site:bytedance.com', val: 'site:bytedance.com ("招聘" OR "jobs")' },
        { label: '华为 site:huawei.com', val: 'site:huawei.com ("社会招聘" OR "校园招聘")' },
        { label: '系统规律 site:careers.*.com', val: 'site:careers.*.com' },
        { label: '系统规律 site:jobs.*.com', val: 'site:jobs.*.com' },
        { label: '飞书招聘 site:feishu.cn', val: '(site:feishu.cn -site:"www.feishu.cn" -site:"docs.feishu.cn")' },
        { label: '搜索所有官网关键词', val: '("招聘" OR "careers") AND "官网"' }
      ]
    },
    {
      id: 'community',
      name: '社群面经爆料',
      icon: <Users size={18} />,
      desc: '在知乎、脉脉、牛客、V2EX 等垂直社区挖掘真实的面试经验与职位信息',
      subtext: '示例: site:v2ex.com "酷工作"',
      chips: [
        { label: 'V2EX 酷工作', val: 'site:v2ex.com "酷工作"' },
        { label: '知乎 site:zhihu.com', val: 'site:zhihu.com' },
        { label: '脉脉 site:maimai.cn', val: 'site:maimai.cn' },
        { label: '牛客 site:nowcoder.com', val: 'site:nowcoder.com' },
        { label: '"面经"', val: '"面经"' },
        { label: '"薪资"', val: '"薪资"' },
        { label: '"避雷"', val: '"避雷"' }
      ]
    },
    {
      id: 'referral',
      name: '校招与内推',
      icon: <Share2 size={18} />,
      desc: '锁定当季校招汇总及最新的员工内推码，提高通过率',
      subtext: '关键词: ("2026" OR "2027") AND ("内推" OR "校招")',
      chips: [
        { label: '"2026校园招聘"', val: '"2026校园招聘"' },
        { label: '"2027校园招聘"', val: '"2027校园招聘"' },
        { label: '"内推码"', val: '"内推码"' },
        { label: '"汇总"', val: '"汇总"' },
        { label: '"管培生"', val: '"管培生"' },
        { label: '"2026"', val: '"2026"' },
        { label: '"2027"', val: '"2027"' }
      ]
    },
    {
      id: 'files',
      name: '专项文档/报告',
      icon: <FileText size={18} />,
      desc: '直接搜索 PDF  / PPT 格式的招聘简章或行业薪资报告',
      subtext: '魔法: filetype:pdf (关键词)',
      chips: [
        { label: 'PDF 简章', val: 'filetype:pdf "招聘简章"' },
        { label: 'PDF 薪资报告', val: 'filetype:pdf "薪酬报告"' },
        { label: '年报/研报', val: 'filetype:pdf "年度报告"' }
      ]
    },
    {
      id: 'gov',
      name: '体制内/公考',
      icon: <ShieldCheck size={18} />,
      desc: '搜索事业单位、公务员及国企的官方招考公告，包含地图找房式招聘',
      subtext: '推荐: 广东公共就业移动地图 (employMap)',
      chips: [
        { label: '广东地图搜岗 (超链接)', val: 'https://ggfw.hrss.gd.gov.cn/recruitment/internet/main/#/employMap' },
        { label: '"公务员公告"', val: '"国家公务员" AND "招考公告"' },
        { label: '"事业单位招聘"', val: '"事业单位" AND "招聘公告"' },
        { label: '"编制"', val: '"编制"' },
        { label: '"教师招聘"', val: '"教师招聘"' }
      ]
    }
  ];

  const handleAddChip = (val: string) => {
    if (val.startsWith('http')) {
      window.open(val, '_blank');
      return;
    }
    setQuery(prev => (prev ? `${prev} ${val}` : val));
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-medium text-brand-ink italic">求职渠道：Google 高级搜索指令营</h2>
        <p className="text-sm text-brand-secondary max-w-2xl leading-relaxed">
          绕过信息茧房，直接与源头对接。利用 Boolean Search (布尔搜索) 指令，你可以像黑客一样精准定位那些隐藏在深处的优质机会。
        </p>
      </header>

      {/* Query Builder Area */}
      <section className="space-y-6">
        <div className="glass-card p-10 bg-brand-ink text-white space-y-8 relative overflow-hidden group">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Terminal size={140} />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2 text-brand-primary">
              <Terminal size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest italic">Query Builder (搜索语法构建器)</span>
            </div>
            <div className="relative">
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="点击下方组件或手动输入，构建你的搜索指令..."
                className="w-full bg-[#ffffff1a] border-2 border-[#ffffff33] rounded-[32px] p-8 min-h-[140px] text-xl font-mono outline-none focus:border-brand-primary focus:ring-4 focus:ring-[#5B705233] transition-all placeholder:opacity-30"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                 <button 
                  onClick={() => setQuery('')}
                  className="p-2 hover:bg-[#ffffff26] rounded-full text-white/50 hover:text-white transition-all"
                  title="清空"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 relative z-10">
            <button 
              onClick={handleSearch}
              className="flex-1 bg-brand-primary text-white py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:bg-brand-hover transition-all flex items-center justify-center gap-2"
            >
              <Search size={22} /> 使用 Google 执行深度搜索
            </button>
          </div>

          <div className="pt-4 border-t border-[#ffffff1a] text-[10px] text-white/40 flex items-center gap-4">
            <div className="flex items-center gap-1"><span className="text-brand-primary">AND</span> 同时包含</div>
            <div className="flex items-center gap-1"><span className="text-brand-primary">OR</span> 包含任一</div>
            <div className="flex items-center gap-1"><span className="text-brand-primary">" "</span> 精确搜索</div>
            <div className="flex items-center gap-1"><span className="text-brand-primary">site:</span> 限定网站</div>
            <div className="flex items-center gap-1"><span className="text-brand-primary">filetype:</span> 指定格式</div>
          </div>
        </div>
      </section>

      {/* Component Library */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-brand-primary">
          <Layers size={20} />
          <h3 className="font-bold uppercase tracking-widest text-sm italic">场景化词包组件库</h3>
        </div>

        <div className="flex border-b border-brand-divider overflow-x-auto no-scrollbar gap-8 mb-4">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(idx)}
              className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap flex items-center gap-2 px-2 ${
                activeCategory === idx 
                  ? 'text-brand-primary' 
                  : 'text-brand-muted hover:text-brand-secondary'
              }`}
            >
              {cat.icon}
              {cat.name}
              {activeCategory === idx && (
                <motion.div 
                  layoutId="cat-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" 
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-brand-ink">{categories[activeCategory].name}</h4>
              <p className="text-xs text-brand-secondary leading-relaxed serif underline decoration-brand-primary/20 underline-offset-4 decoration-2">
                {categories[activeCategory].desc}
              </p>
            </div>
            <div className="bg-brand-surface p-8 rounded-[32px] border border-brand-divider">
              <h5 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-6 italic flex items-center gap-2">
                <Sparkles size={14} className="text-brand-primary" />
                点击下方组件添加到构建器:
              </h5>
              <div className="flex flex-wrap gap-3">
                 {categories[activeCategory].chips.map((chip, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleAddChip(chip.val)}
                     className="px-5 py-2.5 bg-white border border-brand-divider hover:border-brand-primary hover:text-brand-primary rounded-xl text-xs font-medium transition-all shadow-sm active:scale-95 hover:-translate-y-0.5"
                   >
                     {chip.label}
                   </button>
                 ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Proactive Networking Tips */}
      <section className="p-10 bg-brand-surface border border-brand-divider rounded-[40px] space-y-6 relative overflow-hidden group hover:border-brand-primary transition-all">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
           <MessageSquareHeart size={120} />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
          <h3 className="text-lg font-bold text-brand-ink italic font-serif">进阶策略：从“被动等待”转向“主动出击”</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-brand-ink flex items-center gap-2">
              <Users size={16} className="text-brand-primary" />
              打造你的“个人名片”
            </h4>
            <p className="text-xs text-brand-secondary leading-relaxed serif italic">
              除了在招聘平台投递简历外，社交媒体是更具活力的展示窗口。如果你有深度见解、专业作品或项目复盘，去 B 站、小红书、掘金或知乎持续输出。让雇主在搜索相关话题时，“偶遇”优秀的你。
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-brand-ink flex items-center gap-2">
              <Share2 size={16} className="text-brand-primary" />
              激活朋友圈与微信群
            </h4>
            <p className="text-xs text-brand-secondary leading-relaxed serif italic">
              别害怕“打扰”别人。在朋友圈发布诚恳、专业的自我推荐信，明确提及：我擅长什么、我有过什么成果、我想寻找什么机会。
              加入行业高质量社群，通过深度讨论建立信任，绝大多数优质岗位在流向平台前，都会先在熟人圈子里成交。
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-brand-divider">
          <div className="bg-brand-active/10 p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-white rounded-full text-brand-primary shadow-sm mt-1">
              <Sparkles size={14} />
            </div>
            <p className="text-[10px] text-brand-secondary leading-relaxed">
              <span className="font-bold text-brand-ink">tips：</span> 搜索指令能帮你穿透信息，但真正的机会往往隐藏在“对话”里。今天，试着给一位你敬佩的业内人士发一段有价值的私信，或者在朋友圈更新你的近况。
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

// --- Resume Workshop Components ---

function ResumeWorkshop({ assets, setAssets, versions, setVersions }: { 
  assets: AssetRecord[], 
  setAssets: React.Dispatch<React.SetStateAction<AssetRecord[]>>,
  versions: ResumeVersion[],
  setVersions: React.Dispatch<React.SetStateAction<ResumeVersion[]>>
}) {
  const [activeTab, setActiveTab] = useState<'library' | 'editor'>('library');
  const [currentVersion, setCurrentVersion] = useState<ResumeVersion | null>(null);
  const [jdText, setJdText] = useState('');
  const [matchingResults, setMatchingResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateAsset = (updated: AssetRecord) => {
    setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const handleAddAsset = (category: AssetRecord['category']) => {
    const newAsset: AssetRecord = {
      id: Date.now().toString(),
      category,
      title: '新记录',
      organization: '',
      timeRange: '',
      description: '',
      tags: [],
      isVisible: true
    };
    setAssets([newAsset, ...assets]);
  };

  const analyzeAndMatch = async () => {
    if (!jdText) return;
    setIsLoading(true);
    try {
      // 1. First parse JD categories
      const jdParsed = await parseJobPosting(jdText);
      // 2. Then optimize resume based on all visible assets (condensed for prompt)
      const visibleAssetsSummary = assets
        .filter(a => a.isVisible)
        .map(a => `${a.title} @ ${a.organization}: ${a.description}`)
        .join('\n');
      
      const suggestions = await generateResumeOptimization(jdText, visibleAssetsSummary);
      setMatchingResults(suggestions);
      
      // Auto-create a version
      const newVersion: ResumeVersion = {
        id: Date.now().toString(),
        name: `简历定制 - ${jdParsed?.companyName || '新岗位'}`,
        targetJD: jdText,
        selectedAssetIds: assets.filter(a => a.isVisible).map(a => a.id),
        lastModified: format(new Date(), 'yyyy-MM-dd HH:mm'),
        aiSuggestions: suggestions
      };
      setVersions([newVersion, ...versions]);
      setCurrentVersion(newVersion);
      setActiveTab('editor');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-medium text-brand-ink italic">简历工坊：从资产到武器</h2>
        <p className="text-sm text-brand-secondary max-w-2xl">
          建立你的职业资产库，无惧岗位变迁。一次录入全维度经历，AI 助你一键精准匹配、秒出定制简历。
        </p>
      </header>

      <div className="flex border-b border-brand-divider">
        <button 
          onClick={() => setActiveTab('library')}
          className={`px-8 py-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'library' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-brand-secondary'}`}
        >
          <Database size={18} /> 个人经历资产库
        </button>
        <button 
          onClick={() => setActiveTab('editor')}
          className={`px-8 py-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'editor' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-brand-secondary'}`}
        >
          <Wand2 size={18} /> 智能匹配与版本管理
        </button>
      </div>

      {activeTab === 'library' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar categories */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="glass-card p-6 bg-white space-y-2">
              <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-4">资产目录</h3>
              <CategoryBtn icon={<Briefcase size={16} />} label="工作经历" count={assets.filter(a => a.category === 'work').length} onClick={() => handleAddAsset('work')} />
              <CategoryBtn icon={<Layers size={16} />} label="项目经验" count={assets.filter(a => a.category === 'project').length} onClick={() => handleAddAsset('project')} />
              <CategoryBtn icon={<Globe size={16} />} label="教育背景" count={assets.filter(a => a.category === 'edu').length} onClick={() => handleAddAsset('edu')} />
              <CategoryBtn icon={<Cpu size={16} />} label="技能特长" count={assets.filter(a => a.category === 'skill').length} onClick={() => handleAddAsset('skill')} />
              <CategoryBtn icon={<ShieldCheck size={16} />} label="荣誉证书" count={assets.filter(a => a.category === 'honor').length} onClick={() => handleAddAsset('honor')} />
              <CategoryBtn icon={<Layout size={16} />} label="作品链接" count={assets.filter(a => a.category === 'portfolio').length} onClick={() => handleAddAsset('portfolio')} />
            </div>
            
            <div className="p-6 bg-brand-primary text-white rounded-[32px] italic text-[11px] leading-relaxed">
              💡 <strong>小贴士</strong>：这里是你的“主数据库”，不受页数限制。尽量详细记录每项经历的量化结果（STAR法则），打上对应技能标签，方便 AI 自动抓取。
            </div>
          </aside>

          {/* List area */}
          <div className="lg:col-span-3 space-y-6">
            {assets.map((asset) => (
              <AssetItem key={asset.id} asset={asset} onUpdate={handleUpdateAsset} onDelete={(id) => setAssets(assets.filter(a => a.id !== id))} />
            ))}
            {assets.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-brand-divider rounded-[40px] text-brand-muted italic">
                空空如也，从侧边栏新增一条经历开始吧。
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-1 space-y-4">
              <div className="glass-card p-6 bg-white space-y-4">
                 <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">已存版本</h3>
                 {versions.map(v => (
                   <button 
                     key={v.id} 
                     onClick={() => { setCurrentVersion(v); setMatchingResults(v.aiSuggestions); }}
                     className={`w-full text-left p-3 rounded-xl transition-all text-xs font-medium ${currentVersion?.id === v.id ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-brand-hover text-brand-ink'}`}
                   >
                     {v.name}
                     <span className="block text-[8px] opacity-60 mt-1">{v.lastModified}</span>
                   </button>
                 ))}
                 {versions.length === 0 && <p className="text-[10px] text-brand-muted italic">暂无定制版本</p>}
              </div>

              <section className="glass-card p-6 bg-brand-active space-y-4">
                <div className="flex items-center gap-2 text-brand-primary">
                  <Sparkles size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest italic">AI 定制引擎</span>
                </div>
                <textarea 
                  placeholder="贴入 JD 链接或文本..."
                  className="w-full h-32 bg-white border border-brand-divider rounded-xl p-3 text-xs outline-none focus:border-brand-primary transition-all"
                  value={jdText}
                  onChange={e => setJdText(e.target.value)}
                />
                <button 
                  disabled={isLoading || !jdText}
                  onClick={analyzeAndMatch}
                  className="w-full py-3 bg-brand-primary text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />}
                  一键生成定制方案
                </button>
              </section>
           </div>

           <div className="lg:col-span-3 space-y-8">
              {currentVersion ? (
                <div className="animate-in fade-in slide-in-from-right-4 space-y-8">
                  {/* Matching Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard label="匹配得分" value={`${Math.round((matchingResults?.matches?.length || 0) * 15 + 40)}%`} icon={<TrendingUp size={16} />} />
                    <StatCard label="岗位类型" value={matchingResults?.jobProfile?.category || '分析中'} icon={<PlusCircle size={16} />} />
                    <StatCard label="建议页数" value="1 页" icon={<FileText size={16} />} />
                  </div>

                  {/* AI Deep Dive Suggestions */}
                  {matchingResults && (
                    <div className="glass-card p-8 bg-brand-primary text-white space-y-6 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={140} />
                      </div>
                      <div className="flex items-center gap-3 border-b border-[#ffffff33] pb-4">
                        <MessageSquareHeart size={24} />
                        <h3 className="text-xl font-serif font-bold italic">AI 简历外武装建议</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-80">企业核心诉求</h4>
                          <p className="text-sm italic serif leading-relaxed">{matchingResults.jobProfile?.coreValues}</p>
                          
                          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-6">面试预测问题</h4>
                          <ul className="space-y-2">
                             {matchingResults.interviewQuestions?.map((q: string, i: number) => (
                               <li key={i} className="text-xs bg-[#ffffff1a] p-3 rounded-xl border border-[#ffffff33]">
                                 <span className="opacity-50 mr-2">Q{i+1}:</span> {q}
                               </li>
                             ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                           <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-80">补充材料建议</h4>
                           <div className="space-y-3">
                              {matchingResults.beyondResume?.map((item: any, i: number) => (
                                <div key={i} className="bg-white text-brand-ink p-4 rounded-2xl space-y-1 custom-shadow-sm">
                                  <span className="text-[10px] font-bold text-brand-primary flex items-center gap-1">
                                    <Check size={12} /> {item.title}
                                  </span>
                                  <p className="text-[11px] leading-relaxed serif italic opacity-80">{item.content}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Asset Selection */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <h3 className="text-lg font-bold text-brand-ink italic">简历内容精选 (已选 {currentVersion.selectedAssetIds.length})</h3>
                      <button className="text-[10px] font-bold text-brand-primary uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity">
                         <Download size={14} /> 导出定制 PDF
                      </button>
                    </div>
                    <div className="space-y-4">
                      {assets.map(a => (
                        <div key={a.id} className={`glass-card p-6 bg-white flex items-center justify-between transition-all ${currentVersion.selectedAssetIds.includes(a.id) ? 'border-brand-primary' : 'opacity-40 grayscale pointer-events-none'}`}>
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-brand-hover rounded-xl text-brand-primary">
                                 {a.category === 'work' ? <Briefcase size={20} /> : <Layers size={20} />}
                              </div>
                              <div>
                                 <h4 className="font-bold text-brand-ink">{a.title}</h4>
                                 <p className="text-xs text-brand-secondary">{a.organization} | {a.timeRange}</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => {
                               const selected = currentVersion.selectedAssetIds.includes(a.id) 
                                 ? currentVersion.selectedAssetIds.filter(id => id !== a.id)
                                 : [...currentVersion.selectedAssetIds, a.id];
                               setCurrentVersion({ ...currentVersion, selectedAssetIds: selected });
                             }}
                             className={`p-3 rounded-full transition-all ${currentVersion.selectedAssetIds.includes(a.id) ? 'bg-brand-primary text-white' : 'bg-brand-hover text-brand-muted'}`}
                           >
                             <Check size={18} />
                           </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-6 text-center py-20 grayscale opacity-40">
                   <div className="w-24 h-24 bg-brand-hover rounded-full flex items-center justify-center text-brand-primary">
                      <Wand2 size={48} />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-xl font-bold text-brand-ink">准备好定制简历了吗？</h3>
                     <p className="text-sm text-brand-secondary max-w-xs">贴入心仪岗位的 JD，AI 将瞬间为您挑选最佳经历组合并给出武装建议。</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}

function CategoryBtn({ icon, label, count, onClick }: { icon: React.ReactNode, label: string, count: number, onClick: () => void }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3 text-sm font-medium text-brand-secondary">
        {icon}
        <span>{label}</span>
        <span className="text-[10px] text-brand-muted font-mono">({count})</span>
      </div>
      <button 
        onClick={onClick}
        className="p-1 rounded-lg hover:bg-brand-hover text-brand-muted hover:text-brand-primary transition-all opacity-0 group-hover:opacity-100"
      >
        <PlusCircle size={14} />
      </button>
    </div>
  );
}

function AssetItem({ asset, onUpdate, onDelete }: { asset: AssetRecord, onUpdate: (a: AssetRecord) => void, onDelete: (id: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className={`glass-card p-8 bg-white space-y-6 transition-all group ${!asset.isVisible ? 'opacity-50 grayscale' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              value={asset.title} 
              onChange={e => onUpdate({ ...asset, title: e.target.value })}
              className="text-xl font-bold text-brand-ink bg-transparent border-b border-transparent focus:border-brand-primary outline-none transition-all placeholder:text-brand-muted min-w-[200px]"
              placeholder="请输入标题 (如：某公司产品实习)"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-hover px-2 py-1 rounded">
              {asset.category}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-brand-muted uppercase text-[10px] font-bold">机构</span>
              <input 
                type="text" 
                value={asset.organization} 
                onChange={e => onUpdate({ ...asset, organization: e.target.value })}
                className="bg-transparent border-b border-transparent focus:border-brand-primary outline-none transition-all placeholder:text-brand-muted"
                placeholder="机构名称"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-muted uppercase text-[10px] font-bold">时间</span>
              <input 
                type="text" 
                value={asset.timeRange} 
                onChange={e => onUpdate({ ...asset, timeRange: e.target.value })}
                className="bg-transparent border-b border-transparent focus:border-brand-primary outline-none transition-all placeholder:text-brand-muted"
                placeholder="2024.01 - 至今"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onUpdate({ ...asset, isVisible: !asset.isVisible })}
            className={`p-2 rounded-xl transition-all ${asset.isVisible ? 'bg-brand-hover text-brand-primary' : 'bg-brand-divider text-brand-muted'}`}
          >
            {asset.isVisible ? <Check size={18} /> : <X size={18} />}
          </button>
          <button 
            onClick={() => onDelete(asset.id)}
            className="p-2 bg-[#DC26260D] text-[#DC2626] rounded-xl hover:bg-[#DC2626] hover:text-white transition-all shadow-inner"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
           <div className="flex items-center gap-2">
             <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest italic">描述/工作细节</label>
             <div className="group/tips relative cursor-help">
                <span className="text-[9px] font-bold text-brand-primary bg-brand-hover px-1.5 py-0.5 rounded flex items-center gap-1">
                  STAR 法则 Tips <Compass size={10} />
                </span>
                <div className="absolute left-0 bottom-full mb-2 w-72 p-4 bg-white border border-brand-divider rounded-2xl shadow-xl opacity-0 invisible group-hover/tips:opacity-100 group-hover/tips:visible transition-all z-50">
                  <h5 className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Sparkles size={12} /> STAR 法则：让经历更具说服力
                  </h5>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-brand-ink uppercase">Situation (情景)</span>
                      <p className="text-[10px] text-brand-secondary leading-relaxed">简短描述背景：当时面临什么问题？项目初期的状况如何？</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-brand-ink uppercase">Task (任务)</span>
                      <p className="text-[10px] text-brand-secondary leading-relaxed">你的职责是什么？具体要达到什么 KPI 或目标？</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-brand-ink uppercase">Action (行动)</span>
                      <p className="text-[10px] text-brand-secondary leading-relaxed font-bold border-l-2 border-brand-primary pl-2">重中之重：你具体做了什么？用了什么方法论、沟通技巧或专业工具？</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-brand-ink uppercase">Result (结果)</span>
                      <p className="text-[10px] text-brand-secondary leading-relaxed">数字化成果：性能提升了多少？节约了多少成本？领导的打分如何？</p>
                    </div>
                  </div>
                </div>
             </div>
           </div>
           <textarea 
             value={asset.description}
             onChange={e => onUpdate({ ...asset, description: e.target.value })}
             className="w-full h-24 bg-brand-surface border-2 border-transparent focus:border-brand-primary rounded-3xl p-4 text-sm serif italic outline-none transition-all"
             placeholder="S: 背景 | T: 目标 | A: 行动 | R: 结果..."
           />
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest italic">标签/关键词 (用逗号分隔)</label>
           <div className="flex flex-wrap gap-2 items-center">
              {asset.tags.map(t => (
                <span key={t} className="px-3 py-1 bg-brand-ink text-white text-[10px] font-bold rounded-full flex items-center gap-1 group/tag">
                   {t}
                   <button onClick={() => onUpdate({ ...asset, tags: asset.tags.filter(tag => tag !== t) })} className="hover:text-brand-primary"><X size={10} /></button>
                </span>
              ))}
              <input 
                type="text" 
                placeholder="+ 添加标签"
                className="bg-transparent border-none outline-none text-[10px] font-bold text-brand-primary placeholder:text-brand-muted p-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const tag = (e.currentTarget.value).trim().replace(',', '');
                    if (tag && !asset.tags.includes(tag)) {
                      onUpdate({ ...asset, tags: [...asset.tags, tag] });
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6 bg-white space-y-2">
      <div className="flex items-center gap-2 text-brand-muted text-[10px] font-bold uppercase tracking-widest">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold font-serif text-brand-ink italic">{value}</div>
    </div>
  );
}

function Dashboard() {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const text = await generateEncouragement();
        setQuote(text || '在这个Gap的日子里，给自己一点耐心，就像等待一朵花开。');
      } catch (err) {
        setQuote('在这个Gap的日子里，给自己一点耐心，就像等待一朵花开。');
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, []);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-serif font-light text-brand-ink leading-tight">
          <span className="text-brand-primary italic block">You are in Your Time Zone</span>
        </h2>
        <p className="text-brand-secondary leading-relaxed max-w-xl text-sm">
          求职不是一场必须按时完成的赛跑，而是找回与世界对话节奏的探索。在这里，没有未完成的焦虑，只有与当下的共振。
        </p>
      </header>

      <div className="max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group mr-4"
        >
          {/* Decorative Paper Layer Behind */}
          <div className="absolute inset-0 bg-white shadow-sm border border-brand-divider -rotate-1 rounded-sm translate-y-1 translate-x-1 group-hover:rotate-0 transition-transform duration-500"></div>
          
          <div className="relative glass-card p-10 space-y-6 overflow-hidden bg-[#FCFCF9] border-brand-divider border-t-0 shadow-lg min-h-[220px] flex flex-col justify-center">
            {/* Subtle Paper Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#2D332A 1px, transparent 1px)', backgroundSize: '100% 2rem' }}></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-brand-muted opacity-60">
                <MessageSquareHeart size={16} />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em]">今日私悟 • Insight</span>
              </div>
              <div className="text-[10px] text-brand-muted font-serif italic italic opacity-40">
                {format(new Date(), 'MMM dd, yyyy')}
              </div>
            </div>

            <div className="relative z-10 flex-1 flex items-center">
              {loading ? (
                <div className="flex items-center gap-3 text-brand-muted animate-pulse">
                  <Loader2 className="animate-spin" size={14} />
                  <span className="text-xs font-serif italic tracking-wider">正在为您研墨，请稍候...</span>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                >
                  <p className="text-2xl md:text-3xl leading-relaxed text-brand-ink font-handwriting tracking-wide">
                    {quote}
                  </p>
                  
                  {/* Decorative Handwriting Signature/Stamp feel */}
                  <div className="mt-8 flex justify-end">
                    <div className="w-8 h-8 rounded-full border-2 border-brand-primary/20 flex items-center justify-center -rotate-12">
                      <Sparkles size={14} className="text-brand-primary/40" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Stamp/Heart Decoration */}
            <div className="absolute bottom-4 right-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-12 group-hover:rotate-0 duration-700">
               <Heart size={140} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- Job Tracker Components ---

interface Interview {
  round: string;
  format: string;
  interviewer: string;
  date: string;
  nextStep: string;
  result: string;
}

interface JobApplication {
  id: string;
  // 1. Company/Job Info
  companyName: string;
  positionName: string;
  keywords: string;
  location: string;
  salaryRange: string;
  postDate: string;
  channel: string;
  jdLink: string;

  // 2. Process Tracking
  applyDate: string;
  cvVersion: string;
  currentStatus: string;
  statusUpdateDate: string;

  // 3. Interview Process
  interviews: Interview[];

  // 4. Notes/Review
  notes: {
    techQuestions: string;
    projectFocus: string;
    improvementPoints: string;
    interviewerStyle: string;
    techStack: string;
  };

  // 5. Decision
  decision: {
    intentRating: number;
    matchRating: number;
    companyEvaluation: string;
    concerns: string;
    offerDecision: string;
  };

  // 6. Follow up
  followUp: {
    hrContact: string;
    offerDetails: string;
    deadline: string;
    entryDate: string;
    isFinal: boolean;
  };
}

function ForestPath({ totalJobs, interviewing, offers }: { totalJobs: number, interviewing: number, offers: number }) {
  // We'll use a path with about 10 steps to show progress
  // Every 3 jobs = 1 "major" step for visualization if total is large, 
  // but let's just use totalJobs capped at 12 steps for a beautiful path.
  const steps = Math.min(totalJobs, 12);
  const pathPoints = [
    { x: 50, y: 150 },
    { x: 150, y: 130 },
    { x: 250, y: 160 },
    { x: 350, y: 140 },
    { x: 450, y: 170 },
    { x: 550, y: 150 },
    { x: 650, y: 130 },
    { x: 750, y: 160 },
    { x: 850, y: 140 },
    { x: 950, y: 170 },
    { x: 1050, y: 150 },
    { x: 1150, y: 130 },
  ];

  // Map progress to path
  const currentPos = pathPoints[steps] || pathPoints[pathPoints.length - 1];

  return (
    <div className="glass-card p-10 bg-white overflow-hidden relative min-h-[300px] border-[#F2F4ED]">
      <div className="absolute top-6 left-10 space-y-1 z-10">
        <h3 className="text-xl font-serif font-medium text-brand-ink italic flex items-center gap-2">
          探索之径 <Trees className="text-brand-primary" size={20} />
        </h3>
        <p className="text-[10px] text-brand-secondary font-bold uppercase tracking-[0.2em]">每个足迹都是一次向内的沉淀与向外的伸手</p>
      </div>

      {/* Decorative Forest Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Trees className="absolute top-10 right-20 text-brand-primary" size={60} />
        <Trees className="absolute bottom-10 left-40 text-brand-primary" size={80} />
        <Trees className="absolute top-40 left-10 text-brand-primary" size={40} />
      </div>

      <div className="relative w-full h-full mt-10 overflow-x-auto pb-10 custom-scrollbar">
        <div className="min-w-[1200px] h-[200px] relative">
          {/* The Path Textures */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 200">
            <path 
              d="M 50 150 C 150 130, 250 160, 350 140 C 450 170, 550 150, 650 130 C 750 160, 850 140, 950 170 C 1050 150, 1150 130, 1150 130" 
              fill="none" 
              stroke="#F2F4ED" 
              strokeWidth="24" 
              strokeLinecap="round"
            />
            <path 
              d="M 50 150 C 150 130, 250 160, 350 140 C 450 170, 550 150, 650 130 C 750 160, 850 140, 950 170 C 1050 150, 1150 130, 1150 130" 
              fill="none" 
              stroke="#5B7052" 
              strokeWidth="2" 
              strokeDasharray="8 8"
              opacity="0.3"
            />
            
            {/* Step Milestones */}
            {pathPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="4" fill={i <= steps ? "#5B7052" : "#D1D5DB"} opacity={i <= steps ? 1 : 0.5} />
            ))}

            {/* Special Landmark Icons along the trail */}
            <foreignObject x={330} y={90} width="40" height="40">
              <div className={`p-2 rounded-full border border-dashed ${totalJobs >= 4 ? 'bg-brand-primary text-white border-transparent' : 'bg-brand-surface text-brand-muted border-brand-divider'}`}>
                <Flag size={14} />
              </div>
            </foreignObject>
            <foreignObject x={630} y={80} width="40" height="40">
              <div className={`p-2 rounded-full border border-dashed ${interviewing > 0 ? 'bg-brand-primary text-white border-transparent' : 'bg-brand-surface text-brand-muted border-brand-divider'}`}>
                <MessageSquare size={14} />
              </div>
            </foreignObject>
            <foreignObject x={1130} y={80} width="40" height="40">
              <div className={`p-2 rounded-full border border-dashed ${offers > 0 ? 'bg-[#16A34A] text-white border-transparent' : 'bg-brand-surface text-brand-muted border-brand-divider'}`}>
                <Sparkles size={14} />
              </div>
            </foreignObject>
          </svg>

          {/* The Character (The Explorer) */}
          <motion.div 
            animate={{ left: currentPos.x - 24, top: currentPos.y - 48 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="absolute z-20"
          >
            <div className="relative">
              {/* Tooltip bubble */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand- ink text-white text-[9px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                已步入第 {totalJobs} 份可能
              </div>
              
              {/* Character Visual: Walking Stick or just a person icon */}
              <div className="w-12 h-12 flex flex-col items-center">
                <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                  <User size={16} />
                </div>
                <div className="w-0.5 h-3 bg-brand-primary opacity-40"></div>
              </div>
            </div>
          </motion.div>

          {/* Labels */}
          <div className="absolute bottom-6 left-10 text-[9px] font-bold text-brand-muted uppercase tracking-widest italic">
            起点：第一场对话
          </div>
          <div className="absolute bottom-6 right-10 text-[9px] font-bold text-brand-muted uppercase tracking-widest italic text-right">
             终点：理想的彼岸
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-end border-t border-[#F2F4ED] pt-6">
        <div className="flex gap-8">
           <div className="space-y-1">
             <span className="text-[10px] text-brand-muted uppercase tracking-widest font-bold">累计里程</span>
             <p className="text-xl font-serif italic text-brand-ink">{totalJobs} 份简历</p>
           </div>
           <div className="space-y-1">
             <span className="text-[10px] text-brand-muted uppercase tracking-widest font-bold">获得回响</span>
             <p className="text-xl font-serif italic text-brand-ink">{interviewing} 场面试</p>
           </div>
           <div className="space-y-1">
             <span className="text-[10px] text-brand-muted uppercase tracking-widest font-bold">抵达站台</span>
             <p className="text-xl font-serif italic text-brand-ink">{offers} 个 Offer</p>
           </div>
        </div>
        <div className="text-[10px] text-brand-muted italic max-w-xs text-right">
          "步子慢一点没关系，只要你还在林间穿行。每一份被投出的简历，都是一封寄往未来的信。"
        </div>
      </div>
    </div>
  );
}

function Tracker({ jobs, setJobs }: {
  jobs: JobApplication[],
  setJobs: React.Dispatch<React.SetStateAction<JobApplication[]>>
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<JobApplication> | null>(null);
  const [filter, setFilter] = useState('');
  const [parsingJd, setParsingJd] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleAdd = () => {
    setCurrentJob({
      id: Date.now().toString(),
      companyName: '',
      positionName: '',
      keywords: '',
      location: '',
      salaryRange: '',
      postDate: format(new Date(), 'yyyy-MM-dd'),
      channel: '',
      jdLink: '',
      applyDate: format(new Date(), 'yyyy-MM-dd'),
      cvVersion: '标准版',
      currentStatus: '待投递',
      statusUpdateDate: format(new Date(), 'yyyy-MM-dd'),
      interviews: [],
      notes: { techQuestions: '', projectFocus: '', improvementPoints: '', interviewerStyle: '', techStack: '' },
      decision: { intentRating: 3, matchRating: 5, companyEvaluation: '', concerns: '', offerDecision: '待定' },
      followUp: { hrContact: '', offerDetails: '', deadline: '', entryDate: '', isFinal: false }
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!currentJob?.companyName || !currentJob?.positionName) return;
    const exists = jobs.find(j => j.id === currentJob.id);
    if (exists) {
      setJobs(jobs.map(j => j.id === currentJob.id ? currentJob as JobApplication : j));
    } else {
      setJobs([currentJob as JobApplication, ...jobs]);
    }
    setIsEditing(false);
    setCurrentJob(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  const autoParseJd = async (text: string) => {
    if (!text || text.length < 10) return;
    setParsingJd(true);
    try {
      const result = await parseJobPosting(text);
      if (result) {
        setCurrentJob(prev => ({ 
          ...prev, 
          companyName: result.companyName !== '未知' ? result.companyName : prev?.companyName,
          positionName: result.positionName !== '未知' ? result.positionName : prev?.positionName,
          keywords: result.keywords !== '未知' ? result.keywords : prev?.keywords,
          location: result.location !== '未知' ? result.location : prev?.location,
          salaryRange: result.salaryRange !== '未知' ? result.salaryRange : prev?.salaryRange,
          notes: {
            ...prev?.notes!,
            techStack: result.teamTechStack !== '未知' ? result.teamTechStack : prev?.notes?.techStack || '',
            projectFocus: result.summary !== '未知' ? result.summary : prev?.notes?.projectFocus || ''
          }
        }));
      }
    } finally {
      setParsingJd(false);
    }
  };

  const stats = {
    total: jobs.length,
    interviewing: jobs.filter(j => j.currentStatus === '面试中').length,
    offers: jobs.filter(j => j.currentStatus === 'Offer').length,
    conversionRate: jobs.length ? ((jobs.filter(j => j.interviews.length > 0).length / jobs.length) * 100).toFixed(1) : 0
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-medium text-brand-ink italic">探索记录：求职管理面板</h2>
          <p className="text-sm text-brand-secondary">全维追踪每一份可能，掌控你的职业跃迁进度。</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 bg-brand-hover text-brand-primary rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-brand-active transition-all"
          >
            <BarChart2 size={18} /> {showStats ? '收起统计' : '查看月度转化'}
          </button>
          <button 
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle size={20} /> 新增求职档案
          </button>
        </div>
      </header>

      {/* The Forest Path Visualization - Collapses with Stats */}
      {showStats && (
        <ForestPath totalJobs={stats.total} interviewing={stats.interviewing} offers={stats.offers} />
      )}

      {showStats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="glass-card p-6 bg-white space-y-2">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">总投递数</span>
            <div className="text-3xl font-serif font-bold text-brand-primary">{stats.total}</div>
          </div>
          <div className="glass-card p-6 bg-white space-y-2">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">面试转化率</span>
            <div className="text-3xl font-serif font-bold text-brand-primary">{stats.conversionRate}%</div>
          </div>
          <div className="glass-card p-6 bg-white space-y-2">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">面试中</span>
            <div className="text-3xl font-serif font-bold text-[#CA8A04]">{stats.interviewing}</div>
          </div>
          <div className="glass-card p-6 bg-white space-y-2">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">收获 Offer</span>
            <div className="text-3xl font-serif font-bold text-[#16A34A]">{stats.offers}</div>
          </div>
        </section>
      )}

      {/* Filter & List */}
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
          <input 
            type="text" 
            placeholder="按状态、公司、岗位筛选..." 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full bg-white border border-brand-divider rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-brand-primary outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {jobs.filter(j => 
            j.companyName.includes(filter) || 
            j.positionName.includes(filter) || 
            j.currentStatus.includes(filter)
          ).map(job => (
            <div key={job.id} className="glass-card bg-white p-6 md:p-8 hover:border-brand-primary transition-all group overflow-hidden relative">
              {/* Status Indicator */}
              <div className={`absolute top-0 right-0 px-6 py-1 text-[10px] font-bold uppercase tracking-widest text-white ${
                job.currentStatus === 'Offer' ? 'bg-[#16A34A]' : 
                job.currentStatus === '面试中' ? 'bg-[#CA8A04]' : 
                job.currentStatus === '挂掉' ? 'bg-[#DC2626]' : 'bg-brand-muted'
              }`}>
                {job.currentStatus}
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-brand-hover rounded-2xl flex items-center justify-center text-brand-primary shrink-0">
                      <Briefcase size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-ink mb-1">{job.companyName}</h3>
                      <p className="text-sm font-medium text-brand-secondary flex items-center gap-2">
                        {job.positionName} 
                        <span className="text-brand-divider">|</span>
                        <span className="text-[10px] text-brand-muted uppercase tracking-tighter">{job.keywords}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-brand-muted block uppercase tracking-widest text-[9px]">地点</span>
                      <p className="font-bold text-brand-ink flex items-center gap-1"><MapPinIcon size={12} /> {job.location}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-brand-muted block uppercase tracking-widest text-[9px]">薪资</span>
                      <p className="font-bold text-brand-ink">{job.salaryRange}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-brand-muted block uppercase tracking-widest text-[9px]">投递日期</span>
                      <p className="font-bold text-brand-ink">{job.applyDate}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-brand-muted block uppercase tracking-widest text-[9px]">渠道</span>
                      <p className="font-bold text-brand-ink">{job.channel}</p>
                    </div>
                  </div>
                </div>

                <div className="w-px bg-brand-divider mx-4 self-stretch hidden lg:block"></div>

                <div className="flex flex-col justify-between items-end gap-6 text-right">
                  <div className="space-y-1">
                    <span className="text-brand-muted block uppercase tracking-widest text-[9px]">意向评级</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < job.decision.intentRating ? 'fill-[#CA8A04] text-[#CA8A04]' : 'text-brand-divider'} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => { setCurrentJob(job); setIsEditing(true); }}
                      className="p-3 bg-brand-hover text-brand-secondary rounded-xl hover:bg-brand-primary hover:text-white transition-all shadow-inner"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(job.id)}
                      className="p-3 bg-[#DC26260D] text-[#DC2626] rounded-xl hover:bg-[#DC2626] hover:text-white transition-all shadow-inner"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Bottom Interview Info snippet if exists */}
              {job.interviews.length > 0 && (
                <div className="mt-6 pt-6 border-t border-brand-divider flex items-center gap-4 text-[10px]">
                  <span className="bg-brand-active text-brand-primary px-2 py-0.5 rounded font-bold">面试动态</span>
                  <p className="text-brand-secondary italic">
                    近期：{job.interviews[job.interviews.length - 1].round} ({job.interviews[job.interviews.length - 1].date}) - 下一步：{job.interviews[job.interviews.length - 1].nextStep}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#f7f8f2] w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col"
            >
              <div className="px-10 py-8 border-b border-brand-divider flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center">
                    <PlusCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif italic text-brand-ink">
                      {currentJob?.id ? '编辑求职档案' : '新建求职档案'}
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-brand-hover rounded-full transition-colors text-brand-muted"
                >
                  <ArrowLeft size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                {/* 0. AI Assist */}
                <div className="glass-card p-6 bg-brand-primary text-white space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} />
                    <span className="text-sm font-bold italic">AI 自动同步 JD</span>
                  </div>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      placeholder="贴入职位招聘 URL..." 
                      className="flex-1 bg-[#ffffff26] border border-[#ffffff33] rounded-xl px-4 py-2 text-sm outline-none placeholder:text-[#ffffff80]"
                      onBlur={(e) => autoParseJd(e.target.value)}
                    />
                    <button className="px-6 py-2 bg-white text-brand-primary rounded-xl text-xs font-bold whitespace-nowrap">
                      {parsingJd ? <Loader2 className="animate-spin" size={16} /> : '一键提取'}
                    </button>
                  </div>
                  <p className="text-[10px] opacity-60">提示：AI 将尝试识别公司、岗位、薪资、地点等信息。</p>
                </div>

                {/* 1. Basic Info */}
                <section className="space-y-6">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-brand-primary uppercase tracking-widest">
                    <div className="w-1.5 h-4 bg-brand-primary rounded-full"></div>
                    基础档案
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <EditorField 
                      label="公司名称" 
                      value={currentJob?.companyName || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, companyName: v}))} 
                    />
                    <EditorField 
                      label="岗位名称" 
                      value={currentJob?.positionName || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, positionName: v}))} 
                    />
                    <EditorField 
                      label="职能关键词" 
                      value={currentJob?.keywords || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, keywords: v}))} 
                    />
                    <EditorField 
                      label="工作地点" 
                      value={currentJob?.location || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, location: v}))} 
                    />
                    <EditorField 
                      label="薪资范围" 
                      value={currentJob?.salaryRange || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, salaryRange: v}))} 
                    />
                    <EditorField 
                      label="招聘平台" 
                      value={currentJob?.channel || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, channel: v}))} 
                    />
                    <EditorField 
                      label="JD 链接" 
                      value={currentJob?.jdLink || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, jdLink: v}))} 
                    />
                  </div>
                </section>

                {/* 2. Process */}
                <section className="space-y-6">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-brand-primary uppercase tracking-widest">
                    <div className="w-1.5 h-4 bg-brand-primary rounded-full"></div>
                    进度跟踪
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <EditorField 
                      label="投递日期" 
                      type="date"
                      value={currentJob?.applyDate || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, applyDate: v}))} 
                    />
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest italic">当前状态</label>
                       <select 
                         value={currentJob?.currentStatus}
                         onChange={e => setCurrentJob(prev => ({...prev, currentStatus: e.target.value}))}
                         className="w-full bg-white border border-brand-divider rounded-xl p-3 text-sm focus:border-brand-primary outline-none transition-all"
                       >
                         {['待投递', '已投递', '初筛通过', '面试中', '挂掉', 'Offer', '已入职'].map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                    <EditorField 
                      label="简历版本" 
                      value={currentJob?.cvVersion || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, cvVersion: v}))} 
                    />
                  </div>
                </section>

                {/* 3. Interview Rounds */}
                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-brand-primary uppercase tracking-widest">
                      <div className="w-1.5 h-4 bg-brand-primary rounded-full"></div>
                      面试流程 (过程管理)
                    </h4>
                    <button 
                      onClick={() => {
                        const newInterview = { round: '新轮次', format: '视频', interviewer: '', date: format(new Date(), 'yyyy-MM-dd'), nextStep: '待约', result: '等待反馈' };
                        setCurrentJob(prev => ({ ...prev, interviews: [...(prev?.interviews || []), newInterview] }));
                      }}
                      className="text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-hover px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-brand-active"
                    >
                      <PlusCircle size={12} /> 添加面试轮次
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {currentJob?.interviews?.map((round, idx) => (
                      <div key={idx} className="p-6 bg-white border border-brand-divider rounded-2xl space-y-4 relative group">
                        <button 
                          onClick={() => setCurrentJob(prev => ({ ...prev, interviews: prev?.interviews?.filter((_, i) => i !== idx) }))}
                          className="absolute top-4 right-4 text-brand-muted hover:text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          <EditorField label="当前轮次" value={round.round} onChange={v => {
                            const newI = [...currentJob.interviews!];
                            newI[idx].round = v;
                            setCurrentJob(prev => ({ ...prev, interviews: newI }));
                          }} />
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest italic text-[9px]">形式</label>
                             <select value={round.format} onChange={e => {
                               const newI = [...currentJob.interviews!];
                               newI[idx].format = e.target.value;
                               setCurrentJob(prev => ({ ...prev, interviews: newI }));
                             }} className="w-full bg-brand-surface border border-brand-divider rounded-lg p-2 text-xs outline-none">
                               {['电话', '视频', '现场'].map(f => <option key={f} value={f}>{f}</option>)}
                             </select>
                          </div>
                          <EditorField label="面试官" value={round.interviewer} onChange={v => {
                            const newI = [...currentJob.interviews!];
                            newI[idx].interviewer = v;
                            setCurrentJob(prev => ({ ...prev, interviews: newI }));
                          }} />
                          <EditorField label="已面日期" type="date" value={round.date} onChange={v => {
                            const newI = [...currentJob.interviews!];
                            newI[idx].date = v;
                            setCurrentJob(prev => ({ ...prev, interviews: newI }));
                          }} />
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest italic text-[9px]">安排</label>
                             <select value={round.nextStep} onChange={e => {
                               const newI = [...currentJob.interviews!];
                               newI[idx].nextStep = e.target.value;
                               setCurrentJob(prev => ({ ...prev, interviews: newI }));
                             }} className="w-full bg-brand-surface border border-brand-divider rounded-lg p-2 text-xs outline-none">
                               {['待约', '已确定时间', '无'].map(s => <option key={s} value={s}>{s}</option>)}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest italic text-[9px]">结果</label>
                             <select value={round.result} onChange={e => {
                               const newI = [...currentJob.interviews!];
                               newI[idx].result = e.target.value;
                               setCurrentJob(prev => ({ ...prev, interviews: newI }));
                             }} className="w-full bg-brand-surface border border-brand-divider rounded-lg p-2 text-xs outline-none">
                               {['通过', '待定', '未通过', '等待反馈'].map(r => <option key={r} value={r}>{r}</option>)}
                             </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!currentJob?.interviews || currentJob.interviews.length === 0) && (
                      <div className="py-8 text-center border-2 border-dashed border-brand-divider rounded-2xl text-brand-muted text-xs italic">
                        暂无面试记录，点击右上角添加。
                      </div>
                    )}
                  </div>
                </section>

                {/* 5. Decision */}
                <section className="space-y-6">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-brand-primary uppercase tracking-widest">
                    <div className="w-1.5 h-4 bg-brand-primary rounded-full"></div>
                    决策评估
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest italic">主观意愿评级</label>
                       <div className="flex gap-2">
                         {[1,2,3,4,5].map(star => (
                           <button 
                             key={star} 
                             onClick={() => setCurrentJob(prev => ({...prev, decision: { ...prev!.decision!, intentRating: star }}))}
                             className="p-1"
                           >
                             <Star size={24} className={(currentJob?.decision?.intentRating || 0) >= star ? 'fill-[#CA8A04] text-[#CA8A04]' : 'text-brand-divider'} />
                           </button>
                         ))}
                       </div>
                    </div>
                    <EditorField 
                      label="匹配度评分 (1-10)" 
                      type="number"
                      value={currentJob?.decision?.matchRating?.toString() || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, decision: { ...prev!.decision!, matchRating: parseInt(v) }}))} 
                    />
                    <EditorField 
                      label="公司评价" 
                      value={currentJob?.decision?.companyEvaluation || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, decision: { ...prev!.decision!, companyEvaluation: v }}))} 
                    />
                    <EditorField 
                      label="顾虑点" 
                      value={currentJob?.decision?.concerns || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, decision: { ...prev!.decision!, concerns: v }}))} 
                    />
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest italic">是否接 Offer</label>
                       <select 
                         value={currentJob?.decision?.offerDecision}
                         onChange={e => setCurrentJob(prev => ({...prev, decision: { ...prev!.decision!, offerDecision: e.target.value }}))}
                         className="w-full bg-white border border-brand-divider rounded-xl p-3 text-sm focus:border-brand-primary outline-none transition-all"
                       >
                         {['待定', '接', '拒', '等对比'].map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                  </div>
                </section>

                {/* 4. Review */}
                <section className="space-y-6">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-brand-primary uppercase tracking-widest">
                    <div className="w-1.5 h-4 bg-brand-primary rounded-full"></div>
                    面经与复盘 (经验沉淀)
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    <ReviewField 
                      label="技术问题记录" 
                      value={currentJob?.notes?.techQuestions || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, notes: { ...prev!.notes!, techQuestions: v }}))} 
                    />
                    <ReviewField 
                      label="项目深挖点" 
                      value={currentJob?.notes?.projectFocus || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, notes: { ...prev!.notes!, projectFocus: v }}))} 
                    />
                    <ReviewField 
                      label="答得不好的题 (红色补漏)" 
                      value={currentJob?.notes?.improvementPoints || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, notes: { ...prev!.notes!, improvementPoints: v }}))} 
                      isWarning
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <EditorField 
                        label="面试官风格" 
                        value={currentJob?.notes?.interviewerStyle || ''} 
                        onChange={v => setCurrentJob(prev => ({...prev, notes: { ...prev!.notes!, interviewerStyle: v }}))} 
                      />
                      <EditorField 
                        label="团队技术栈" 
                        value={currentJob?.notes?.techStack || ''} 
                        onChange={v => setCurrentJob(prev => ({...prev, notes: { ...prev!.notes!, techStack: v }}))} 
                      />
                    </div>
                  </div>
                </section>

                {/* 6. Follow-up */}
                <section className="space-y-6">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-brand-primary uppercase tracking-widest">
                    <div className="w-1.5 h-4 bg-brand-primary rounded-full"></div>
                    后续跟进层
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <EditorField 
                      label="HR 联系方式" 
                      value={currentJob?.followUp?.hrContact || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, followUp: { ...prev!.followUp!, hrContact: v }}))} 
                    />
                    <EditorField 
                      label="Offer 详情 (总包/Base)" 
                      value={currentJob?.followUp?.offerDetails || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, followUp: { ...prev!.followUp!, offerDetails: v }}))} 
                    />
                    <EditorField 
                      label="回复截止日期" 
                      type="date"
                      value={currentJob?.followUp?.deadline || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, followUp: { ...prev!.followUp!, deadline: v }}))} 
                    />
                    <EditorField 
                      label="入职日期" 
                      type="date"
                      value={currentJob?.followUp?.entryDate || ''} 
                      onChange={v => setCurrentJob(prev => ({...prev, followUp: { ...prev!.followUp!, entryDate: v }}))} 
                    />
                    <div className="flex items-center gap-2 md:col-span-2">
                       <input 
                         type="checkbox" 
                         checked={currentJob?.followUp?.isFinal}
                         onChange={e => setCurrentJob(prev => ({...prev, followUp: { ...prev!.followUp!, isFinal: e.target.checked }}))}
                         className="w-4 h-4 text-brand-primary rounded border-brand-divider focus:ring-brand-primary"
                       />
                       <span className="text-xs text-brand-secondary font-bold">标记为最终去向 (归档)</span>
                    </div>
                  </div>
                </section>
              </div>

              <div className="px-10 py-6 border-t border-brand-divider flex justify-end gap-4 shrink-0 bg-white">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 text-brand-muted font-bold text-xs uppercase tracking-widest hover:text-brand-primary transition-colors"
                >
                  取消更改
                </button>
                <button 
                  onClick={handleSave}
                  className="px-10 py-3 bg-brand-primary text-white rounded-full font-bold custom-shadow-lg transform active:scale-95 transition-all text-sm"
                >
                  保存档案
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewField({ label, value, onChange, isWarning = false }: { label: string, value: string, onChange: (v: string) => void, isWarning?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest italic">{label}</label>
      <textarea 
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className={`w-full bg-white border ${isWarning ? 'border-[#DC26264D] focus:border-[#DC2626]' : 'border-brand-divider focus:border-brand-primary'} rounded-xl p-4 text-sm outline-none transition-all placeholder:text-brand-muted`}
        placeholder={`记录${label}...`}
      />
    </div>
  );
}

function EditorField({ label, value, onChange, type = 'text' }: { label: string, value: string, onChange: (v: string) => void, type?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest italic">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-brand-divider rounded-xl p-3 text-sm focus:border-brand-primary outline-none transition-all placeholder:text-brand-muted"
        placeholder={`输入${label}...`}
      />
    </div>
  );
}

function HollandTestTool({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
  });
  const resultRef = useRef<HTMLDivElement>(null);

  const questions = [
    { text: "修理或装置电器零件", type: "R" },
    { text: "修理机械器具", type: "R" },
    { text: "使用木工工具制造或修理家具等", type: "R" },
    { text: "在农庄工作，种植植物或饲养动物", type: "R" },
    { text: "从事户外体力工作", type: "R" },
    { text: "做科学实验，研究物质的特性", type: "I" },
    { text: "阅读科学性或技术性的书籍、杂志", type: "I" },
    { text: "研究或试图解决数学问题", type: "I" },
    { text: "编写电脑程序", type: "I" },
    { text: "对自然界的奥秘感兴趣", type: "I" },
    { text: "素描、绘图或油画", type: "A" },
    { text: "学习乐器或参加合唱团", type: "A" },
    { text: "创作诗、小说、文章或剧本", type: "A" },
    { text: "表演短剧、话剧或舞台剧", type: "A" },
    { text: "设计时装、海报或室内装饰", type: "A" },
    { text: "向他人解释一些困难的事", type: "S" },
    { text: "训练他人或辅导学生学习", type: "S" },
    { text: "乐于助人并为他人提供服务", type: "S" },
    { text: "参加社团活动或志愿者项目", type: "S" },
    { text: "对心理学或人际关系感兴趣", type: "S" },
    { text: "说服他人接受自己的观点", type: "E" },
    { text: "策划、安排并领导一些活动", type: "E" },
    { text: "在团队中担任领导者角色", type: "E" },
    { text: "推销某种商品或服务", type: "E" },
    { text: "对经营管理或创业感兴趣", type: "E" },
    { text: "负责文职工作、整理文件资料", type: "C" },
    { text: "按照详细的计划或流程工作", type: "C" },
    { text: "处理财务报表、计算开支", type: "C" },
    { text: "在一个固定的办公室内工作", type: "C" },
    { text: "对追求效率与准确性感兴趣", type: "C" }
  ];

  const handleAnswer = (val: number) => {
    const q = questions[currentQuestion];
    setScores(prev => ({ ...prev, [q.type]: prev[q.type] + val }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
    }
  };

  const reset = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setScores({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  };

  const chartData = [
    { subject: '现实型 (R)', A: scores.R },
    { subject: '研究型 (I)', A: scores.I },
    { subject: '艺术型 (A)', A: scores.A },
    { subject: '社会型 (S)', A: scores.S },
    { subject: '企业型 (E)', A: scores.E },
    { subject: '常规型 (C)', A: scores.C },
  ];

  const resultType = (Object.entries(scores) as [string, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(i => i[0])
    .join("");
  const typeDescriptions: Record<string, string> = {
    R: "现实型：擅长使用机器工具，喜欢户外活动和体力劳动。",
    I: "研究型：喜欢观察、学习、研究和分析，追求真理。",
    A: "艺术型：富有想象力和创造力，追求美感，讨厌条条框框。",
    S: "社会型：愿意帮助、指导或教育他人，关注人与人的连接。",
    E: "企业型：喜欢领导和说服他人，追求地位、权力和物质成就。",
    C: "常规型：喜欢有计划地做事情，注重细节、准确和高效。"
  };

  const handleDownload = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: '#f7f8f2',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `riasec-${format(new Date(), 'yyyyMMdd')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity">
          <ArrowLeft size={18} /> 返回深度知己
        </button>
        {step === 'result' && (
          <button 
            onClick={handleDownload}
            className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity bg-brand-hover px-4 py-2 rounded-full"
          >
            <Download size={18} /> 保存结果图
          </button>
        )}
      </div>

      <div ref={resultRef} className="p-8 rounded-[40px] bg-[#f7f8f2]">
        <header className="space-y-2 mb-8">
          <h2 className="text-3xl font-serif font-medium italic text-brand-ink">霍兰德职业兴趣测试 (RIASEC)</h2>
          <p className="text-sm text-brand-secondary max-w-2xl">发现你的职业兴趣基因，找到让你更有激情的工作领域。</p>
        </header>

        {step === 'intro' && (
        <div className="glass-card p-10 bg-white space-y-6 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-brand-hover rounded-full flex items-center justify-center mx-auto text-brand-primary">
            <Compass size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-brand-ink">准备好探索内心了吗？</h3>
            <p className="text-sm text-brand-secondary leading-relaxed italic">
              这个测试包含 30 个关于工作活动的问题。<br />不需要过多思考，凭第一反应选择。
            </p>
          </div>
            <button 
              onClick={() => setStep('test')}
              className="px-10 py-4 bg-brand-primary text-white rounded-full font-bold custom-shadow-lg hover:-translate-y-1 transition-all"
            >
              开启探索测验
            </button>
        </div>
      )}

      {step === 'test' && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="w-full h-1.5 bg-brand-divider rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(currentQuestion / questions.length) * 100}%` }}
            />
          </div>
          
          <div className="text-center space-y-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary italic">Question {currentQuestion + 1} of {questions.length}</span>
            <h3 className="text-2xl md:text-3xl font-serif text-brand-ink italic leading-snug">
              你是否喜欢：{questions[currentQuestion].text}?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => handleAnswer(2)}
                className="p-6 bg-white border border-brand-divider rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink"
              >
                很喜欢 (+2)
              </button>
              <button 
                onClick={() => handleAnswer(1)}
                className="p-6 bg-white border border-brand-divider rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink"
              >
                还可以 (+1)
              </button>
              <button 
                onClick={() => handleAnswer(0)}
                className="p-6 bg-white border border-brand-divider rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink"
              >
                没兴趣 (+0)
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-6">
            <div className="glass-card p-8 bg-white space-y-6">
              <h3 className="text-2xl font-serif font-bold text-brand-ink italic">测验结果报告</h3>
              <div className="inline-block px-4 py-2 bg-brand-primary text-white rounded-full font-mono font-bold tracking-widest text-xl">
                Code: {resultType}
              </div>
              <p className="text-sm text-brand-secondary leading-relaxed">
                根据测试，你的职业兴趣主要集中在以下三个领域。这反映了你最核心的职业偏好与潜力。
              </p>
              
              <div className="space-y-4 pt-4">
                {resultType.split("").map((t, idx) => (
                  <div key={idx} className="flex gap-4 items-start border-l-2 border-brand-divider pl-4 hover:border-brand-primary transition-colors">
                    <span className="text-2xl font-serif italic text-brand-primary font-bold">{t}</span>
                    <p className="text-sm text-brand-ink font-medium leading-relaxed">{typeDescriptions[t]}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={reset}
                className="mt-8 text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-primary transition-colors border-t border-brand-divider pt-6 w-full text-center"
              >
                重新测验
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-4 bg-white aspect-square flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#7A8573', fontSize: 12, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar
                    name="Interest"
                    dataKey="A"
                    stroke="#5B7052"
                    fill="#5B7052"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="p-8 bg-brand-primary text-white rounded-[40px] custom-shadow-sm italic text-sm">
                💡 <strong>小贴士</strong>：RIASEC 结果不是终点，而是起点。它能帮你缩小行业选择的范围。例如如果你 A (艺术型) 很高，也许那些需要高度创造力和自由度的岗位会让你更有成就感。
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}

function StrengthsTool({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    E: 0, I: 0, R: 0, S: 0
  });
  const resultRef = useRef<HTMLDivElement>(null);

  const questions = [
    { text: "我喜欢制定详细的计划并严格执行", type: "E" },
    { text: "我更倾向于直接指出问题并推动解决", type: "E" },
    { text: "完成待办清单上的任务让我非常有成就感", type: "E" },
    { text: "我非常看重准时和规则的严谨性", type: "E" },
    { text: "我喜欢掌控局面并带领他人实现目标", type: "I" },
    { text: "我不怕站在人群面前表达自己的观点", type: "I" },
    { text: "说服他人接受我的想法让我很有动力", type: "I" },
    { text: "我喜欢结识新朋友并给他们留下深刻印象", type: "I" },
    { text: "我非常在意他人的感受和需求", type: "R" },
    { text: "建立深厚的人际关系比单纯完成任务更重要", type: "R" },
    { text: "我喜欢在一个和谐、合作的团队中工作", type: "R" },
    { text: "我能轻易察觉到他人情绪的变化", type: "R" },
    { text: "我喜欢分析数据并预测未来的趋势", type: "S" },
    { text: "面对复杂问题，我总能找到多种解决方案", type: "S" },
    { text: "我经常思考“如果...会怎样”的可能性", type: "S" },
    { text: "我对事物的底层逻辑和运行模式非常着迷", type: "S" },
    { text: "我喜欢独立思考并追求卓越的质量", type: "E" },
    { text: "为了达到目标，我可以非常坚韧不拔", type: "E" },
    { text: "向他人展示成果并获得认可很重要", type: "I" },
    { text: "我能很好地平衡团队中不同人的利益", type: "R" }
  ];

  const handleAnswer = (val: number) => {
    const q = questions[currentQuestion];
    setScores(prev => ({ ...prev, [q.type]: prev[q.type] + val }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
    }
  };

  const reset = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setScores({ E: 0, I: 0, R: 0, S: 0 });
  };

  const handleDownload = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: '#f7f8f2',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `strengths-${format(new Date(), 'yyyyMMdd')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const domainData = [
    { name: '执行力 (Executing)', score: scores.E, color: '#4B5563', desc: '将想法转化为现实，高效完成任务。' },
    { name: '影响力 (Influencing)', score: scores.I, color: '#B45309', desc: '掌控局势、说服他人并产生影响。' },
    { name: '关系建立 (Relationship)', score: scores.R, scoreKey: 'R', color: '#059669', desc: '建立深厚的联系，凝聚团队力量。' },
    { name: '战略思考 (Strategic)', score: scores.S, color: '#2563EB', desc: '分析信息、思考未来并制定方案。' }
  ];

  const topDomain = [...domainData].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity">
          <ArrowLeft size={18} /> 返回深度知己
        </button>
        {step === 'result' && (
          <button 
            onClick={handleDownload}
            className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity bg-brand-hover px-4 py-2 rounded-full"
          >
            <Download size={18} /> 保存天赋报告
          </button>
        )}
      </div>

      <div ref={resultRef} className="p-8 rounded-[40px] bg-[#f7f8f2]">
        <header className="space-y-2 mb-8">
          <h2 className="text-3xl font-serif font-medium italic text-brand-ink">盖洛普优势识别初步测评</h2>
          <p className="text-sm text-brand-secondary max-w-2xl">探索你的四大天赋领域，发掘你独特的天生才干。</p>
        </header>

        {step === 'intro' && (
          <div className="glass-card p-10 bg-white space-y-6 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-brand-hover rounded-full flex items-center justify-center mx-auto text-brand-primary">
              <Sparkles size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-ink">发现你的“天赋原动力”</h3>
              <p className="text-sm text-brand-secondary leading-relaxed italic">
                本测验包含 20 个关于行为偏好的简短问题。<br />请根据你最真实、最自然的状态进行选择。
              </p>
            </div>
            <button 
              onClick={() => setStep('test')}
              className="px-10 py-4 bg-brand-primary text-white rounded-full font-bold custom-shadow-lg hover:-translate-y-1 transition-all"
            >
              启动赋能测验
            </button>
          </div>
        )}

        {step === 'test' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="w-full h-1.5 bg-brand-divider rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(currentQuestion / questions.length) * 100}%` }}
              />
            </div>
            
            <div className="text-center space-y-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary italic">Statement {currentQuestion + 1} of {questions.length}</span>
              <h3 className="text-2xl md:text-3xl font-serif text-brand-ink italic leading-snug">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => handleAnswer(2)}
                  className="p-6 bg-white border border-brand-divider rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink"
                >
                  非常符合 (+2)
                </button>
                <button 
                  onClick={() => handleAnswer(1)}
                  className="p-6 bg-white border border-brand-divider rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink"
                >
                  基本符合 (+1)
                </button>
                <button 
                  onClick={() => handleAnswer(0)}
                  className="p-6 bg-white border border-brand-divider rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink"
                >
                  不太符合 (+0)
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="glass-card p-8 bg-white space-y-6">
                  <h3 className="text-2xl font-serif font-bold text-brand-ink italic">天赋领域分布图</h3>
                  <div className="space-y-6">
                    {domainData.map((d, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-brand-ink">{d.name}</span>
                          <span className="font-mono" style={{ color: d.color }}>{((d.score / 10) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-2 bg-brand-divider rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full"
                            style={{ backgroundColor: d.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(d.score / 10) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-brand-secondary italic">{d.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-card p-8 bg-brand-primary text-white space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#ffffff33] rounded-lg">
                      <Sparkles size={24} />
                    </div>
                    <h4 className="text-xl font-bold italic">主导天赋：{topDomain.name.split(' ')[0]}</h4>
                  </div>
                  <p className="text-sm leading-relaxed serif italic opacity-90">
                    你的核心优势在于“{topDomain.name}”。这意味着你天生具备强大的{topDomain.desc}。在求职中，你应该重点寻找那些能让你发挥这一才干的岗位。
                  </p>
                  <div className="pt-4 border-t border-[#ffffff33] text-xs">
                    💡 <strong>建议</strong>：将你的优势写在简历的“个人总结”中，并用具体的案例（STAR原则）来支撑它。
                  </div>
                </div>

                <div className="glass-card p-8 bg-white border-brand-divider">
                    <h5 className="font-bold text-brand-ink mb-2">如何使用这份报告？</h5>
                    <ul className="space-y-2 text-xs text-brand-secondary leading-relaxed list-disc pl-4">
                        <li><strong>自我肯定</strong>：专注于你的高分项，这是你的“超级力量”。</li>
                        <li><strong>职业对齐</strong>：分析你目前投递的岗位，是否需要这些天赋？</li>
                        <li><strong>面试叙事</strong>：在面试时，用这些词汇来精准描述你的竞争力。</li>
                    </ul>
                </div>
              </div>
            </div>
            
            <button 
              onClick={reset}
              className="w-full py-4 text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-primary transition-colors border-t border-brand-divider"
            >
              重新测验
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CareerAnchorsTool({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    TF: 0, GM: 0, AU: 0, SE: 0, EC: 0, SV: 0, CH: 0, LS: 0
  });
  const resultRef = useRef<HTMLDivElement>(null);

  const questions = [
    { text: "我希望能在一个领域内不仅是专家，还是权威", type: "TF" },
    { text: "我致力于通过组织和管理他人来获得成果", type: "GM" },
    { text: "对我而言，能够按自己的意愿安排工作至关重要", type: "AU" },
    { text: "稳定的收入和长期的职业保障感是我追求的目标", type: "SE" },
    { text: "我渴望通过建立自己的新公司或项目来展现创造力", type: "EC" },
    { text: "我希望我的工作能为改善社会或帮助他人做出贡献", type: "SV" },
    { text: "解决极具挑战性的、看似不可能的问题让我很有动力", type: "CH" },
    { text: "能够平衡职业发展和家庭生活是我最关心的", type: "LS" },
    { text: "我追求的是不断精进自己的专业技术和职能专长", type: "TF" },
    { text: "在职业生涯中，我更愿意承担更多的管理和领导职责", type: "GM" },
    { text: "我讨厌被过多的条条框框束缚，喜欢独立自主", type: "AU" },
    { text: "即使在变化的环境中，我也倾向于保持就业的稳定性", type: "SE" },
    { text: "能够独自启动并经营属于自己的事业非常有吸引力", type: "EC" },
    { text: "我追求的是能与我个人价值观相一致的工作", type: "SV" },
    { text: "竞争激烈的环境和克服巨大困难最能激发我的潜能", type: "CH" },
    { text: "如果工作影响了我个人生活的闲暇，我会感到很不满", type: "LS" },
    { text: "我更喜欢专注于某一具体领域的深度研究或实操", type: "TF" },
    { text: "我能在协调各部门利益并达成整体目标时找到满足感", type: "GM" },
    { text: "我愿意通过放弃高薪来换取更多的个人自由", type: "AU" },
    { text: "我渴望找到一个能让我‘定居’并感觉安全的企业", type: "SE" },
    { text: "我喜欢将我的个人创意转化为有商业价值的成果", type: "EC" },
    { text: "相比于晋升，我更关注我的工作是否产生了正面影响", type: "SV" },
    { text: "对我来说，平淡的工作很难持久，我需要刺激与挑战", type: "CH" },
    { text: "工作的核心目的是为了支持我追求自己喜欢的生活方式", type: "LS" }
  ];

  const handleAnswer = (val: number) => {
    const q = questions[currentQuestion];
    setScores(prev => ({ ...prev, [q.type]: prev[q.type] + val }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
    }
  };

  const reset = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setScores({ TF: 0, GM: 0, AU: 0, SE: 0, EC: 0, SV: 0, CH: 0, LS: 0 });
  };

  const chartData = [
    { subject: '技术/职能', A: scores.TF },
    { subject: '管理型', A: scores.GM },
    { subject: '自主/独立', A: scores.AU },
    { subject: '安全/稳定', A: scores.SE },
    { subject: '创业创造', A: scores.EC },
    { subject: '服务型', A: scores.SV },
    { subject: '挑战型', A: scores.CH },
    { subject: '生活型', A: scores.LS },
  ];

  const sortedResults = (Object.entries(scores) as [string, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({ key, value }));

  const anchorDetails: Record<string, { title: string, desc: string }> = {
    TF: { title: "技术/职能型 (TF)", desc: "核心追求是专业领域内的精进。你视自己为某个领域的专家，成就感源于解决领域内的核心技术问题。" },
    GM: { title: "管理型 (GM)", desc: "核心追求是将各方资源捏合起来达成组织目标。你擅长决策、协调，比起单纯的专家，你更享受统筹全局的过程。" },
    AU: { title: "自主/独立型 (AU)", desc: "核心追求是自由。你难以忍受传统的组织约束，倾向于能够按照自己的节奏、方式和地点来开展工作。" },
    SE: { title: "安全/稳定型 (SE)", desc: "核心追求是安稳与可预测性。你更看重长期的雇佣关系、成熟的福利体系以及地理位置的稳定性。" },
    EC: { title: "创业/创造型 (EC)", desc: "核心追求是‘属于自己的事业’。你并不一定追求高层管理，但你渴望创造出一个带有你个人印记的新事务。" },
    SV: { title: "服务/奉献型 (SV)", desc: "核心追求是‘利他’。你重视工作的意义感和对他人的正面贡献，往往会为了使命感而牺牲一定的物质利益。" },
    CH: { title: "纯粹挑战型 (CH)", desc: "核心追求是克服困难。平庸的生活会让你窒息，你喜欢在不可能中寻找可能，竞争和战胜巨大的挑战是你的原动力。" },
    LS: { title: "生活平衡型 (LS)", desc: "核心追求是‘生活质量’。工作只是生活的一部分，你寻求的是一种能将职业发展、家庭和个人爱好完美融合的方式。" }
  };

  const handleDownload = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: '#f7f8f2',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `career-anchors-${format(new Date(), 'yyyyMMdd')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity">
          <ArrowLeft size={18} /> 返回深度知己
        </button>
        {step === 'result' && (
          <button 
            onClick={handleDownload}
            className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity bg-brand-hover px-4 py-2 rounded-full"
          >
            <Download size={18} /> 保存职业锚报告
          </button>
        )}
      </div>

      <div ref={resultRef} className="p-8 rounded-[40px] bg-[#f7f8f2]">
        <header className="space-y-2 mb-8">
          <h2 className="text-3xl font-serif font-medium italic text-brand-ink">埃德加·施恩职业锚测试</h2>
          <p className="text-sm text-brand-secondary max-w-2xl">识别你“不愿放弃”的核心观，锁定最符合你底层动机的职位。</p>
        </header>

        {step === 'intro' && (
          <div className="glass-card p-10 bg-white space-y-6 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-brand-hover rounded-full flex items-center justify-center mx-auto text-brand-primary">
              <MapPin size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-ink">找到你的职业“定海神针”</h3>
              <p className="text-sm text-brand-secondary leading-relaxed italic">
                职业锚是你内心最真实的动机与价值观的组合。<br />请根据你在真实的职场场景中的偏好进行评分。
              </p>
            </div>
            <button 
              onClick={() => setStep('test')}
              className="px-10 py-4 bg-brand-primary text-white rounded-full font-bold custom-shadow-lg hover:-translate-y-1 transition-all"
            >
              开启锚点探索
            </button>
          </div>
        )}

        {step === 'test' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="w-full h-1.5 bg-brand-divider rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(currentQuestion / questions.length) * 100}%` }}
              />
            </div>
            
            <div className="text-center space-y-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary italic">Statement {currentQuestion + 1} of {questions.length}</span>
              <h3 className="text-2xl md:text-3xl font-serif text-brand-ink italic leading-snug">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[3, 2, 1, 0].map((val) => (
                  <button 
                    key={val}
                    onClick={() => handleAnswer(val)}
                    className="p-6 bg-white border border-brand-divider rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink"
                  >
                    {val === 3 ? "非常认同" : val === 2 ? "比较认同" : val === 1 ? "部分认同" : "完全不认同"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-6">
              <div className="glass-card p-8 bg-white space-y-6">
                <h3 className="text-2xl font-serif font-bold text-brand-ink italic">职业锚测评结果</h3>
                <div className="space-y-5">
                  {sortedResults.slice(0, 3).map((res, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl transition-all border ${idx === 0 ? 'bg-[#5B70520D] border-brand-primary' : 'bg-white border-brand-divider'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-bold uppercase tracking-widest ${idx === 0 ? 'text-brand-primary' : 'text-brand-muted'}`}>顶级锚点 {idx + 1}</span>
                        <span className="font-mono font-bold text-brand-ink">{res.value} pts</span>
                      </div>
                      <h4 className="text-lg font-bold text-brand-ink mb-2">{anchorDetails[res.key].title}</h4>
                      <p className="text-xs text-brand-secondary leading-relaxed serif italic">
                        {anchorDetails[res.key].desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card p-4 bg-white aspect-square flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#7A8573', fontSize: 10, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 9]} tick={false} axisLine={false} />
                    <Radar
                      name="Anchor Score"
                      dataKey="A"
                      stroke="#5B7052"
                      fill="#5B7052"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-8 bg-brand-primary text-white rounded-[40px] custom-shadow-sm italic text-sm">
                  💡 <strong>反思</strong>：在这个 Gap 期，重新审视你的锚点。如果你的前任工作与你的顶级锚点背道而驰，这可能就是疲惫感的主因。在下一步投递中，请务必寻找能承载你“锚点”的容器。
              </div>
              
              <button 
                onClick={reset}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest text-[#A1AA98] hover:text-brand-primary transition-colors border-t border-[#F0F2EA]"
              >
                重新测验
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

