import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

    try {
      const { contents, systemInstruction, model, userCustomKey } = req.body;

      const rawKey = userCustomKey || process.env.GEMINI_API_KEY;
      const apiKey = rawKey?.toString().trim();

      if (!apiKey) {
        return res.status(400).json({ 
          error: "缺少有效 API Key。请在左上角设置中配置个人 Key，或在环境变量中配置 GEMINI_API_KEY。" 
        });
      }

      const genAI = new GoogleGenAI({ apiKey });
      const response = await genAI.models.generateContent({
        model: model || "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      const text = response.text;

    if (!text) {
      throw new Error("AI 返回了空内容。");
    }

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("[Vercel API] Error:", error);
    
    let errorMessage = "AI 调用失败，请稍后再试。";
    if (error.message?.includes("API key not valid")) {
      errorMessage = "API Key 无效。请检查您的个人 Key 配置，或检查部署的环境变量。";
    } else if (error.message?.includes("quota")) {
      errorMessage = "当前 Key 额度已耗尽 (Quota Exceeded)，请稍后再试或换用个人 Key。";
    }

    return res.status(500).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
}
