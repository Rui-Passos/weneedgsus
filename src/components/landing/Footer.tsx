import { Instagram, PawPrint } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaults } from "@/lib/siteDefaults";

const Footer = () => {
  const c = useSiteContent("footer", defaults.footer);
  return (
    <footer className="bg-foreground text-background py-10">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold">
          <PawPrint className="w-5 h-5" />
          {c.name}
        </div>
        {c.instagram_url && (
          <a href={c.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-accent transition-colors">
            <Instagram className="w-4 h-4" /> @{c.instagram_handle}
          </a>
        )}
        <p className="text-xs opacity-70">© {new Date().getFullYear()} {c.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
