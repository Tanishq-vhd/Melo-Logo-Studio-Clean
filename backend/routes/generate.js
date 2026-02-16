import express from "express";
import OpenAI from "openai";

const router = express.Router();

router.post("/image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const images = [];

    for (let i = 0; i < 6;i++) {
      try {
        const result = await openai.images.generate({
          model: "dall-e-3",
          prompt: `${prompt}. Variation ${i + 1}. Clean vector logo.`,
          size: "1024x1024",
        });

        images.push(result.data[0].url);
      } catch (err) {
        console.error("Single image failed:", err.message);
      }
    }

    if (images.length === 0) {
      return res.status(500).json({ error: "No images generated" });
    }

    return res.json({ images });

  } catch (err) {
    console.error("OpenAI error:", err.message);
    return res.status(500).json({
      error: "Image generation failed",
      details: err.message,
    });
  }
  

});
export default router;
