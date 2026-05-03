import { Instagram, PawPrint } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background py-10">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 font-bold">
        <PawPrint className="w-5 h-5" />
        João de Deus · Pet Sitter
      </div>
      <a href="https://instagram.com/weneedgsus" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-accent transition-colors">
        <Instagram className="w-4 h-4" /> @weneedgsus
      </a>
      <p className="text-xs opacity-70">© {new Date().getFullYear()} Feito com 🐾</p>
    </div>
  </footer>
);

export default Footer;
