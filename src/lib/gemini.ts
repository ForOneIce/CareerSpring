import { GoogleGenAI } from "@google/genai";

const getAi = () => {
  const customKey = typeof window !== 'undefined' ? localStorage.getItem('RESILIENCE_GEMINI_KEY') : null;
  // Handle falsy values and potential 'undefined' string from vite define
  let apiKey = customKey;
  
  if (!apiKey || apiKey.trim() === '') {
    apiKey = process.env.GEMINI_API_KEY;
  }

  // Ensure apiKey is a valid string and not literally "undefined"
  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') {
    throw new Error("Gemini API Key is missing. Please configure it in settings.");
  }
  
  return new GoogleGenAI({ apiKey: apiKey.trim() });
};

export const generateEncouragement = async (mood?: string) => {
  const ai = getAi();
  const prompt = mood 
    ? `用户现在觉得${mood}。作为一个温暖治愈的求职教练，请给长期Gap后的求职者写一段极简、静谧、有力量的鼓励话。要求：一到两短句，总长50字以内，像诗一样简洁。`
    : `请写一段关于“慢慢来”或“花期各异”的极简治愈话语。要求：一两句短语，总长50字以内，不要说教，只要静谧的美感。`;
    
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "你是一个极简主义治愈系AI助手。你擅长用最简短、最动人的文学语言安抚人心。不要废话，不要列举建议，每句话都要像写在明信片上的诗。",
    }
  });

  return response.text || "";
};

export const generateSTARResponse = async (context: string, action: string, result: string) => {
  const ai = getAi();
  const prompt = `
    情景描述: ${context}
    采取行动: ${action}
    最终结果: ${result}
    
    请根据以上内容，使用STAR法则（Situation-Task-Action-Result）帮我优化这段项目经历/面试回答。要求语言专业、数据支撑感强、逻辑清晰。并给出一个“治愈建议”，告诉用户这个经历体现了他们什么样的独特价值。
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "你是一个专业的面试教练。你擅长把平凡的经历包装成具有闪光点的面试素材。在包装的同时，你总是能发现用户身上被他们自己忽略的韧性与才华。",
    }
  });

  return response.text || "";
};

export const generateIkigaiSynthesis = async (love: string, goodAt: string, need: string, pay: string) => {
  const ai = getAi();
  const prompt = `
    我热爱的: ${love}
    我擅长的: ${goodAt}
    世界需要的: ${need}
    能获报酬的: ${pay}
    
    请根据这四个维度的输入，帮我进行深度整合。
    1. 寻找这四个圆圈的交集（即 Ikigai 点）。
    2. 给出 2-3 个具体的职业职业赛道建议。
    3. 给出一段治愈的话，鼓励我朝着这个交集迈进。
    要求：语言温暖、专业且具有启发性。
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "你是一个职业生涯规划专家，擅长使用 Ikigai 模型引导用户发现生命意义。你的分析深刻且具有同理心，能从看似不相关的碎片中通过直觉与逻辑找到完美的职业契合点。",
    }
  });

  return response.text || "";
};

export const analyzeIndustry = async (keyword: string) => {
  const ai = getAi();
  const prompt = `
    目标行业/领域: ${keyword}
    
    请根据你的知识库（包括最新的2024-2025趋势见解），为求职者提供该行业的深度调研报告。
    1. 行业现状：用3个关键指标或关键词概括。
    2. 岗位价值：该行业目前最核心的人才缺口在哪里？
    3. 政策风口：是否有国家扶持或重大的政策变动？
    4. 风险预警：进入该行业可能面临的挑战（如加班、技术迭代过快等）。
    5. 治愈建议：针对Gap期求职者，给出一条进入该行业的策略。
    
    要求：结构化表达，专业且直击痛点，文风治愈。
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "你是一个资深的行业分析师和求职教练。你擅长透过现象看本质，为求职者提供极具洞察力的行业分析，同时不失人文关怀。",
    }
  });

  return response.text || "";
};

export const parseJobPosting = async (text: string) => {
  const ai = getAi();
  const prompt = `
    Job Description Text/Context: ${text}
    
    请分析并从上述文本中提取关键字段。返回格式必须为 JSON 格式，包含以下字段：
    - companyName (公司全称)
    - positionName (岗位名称)
    - keywords (3个核心职能关键词，用逗号分隔)
    - location (工作地点)
    - salaryRange (薪资范围，如 20k-30k)
    - teamTechStack (团队技术栈)
    - summary (一句话职位亮点)
    
    如果某些信息缺失，请填写“未知”。
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "你是一个专业的招聘数据提取器。你擅长从杂乱的海报、招聘文章或JD链接片段中提取结构化的职位信息。你只返回纯 JSON 内容，不包含任何 Markdown 格式。输出格式：{\"companyName\": \"...\", ...}",
    }
  });

  try {
    const rawText = (response.text || "").trim();
    if (!rawText) return null;
    const jsonStr = rawText.match(/\{[\s\S]*\}/)?.[0] || rawText;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JD JSON", e);
    return null;
  }
};

export const generateResumeOptimization = async (jd: string, resume: string) => {
  const ai = getAi();
  const prompt = `
    Job Description (JD):
    ${jd}
    
    My Resume (Condensed):
    ${resume}
    
    请根据岗位要求和我目前的简历，提供深度的简历优化与职场补充建议。
    要求返回 JSON 格式，包含以下模块：
    1. jobProfile: { category: string, coreValues: string } (岗位类型及核心诉求)
    2. matches: string[] (我的简历中已覆盖的亮点)
    3. missing: { reason: string, suggestion: string }[] (简历中的薄弱环节及具体修改建议)
    4. beyondResume: { title: string, content: string }[] (简历外的补充建议，如作品集、GitHub、调研报告建议等)
    5. interviewQuestions: string[] (预测面试官最感冒的3个追问问题)
    
    语言风格：专业、温暖、引导式，字数不宜过多，要直击要害。
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "你是一个资深的职业生涯教练。你不仅擅长改简历，更擅长帮助求职者理解企业背后的诉求。你的建议总是能帮求职者在简历之外准备好全套‘求职武器库’。请仅返回 JSON，不要 Markdown 围栏。",
    }
  });

  try {
    const rawText = (response.text || "").trim();
    if (!rawText) return null;
    const jsonStr = rawText.match(/\{[\s\S]*\}/)?.[0] || rawText;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse Resume JSON", e);
    return null;
  }
};
