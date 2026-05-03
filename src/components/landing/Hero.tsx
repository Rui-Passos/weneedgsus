import { Button } from "@/components/ui/button";
import { PawPrint, Heart, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-hero">
      <div className="container py-16 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-7 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/70 backdrop-blur text-sm font-semibold text-primary shadow-soft">
            <Sparkles className="w-4 h-4" /> Pet Sitter de confiança
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            O cuidado que o seu <span className="text-primary">melhor amigo</span> merece
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Passeios, pet sitting e hospedagem familiar com muito carinho, paciência e atenção. O João trata do seu pet como se fosse dele.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full shadow-glow">
              <a href="#contacto">
                <PawPrint className="w-5 h-5" /> Agendar Passeio/Estadia
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href="#servicos">Ver serviços</a>
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-primary" /> +200 pets felizes</div>
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> 5★ no Instagram</div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-[2rem] overflow-hidden shadow-glow animate-float">
            <img
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80"
              alt="Cão feliz a ser passeado pelo pet sitter João de Deus"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-card hidden sm:flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">Disponível esta semana</p>
              <p className="text-xs text-muted-foreground">Reserve já o seu horário</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
