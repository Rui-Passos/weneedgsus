import { Button } from "@/components/ui/button";
import { PawPrint, Heart, Sparkles } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaults } from "@/lib/siteDefaults";

const Hero = () => {
  const c = useSiteContent("hero", defaults.hero);
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-hero">
      <div className="container py-16 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-7 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/70 backdrop-blur text-sm font-semibold text-primary shadow-soft">
            <Sparkles className="w-4 h-4" /> {c.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {c.title_part1} <span className="text-primary">{c.title_highlight}</span> {c.title_part2}
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">{c.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full shadow-glow">
              <a href="#contacto"><PawPrint className="w-5 h-5" /> {c.cta_primary}</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href="#servicos">{c.cta_secondary}</a>
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-primary" /> {c.stat1}</div>
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> {c.stat2}</div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-[2rem] overflow-hidden shadow-glow animate-float">
            <img src={c.image} alt="Pet sitter João de Deus" className="w-full h-full object-cover" />
          </div>
          {(c.badge_card_title || c.badge_card_subtitle) && (
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-card hidden sm:flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">{c.badge_card_title}</p>
                <p className="text-xs text-muted-foreground">{c.badge_card_subtitle}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
