import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

type ContentMap = Record<string, Record<string, string>>;

const SECTIONS = [
  {
    key: "hero",
    title: "Hero",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "subtitle", label: "Subtítulo", type: "textarea" },
      { name: "cta", label: "Texto do botão", type: "text" },
    ],
  },
  {
    key: "about",
    title: "Sobre o João",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "paragraph1", label: "Parágrafo 1", type: "textarea" },
      { name: "paragraph2", label: "Parágrafo 2", type: "textarea" },
    ],
  },
  {
    key: "services",
    title: "Serviços",
    fields: [
      { name: "walking_desc", label: "Descrição Dog Walking", type: "textarea" },
      { name: "sitting_desc", label: "Descrição Pet Sitting", type: "textarea" },
      { name: "boarding_desc", label: "Descrição Hospedagem", type: "textarea" },
    ],
  },
  {
    key: "instagram",
    title: "Instagram",
    fields: [
      { name: "handle", label: "Handle (@)", type: "text" },
      { name: "description", label: "Descrição", type: "textarea" },
    ],
  },
];

const AdminContent = () => {
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("site_content").select("*").then(({ data }) => {
      const map: ContentMap = {};
      (data ?? []).forEach((row: any) => {
        map[row.section_key] = row.content;
      });
      setContent(map);
      setLoading(false);
    });
  }, []);

  const setField = (section: string, field: string, value: string) => {
    setContent((c) => ({ ...c, [section]: { ...c[section], [field]: value } }));
  };

  const saveSection = async (section: string) => {
    const { error } = await supabase.from("site_content").upsert({
      section_key: section,
      content: content[section] ?? {},
      updated_at: new Date().toISOString(),
    });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Guardado", description: `Secção "${section}" atualizada.` });
  };

  if (loading) return <p>A carregar...</p>;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Conteúdos do site</h1>
        <p className="text-muted-foreground text-sm">Edite os textos de cada secção.</p>
      </div>
      {SECTIONS.map((s) => (
        <div key={s.key} className="bg-card rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="text-xl font-bold">{s.title}</h2>
          {s.fields.map((f) => (
            <div key={f.name} className="space-y-2">
              <Label>{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea
                  rows={3}
                  value={content[s.key]?.[f.name] ?? ""}
                  onChange={(e) => setField(s.key, f.name, e.target.value)}
                />
              ) : (
                <Input
                  value={content[s.key]?.[f.name] ?? ""}
                  onChange={(e) => setField(s.key, f.name, e.target.value)}
                />
              )}
            </div>
          ))}
          <Button onClick={() => saveSection(s.key)} className="rounded-full">
            <Save className="w-4 h-4" /> Guardar {s.title}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AdminContent;
