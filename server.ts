import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { contents, systemInstruction, model, userCustomKey } = req.body;

      const rawKey = userCustomKey || process.env.GEMINI_API_KEY;
      const apiKey = rawKey?.toString().trim();

      if (!apiKey) {
        return res.status(400).json({ 
          error: "缺少有效 API Key。请在左上角设置中配置个人 Key，或联系管理员配置默认 Key。" 
        });
      }

      // Model name correction
      const validModel = (model === "gemini-3-flash-preview" || !model) ? "gemini-1.5-flash" : model;

      const genAI = new GoogleGenAI({ apiKey });
      
      // Normalize contents
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
        throw new Error("AI 返回了空内容。");
      }

      res.json({ text });
    } catch (error: any) {
      console.error("[Gemini Proxy] Error:", error);
      
      let errorMessage = "AI 调用失败，请稍后再试。";
      if (error.message?.includes("API key not valid")) {
        errorMessage = "API Key 无效。请检查您的个人 Key 配置，或稍后重试公共模式。";
      } else if (error.message?.includes("quota")) {
        errorMessage = "当前 Key 额度已耗尽 (Quota Exceeded)，请稍后再试或换用个人 Key。";
      }

      res.status(500).json({ 
        error: errorMessage,
        details: error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Static file serving for production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
