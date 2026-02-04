import { Sparkles, Image, Infinity, Zap } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "Professional & Trustworthy",
      desc: "AI powered logos that look polished and build instant credibility."
    },
    {
      icon: Image,
      title: "Instagram-Ready Formats",
      desc: "Perfect for posts, reels, highlights, and ads."
    },
    {
      icon: Infinity,
      title: "Unlimited Generations",
      desc: "Create as many variations as you want until it feels right."
    },
    {
      icon: Zap,
      title: "Full Commercial Usage",
      desc: "Use logos freely for ads, products, and brands."
    }
  ];

  return (
    <section className="features">
      <h2>Everything you need to build your brand</h2>

      <div className="features-grid">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div className="feature-card" key={i}>
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
