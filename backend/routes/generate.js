import express from "express";
import OpenAI from "openai";

const router = express.Router();

/*
  ⚠️ TEMPORARY:
  Put your OpenAI key here ONLY for local testing.
  Later we will move it to environment variables.
*/
const openai = new OpenAI({
  apiKey: "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"
});

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
