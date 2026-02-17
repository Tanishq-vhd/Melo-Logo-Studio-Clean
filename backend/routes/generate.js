import express from "express";
import OpenAI from "openai";
import fetch from "node-fetch";

const router = express.Router();

/* ---------------- IMAGE GENERATION ---------------- */

router.post("/image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create 6 variations
    const prompts = Array.from({ length: 6 }, (_, i) =>
      `${prompt}. Variation ${i + 1}. Clean vector logo, minimal background.`
    );

    const results = await Promise.allSettled(
      prompts.map((p) =>
        openai.images.generate({
          model: "dall-e-3",
          prompt: p,
          size: "1024x1024",
        })
      )
    );

    const images = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value.data[0].url);

    console.log("Images generated:", images.length);

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

/* ---------------- IMAGE DOWNLOAD (FIXED CORS ISSUE) ---------------- */

router.post("/download-image", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL missing" });
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch image" });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=melo-logo.png"
    );

    res.send(buffer);

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Download failed" });
  }
});


export default router;
