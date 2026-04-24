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

      // Model name correction (gemini-3-flash is a hallway/hallucinated name)
      const validModel = (model === "gemini-3-flash-preview" || !model) ? "gemini-1.5-flash" : model;

      const genAI = new GoogleGenAI({ apiKey });
      
      // Normalize contents for GenAI SDK v1.x (Unified SDK)
      // Expects objects like: [{ role: 'user', parts: [{ text: '...' }] }]
      const normalizedContents = typeof contents === 'string' 
        ? [{ role: 'user', parts: [{ text: contents }] }]
        : contents;

      const response = await genAI.models.generateContent({
        model: validModel,
        contents: normalizedContents,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      const text = response.text;

      if (!text) {
        throw new Error("AI 返回了空内容。可能是模型选择或输入格式有误。");
      }

      return res.status(200).json({ text });
    } catch (error: any) {
      console.error("[Vercel API] Error:", error);
      
      // Return details only in non-production or for debugging if needed, 
      // but here we help the user see why it failed.
      return res.status(500).json({ 
        error: error.message?.includes("not valid") ? "API Key 无效" : "AI 调用失败",
        details: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      });
    }
}
