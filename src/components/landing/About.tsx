import { Instagram, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaults } from "@/lib/siteDefaults";

const About = () => {
  const c = useSiteContent("about", defaults.about);
  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 md:order-1">
          <div className="rounded-[2rem] overflow-hidden shadow-card aspect-[4/5]">
            <img src={c.image} alt="João de Deus com um cão" className="w-full h-full object-cover" />
          </div>
          {c.experience_badge && (
            <div className="absolute -top-4 -right-4 bg-gradient-warm rounded-full px-5 py-3 shadow-soft font-bold">
              {c.experience_badge}
            </div>
          )}
        </div>
        <div className="order-1 md:order-2 space-y-5">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">{c.eyebrow}</span>
          <h2 className="text-3xl md:text-5xl font-bold">{c.title}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">{c.paragraph1}</p>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{c.paragraph2}</p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-primary-soft/50 rounded-2xl p-4">
              <Award className="w-7 h-7 text-primary mb-2" />
              <p className="font-bold">{c.card1_title}</p>
              <p className="text-sm text-muted-foreground">{c.card1_text}</p>
            </div>
            <div className="bg-secondary rounded-2xl p-4">
              <Heart className="w-7 h-7 text-primary mb-2" />
              <p className="font-bold">{c.card2_title}</p>
              <p className="text-sm text-muted-foreground">{c.card2_text}</p>
            </div>
          </div>
          {c.instagram_handle && (
            <Button asChild variant="outline" className="rounded-full mt-4">
              <a href={`https://instagram.com/${c.instagram_handle}`} target="_blank" rel="noopener noreferrer">
                <Instagram className="w-4 h-4" /> Seguir @{c.instagram_handle}
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
