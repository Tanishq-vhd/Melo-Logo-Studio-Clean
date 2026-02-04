import express from "express";
import OpenAI from "openai";

const router = express.Router();

/*
  ⚠️ TEMPORARY:
  Put your OpenAI key here ONLY for local testing.
  Later we will move it to environment variables.
*/
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


router.post("/image", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log(" Prompt received:", prompt);

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024"
    });

    console.log(" Image generated successfully");

    return res.json({
      imageUrl: result.data[0].url,
      source: "openai"
    });

  } catch (err) {
    console.error(" OpenAI error:", err.message);

    /*
      🔁 FALLBACK LOGIC
      If billing is exhausted, return a demo image
      so frontend still works.
    */
    if (
      err.code === "billing_hard_limit_reached" ||
      err.message?.includes("Billing hard limit")
    ) {
      return res.json({
        imageUrl:
          "https://via.placeholder.com/1024x1024.png?text=Upgrade+to+Generate+Images",
        source: "fallback"
      });
    }

    return res.status(500).json({
      error: "Image generation failed",
      details: err.message
    });
  }
});

export default router;
