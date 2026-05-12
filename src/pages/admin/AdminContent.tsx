import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { defaults } from "@/lib/siteDefaults";
import { ICON_NAMES, renderIcon } from "@/lib/icons";
import { invalidateSiteContent } from "@/hooks/useSiteContent";

type Content = Record<string, any>;

const SECTIONS = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "Sobre" },
  { key: "services", label: "Serviços" },
  { key: "instagram", label: "Instagram" },
  { key: "contact", label: "Contactos" },
  { key: "footer", label: "Rodapé" },
] as const;

const AdminContent = () => {
  const [content, setContent] = useState<Record<string, Content>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("site_content").select("*").then(({ data }) => {
      const map: Record<string, Content> = {};
      SECTIONS.forEach((s) => (map[s.key] = { ...(defaults as any)[s.key] }));
      (data ?? []).forEach((row: any) => {
        map[row.section_key] = { ...(defaults as any)[row.section_key], ...row.content };
      });
      setContent(map);
      setLoading(false);
    });
  }, []);

  const setField = (section: string, field: string, value: any) =>
    setContent((c) => ({ ...c, [section]: { ...c[section], [field]: value } }));

  const save = async (section: string) => {
    const { error } = await supabase.from("site_content").upsert({
      section_key: section,
      content: content[section] ?? {},
      updated_at: new Date().toISOString(),
    });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    invalidateSiteContent(section);
    toast({ title: "Guardado", description: `Secção atualizada.` });
  };

  if (loading) return <p>A carregar...</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Conteúdos do site</h1>
        <p className="text-muted-foreground text-sm">Edite textos e imagens de cada secção. As alterações aparecem imediatamente no site.</p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="flex flex-wrap h-auto">
          {SECTIONS.map((s) => (
            <TabsTrigger key={s.key} value={s.key}>{s.label}</TabsTrigger>
          ))}
        </TabsList>

        {/* HERO */}
        <TabsContent value="hero" className="bg-card rounded-2xl shadow-card p-6 space-y-4">
          <Field label="Badge (etiqueta no topo)" value={content.hero.badge} onChange={(v) => setField("hero", "badge", v)} />
          <div className="grid md:grid-cols-3 gap-3">
            <Field label="Título — parte 1" value={content.hero.title_part1} onChange={(v) => setField("hero", "title_part1", v)} />
            <Field label="Título — destaque" value={content.hero.title_highlight} onChange={(v) => setField("hero", "title_highlight", v)} />
            <Field label="Título — parte 2" value={content.hero.title_part2} onChange={(v) => setField("hero", "title_part2", v)} />
          </div>
          <Field label="Subtítulo" value={content.hero.subtitle} onChange={(v) => setField("hero", "subtitle", v)} textarea />
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Botão principal" value={content.hero.cta_primary} onChange={(v) => setField("hero", "cta_primary", v)} />
            <Field label="Botão secundário" value={content.hero.cta_secondary} onChange={(v) => setField("hero", "cta_secondary", v)} />
            <Field label="Estatística 1" value={content.hero.stat1} onChange={(v) => setField("hero", "stat1", v)} />
            <Field label="Estatística 2" value={content.hero.stat2} onChange={(v) => setField("hero", "stat2", v)} />
            <Field label="Cartão flutuante — título" value={content.hero.badge_card_title} onChange={(v) => setField("hero", "badge_card_title", v)} />
            <Field label="Cartão flutuante — subtítulo" value={content.hero.badge_card_subtitle} onChange={(v) => setField("hero", "badge_card_subtitle", v)} />
          </div>
          <ImageUploader label="Imagem principal" value={content.hero.image} onChange={(v) => setField("hero", "image", v)} aspect="aspect-square" />
          <SaveBtn onClick={() => save("hero")} />
        </TabsContent>

        {/* ABOUT */}
        <TabsContent value="about" className="bg-card rounded-2xl shadow-card p-6 space-y-4">
          <Field label="Eyebrow (texto pequeno acima)" value={content.about.eyebrow} onChange={(v) => setField("about", "eyebrow", v)} />
          <Field label="Título" value={content.about.title} onChange={(v) => setField("about", "title", v)} />
          <Field label="Parágrafo 1" value={content.about.paragraph1} onChange={(v) => setField("about", "paragraph1", v)} textarea />
          <Field label="Parágrafo 2" value={content.about.paragraph2} onChange={(v) => setField("about", "paragraph2", v)} textarea />
          <Field label="Handle Instagram (sem @)" value={content.about.instagram_handle} onChange={(v) => setField("about", "instagram_handle", v)} />
          <Field label="Badge experiência (canto)" value={content.about.experience_badge} onChange={(v) => setField("about", "experience_badge", v)} />
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Cartão 1 — título" value={content.about.card1_title} onChange={(v) => setField("about", "card1_title", v)} />
            <Field label="Cartão 1 — texto" value={content.about.card1_text} onChange={(v) => setField("about", "card1_text", v)} />
            <Field label="Cartão 2 — título" value={content.about.card2_title} onChange={(v) => setField("about", "card2_title", v)} />
            <Field label="Cartão 2 — texto" value={content.about.card2_text} onChange={(v) => setField("about", "card2_text", v)} />
          </div>
          <ImageUploader label="Foto do João" value={content.about.image} onChange={(v) => setField("about", "image", v)} aspect="aspect-[4/5]" />
          <SaveBtn onClick={() => save("about")} />
        </TabsContent>

        {/* SERVICES */}
        <TabsContent value="services" className="bg-card rounded-2xl shadow-card p-6 space-y-4">
          <Field label="Eyebrow" value={content.services.eyebrow} onChange={(v) => setField("services", "eyebrow", v)} />
          <Field label="Título da secção" value={content.services.title} onChange={(v) => setField("services", "title", v)} />
          <Field label="Subtítulo" value={content.services.subtitle} onChange={(v) => setField("services", "subtitle", v)} textarea />
          <ServicesEditor
            items={content.services.items ?? []}
            onChange={(items) => setField("services", "items", items)}
          />
          <SaveBtn onClick={() => save("services")} />
        </TabsContent>

        {/* INSTAGRAM */}
        <TabsContent value="instagram" className="bg-card rounded-2xl shadow-card p-6 space-y-4">
          <Field label="Eyebrow" value={content.instagram.eyebrow} onChange={(v) => setField("instagram", "eyebrow", v)} />
          <Field label="Título" value={content.instagram.title} onChange={(v) => setField("instagram", "title", v)} />
          <Field label="Descrição" value={content.instagram.description} onChange={(v) => setField("instagram", "description", v)} textarea />
          <Field label="Handle (sem @)" value={content.instagram.handle} onChange={(v) => setField("instagram", "handle", v)} />
          <Field label="Texto do botão" value={content.instagram.cta} onChange={(v) => setField("instagram", "cta", v)} />
          <PreviewsEditor
            previews={content.instagram.previews ?? []}
            onChange={(p) => setField("instagram", "previews", p)}
          />
          <SaveBtn onClick={() => save("instagram")} />
        </TabsContent>

        {/* CONTACT */}
        <TabsContent value="contact" className="bg-card rounded-2xl shadow-card p-6 space-y-4">
          <Field label="Eyebrow" value={content.contact.eyebrow} onChange={(v) => setField("contact", "eyebrow", v)} />
          <Field label="Título" value={content.contact.title} onChange={(v) => setField("contact", "title", v)} />
          <Field label="Subtítulo" value={content.contact.subtitle} onChange={(v) => setField("contact", "subtitle", v)} textarea />
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Email" value={content.contact.email} onChange={(v) => setField("contact", "email", v)} />
            <Field label="Telefone" value={content.contact.phone} onChange={(v) => setField("contact", "phone", v)} />
            <Field label="WhatsApp (com indicativo)" value={content.contact.whatsapp} onChange={(v) => setField("contact", "whatsapp", v)} />
            <Field label="Zona / Morada" value={content.contact.area} onChange={(v) => setField("contact", "area", v)} />
          </div>
          <SaveBtn onClick={() => save("contact")} />
        </TabsContent>

        {/* FOOTER */}
        <TabsContent value="footer" className="bg-card rounded-2xl shadow-card p-6 space-y-4">
          <Field label="Nome (no rodapé)" value={content.footer.name} onChange={(v) => setField("footer", "name", v)} />
          <Field label="Handle Instagram (sem @)" value={content.footer.instagram_handle} onChange={(v) => setField("footer", "instagram_handle", v)} />
          <Field label="URL Instagram" value={content.footer.instagram_url} onChange={(v) => setField("footer", "instagram_url", v)} />
          <Field label="Texto do copyright (após o ano)" value={content.footer.copyright} onChange={(v) => setField("footer", "copyright", v)} />
          <SaveBtn onClick={() => save("footer")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Field = ({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    {textarea ? (
      <Textarea rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    )}
  </div>
);

const SaveBtn = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick} className="rounded-full"><Save className="w-4 h-4" /> Guardar</Button>
);

const ServicesEditor = ({ items, onChange }: { items: any[]; onChange: (items: any[]) => void }) => {
  const update = (i: number, patch: any) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { icon: "PawPrint", title: "Novo serviço", desc: "", img: "" }]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <Label>Lista de serviços</Label>
      {items.map((it, i) => (
        <div key={i} className="border rounded-2xl p-4 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
                {renderIcon(it.icon, "w-5 h-5 text-primary")}
              </div>
              <span className="font-semibold">Serviço #{i + 1}</span>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => move(i, -1)}><ArrowUp className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => move(i, 1)}><ArrowDown className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(i)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Ícone</Label>
              <Select value={it.icon} onValueChange={(v) => update(i, { icon: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICON_NAMES.map((n) => (
                    <SelectItem key={n} value={n}>
                      <span className="flex items-center gap-2">{renderIcon(n, "w-4 h-4")} {n}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Field label="Título" value={it.title} onChange={(v) => update(i, { title: v })} />
          </div>
          <Field label="Descrição" value={it.desc} onChange={(v) => update(i, { desc: v })} textarea />
          <ImageUploader label="Imagem" value={it.img} onChange={(v) => update(i, { img: v })} aspect="aspect-[4/3]" />
        </div>
      ))}
      <Button variant="outline" onClick={add} className="rounded-full"><Plus className="w-4 h-4" /> Adicionar serviço</Button>
    </div>
  );
};

const PreviewsEditor = ({ previews, onChange }: { previews: string[]; onChange: (v: string[]) => void }) => {
  const set = (i: number, v: string) => onChange(previews.map((p, idx) => (idx === i ? v : p)));
  const remove = (i: number) => onChange(previews.filter((_, idx) => idx !== i));
  const add = () => onChange([...previews, ""]);
  return (
    <div className="space-y-3">
      <Label>Previews do Instagram (até 6 imagens)</Label>
      <div className="grid sm:grid-cols-2 gap-3">
        {previews.map((p, i) => (
          <div key={i} className="border rounded-2xl p-3 space-y-2 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Imagem #{i + 1}</span>
              <Button size="icon" variant="ghost" onClick={() => remove(i)}><Trash2 className="w-4 h-4" /></Button>
            </div>
            <ImageUploader value={p} onChange={(v) => set(i, v)} aspect="aspect-square" />
          </div>
        ))}
      </div>
      {previews.length < 6 && (
        <Button variant="outline" onClick={add} className="rounded-full"><Plus className="w-4 h-4" /> Adicionar imagem</Button>
      )}
    </div>
  );
};

export default AdminContent;
