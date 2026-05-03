import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
            <PawPrint className="w-5 h-5 text-primary-foreground" />
          </span>
          <span>João de Deus</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
          <a href="#sobre" className="hover:text-primary transition-colors">Sobre</a>
          <a href="#servicos" className="hover:text-primary transition-colors">Serviços</a>
          <a href="#galeria" className="hover:text-primary transition-colors">Galeria</a>
          <a href="#instagram" className="hover:text-primary transition-colors">Instagram</a>
          <a href="#contacto" className="hover:text-primary transition-colors">Contacto</a>
        </nav>
        <Button asChild size="sm" className="rounded-full">
          <a href="#contacto">Agendar</a>
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
