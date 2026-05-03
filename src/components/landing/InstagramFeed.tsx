import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const previews = [
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=500&q=80",
];

const InstagramFeed = () => {
  return (
    <section id="instagram" className="py-20 bg-gradient-warm">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">Instagram</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">Acompanhe as Aventuras</h2>
          <p className="text-muted-foreground mt-4">
            Veja o dia-a-dia dos nossos peludos no Instagram <strong>@weneedgsus</strong>
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
          {previews.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com/weneedgsus"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-card"
            >
              <img src={src} alt={`Post Instagram ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors flex items-center justify-center">
                <Instagram className="w-8 h-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
        <div className="text-center">
          <Button asChild size="lg" className="rounded-full shadow-glow">
            <a href="https://instagram.com/weneedgsus" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-5 h-5" /> Seguir @weneedgsus
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
