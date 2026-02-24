import { Store, Users, Rocket, Package } from "lucide-react";

export default function CreatorTypes() {
  const items = [
    { icon: Store, title: "Instagram Stores", desc: "Stand out and build trust with professional branding." },
    { icon: Users, title: "Content Creators", desc: "Grow your audience with memorable brand identity." },
    { icon: Rocket, title: "Small Businesses", desc: "Launch confidently without designer costs." },
    { icon: Package, title: "Product Launches", desc: "Test multiple brand identities quickly." }
  ];

  return (
    <section className="creators">
      <h2>Perfect for every creator</h2>
      <p>Whether you're starting fresh or scaling up, InstaLogo Studio helps you create professional branding</p>

      <div className="creators-grid">
        {items.map((c, i) => {
          const Icon = c.icon;
          return (
            <div className="creator-card" key={i}>
              <Icon size={26} />
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
