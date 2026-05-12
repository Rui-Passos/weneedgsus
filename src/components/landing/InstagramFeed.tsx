import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaults } from "@/lib/siteDefaults";

const InstagramFeed = () => {
  const c = useSiteContent("instagram", defaults.instagram);
  const url = `https://instagram.com/${c.handle}`;
  const previews = (c.previews ?? []).filter(Boolean);
  return (
    <section id="instagram" className="py-20 bg-gradient-warm">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">{c.eyebrow}</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">{c.title}</h2>
          <p className="text-muted-foreground mt-4">{c.description}</p>
        </div>
        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
            {previews.map((src, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                 className="group relative aspect-square rounded-2xl overflow-hidden shadow-card">
                <img src={src} alt={`Post Instagram ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        )}
        <div className="text-center">
          <Button asChild size="lg" className="rounded-full shadow-glow">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <Instagram className="w-5 h-5" /> {c.cta}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
