import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Upload, Save } from "lucide-react";

interface Item {
  id: string;
  media_url: string;
  media_type: string;
  caption: string | null;
  display_order: number;
}

const AdminGallery = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .order("display_order", { ascending: true });
    setItems((data as Item[]) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("gallery").upload(path, file);
      if (upErr) {
        toast({ title: "Erro upload", description: upErr.message, variant: "destructive" });
        continue;
      }
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      const media_type = file.type.startsWith("video") ? "video" : "image";
      await supabase.from("gallery_items").insert({
        media_url: pub.publicUrl,
        media_type,
        display_order: items.length,
      });
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    load();
    toast({ title: "Upload concluído" });
  };

  const updateItem = async (id: string, patch: Partial<Item>) => {
    setItems((s) => s.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const save = async (item: Item) => {
    const { error } = await supabase
      .from("gallery_items")
      .update({ caption: item.caption, display_order: item.display_order })
      .eq("id", item.id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Guardado" });
  };

  const remove = async (item: Item) => {
    if (!confirm("Apagar este item?")) return;
    const filename = item.media_url.split("/").pop();
    if (filename) await supabase.storage.from("gallery").remove([filename]);
    await supabase.from("gallery_items").delete().eq("id", item.id);
    load();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Galeria</h1>
          <p className="text-muted-foreground text-sm">Faça upload e gira fotos e vídeos.</p>
        </div>
        <label>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => onUpload(e.target.files)}
          />
          <Button asChild disabled={uploading} className="rounded-full">
            <span><Upload className="w-4 h-4" /> {uploading ? "A enviar..." : "Adicionar ficheiros"}</span>
          </Button>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-card rounded-2xl overflow-hidden shadow-card">
            {item.media_type === "video" ? (
              <video src={item.media_url} controls className="w-full aspect-video object-cover" />
            ) : (
              <img src={item.media_url} alt={item.caption ?? ""} className="w-full aspect-video object-cover" />
            )}
            <div className="p-3 space-y-2">
              <Input
                placeholder="Legenda"
                value={item.caption ?? ""}
                onChange={(e) => updateItem(item.id, { caption: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Ordem"
                  value={item.display_order}
                  onChange={(e) => updateItem(item.id, { display_order: Number(e.target.value) })}
                  className="w-24"
                />
                <Button size="sm" onClick={() => save(item)} className="flex-1"><Save className="w-4 h-4" /> Guardar</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(item)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">Sem itens. Faça upload do primeiro ficheiro.</p>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
