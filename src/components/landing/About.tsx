import { Instagram, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 md:order-1">
          <div className="rounded-[2rem] overflow-hidden shadow-card aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
              alt="João de Deus com um cão sorridente"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-4 -right-4 bg-gradient-warm rounded-full px-5 py-3 shadow-soft font-bold">
            🐾 +5 anos a cuidar
          </div>
        </div>
        <div className="order-1 md:order-2 space-y-5">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">Conheça o João</span>
          <h2 className="text-3xl md:text-5xl font-bold">Cuidar de pets é a minha paixão</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Sou o João, apaixonado por animais desde sempre. Há vários anos que dedico o meu dia-a-dia a passear, cuidar e hospedar cães e gatos com a mesma atenção que dou aos meus.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            No meu Instagram <strong className="text-foreground">@weneedgsus</strong> partilho diariamente as aventuras dos meus clientes peludos — pode ver de perto como cada animal é tratado com carinho, segurança e diversão.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-primary-soft/50 rounded-2xl p-4">
              <Award className="w-7 h-7 text-primary mb-2" />
              <p className="font-bold">Experiência comprovada</p>
              <p className="text-sm text-muted-foreground">Centenas de pets cuidados</p>
            </div>
            <div className="bg-secondary rounded-2xl p-4">
              <Heart className="w-7 h-7 text-primary mb-2" />
              <p className="font-bold">100% dedicado</p>
              <p className="text-sm text-muted-foreground">Atenção personalizada</p>
            </div>
          </div>
          <Button asChild variant="outline" className="rounded-full mt-4">
            <a href="https://instagram.com/weneedgsus" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-4 h-4" /> Seguir @weneedgsus
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default About;
