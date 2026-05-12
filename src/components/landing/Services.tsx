import { useSiteContent } from "@/hooks/useSiteContent";
import { defaults } from "@/lib/siteDefaults";
import { renderIcon } from "@/lib/icons";

const Services = () => {
  const c = useSiteContent("services", defaults.services);
  return (
    <section id="servicos" className="py-20 bg-gradient-hero">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">{c.eyebrow}</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">{c.title}</h2>
          <p className="text-muted-foreground mt-4">{c.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {(c.items ?? []).map((s, i) => (
            <div key={i} className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
              {s.img && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
                  {renderIcon(s.icon, "w-6 h-6 text-primary")}
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
