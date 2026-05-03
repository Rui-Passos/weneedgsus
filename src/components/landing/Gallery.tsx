import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GalleryItem {
  id: string;
  media_url: string;
  media_type: "image" | "video";
  caption: string | null;
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=600&q=80",
];

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    supabase
      .from("gallery_items")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setItems(data as GalleryItem[]);
      });
  }, []);

  const displayItems =
    items.length > 0
      ? items
      : fallbackImages.map((url, i) => ({
          id: String(i),
          media_url: url,
          media_type: "image" as const,
          caption: null,
        }));

  return (
    <section id="galeria" className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">Galeria</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">Momentos felizes</h2>
          <p className="text-muted-foreground mt-4">Algumas das aventuras dos nossos peludos.</p>
        </div>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
          {displayItems.map((item, i) => (
            <div
              key={item.id}
              className="mb-4 break-inside-avoid rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-all hover:-translate-y-1"
            >
              {item.media_type === "video" ? (
                <video src={item.media_url} controls className="w-full h-auto" />
              ) : (
                <img
                  src={item.media_url}
                  alt={item.caption || `Pet feliz ${i + 1}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
              )}
              {item.caption && (
                <p className="px-3 py-2 text-sm text-muted-foreground">{item.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
