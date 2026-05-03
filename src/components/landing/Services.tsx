import { Footprints, Home, Hotel } from "lucide-react";

const services = [
  {
    icon: Footprints,
    title: "Dog Walking",
    desc: "Passeios diários cheios de aventura, exercício e socialização para o seu cão.",
    img: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=700&q=80",
  },
  {
    icon: Home,
    title: "Pet Sitting",
    desc: "Cuido do seu pet em casa: alimentação, mimos, brincadeiras e companhia.",
    img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=700&q=80",
  },
  {
    icon: Hotel,
    title: "Hospedagem Familiar",
    desc: "O seu pet fica em ambiente familiar, com todo o conforto e atenção 24/7.",
    img: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=700&q=80",
  },
];

const Services = () => {
  return (
    <section id="servicos" className="py-20 bg-gradient-hero">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">Serviços</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">Soluções para cada peludo</h2>
          <p className="text-muted-foreground mt-4">Escolha o serviço perfeito para o seu melhor amigo.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
