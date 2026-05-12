import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { PawPrint, Send, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaults } from "@/lib/siteDefaults";

const schema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(100),
  phone: z.string().trim().min(6, "Telefone inválido").max(30),
  pet_type: z.string().trim().max(80).optional(),
  dates: z.string().trim().max(120).optional(),
  message: z.string().trim().max(800).optional(),
});

const Contact = () => {
  const c = useSiteContent("contact", defaults.contact);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      phone: fd.get("phone"),
      pet_type: fd.get("pet_type") || undefined,
      dates: fd.get("dates") || undefined,
      message: fd.get("message") || undefined,
    });
    if (!parsed.success) {
      toast({ title: "Verifique os campos", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      pet_type: parsed.data.pet_type,
      dates: parsed.data.dates,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Pedido enviado! 🐾", description: "O João entrará em contacto em breve." });
    (e.target as HTMLFormElement).reset();
  };

  const hasInfo = c.email || c.phone || c.whatsapp || c.area;

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">{c.eyebrow}</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">{c.title}</h2>
          <p className="text-muted-foreground mt-4">{c.subtitle}</p>
        </div>
        {hasInfo && (
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {c.email && (
              <a href={`mailto:${c.email}`} className="flex items-center gap-3 bg-card rounded-2xl p-4 shadow-soft hover:shadow-card transition-shadow">
                <Mail className="w-5 h-5 text-primary" /> <span className="text-sm">{c.email}</span>
              </a>
            )}
            {c.phone && (
              <a href={`tel:${c.phone}`} className="flex items-center gap-3 bg-card rounded-2xl p-4 shadow-soft hover:shadow-card transition-shadow">
                <Phone className="w-5 h-5 text-primary" /> <span className="text-sm">{c.phone}</span>
              </a>
            )}
            {c.whatsapp && (
              <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-card rounded-2xl p-4 shadow-soft hover:shadow-card transition-shadow">
                <MessageCircle className="w-5 h-5 text-primary" /> <span className="text-sm">WhatsApp: {c.whatsapp}</span>
              </a>
            )}
            {c.area && (
              <div className="flex items-center gap-3 bg-card rounded-2xl p-4 shadow-soft">
                <MapPin className="w-5 h-5 text-primary" /> <span className="text-sm">{c.area}</span>
              </div>
            )}
          </div>
        )}
        <form onSubmit={onSubmit} className="bg-card rounded-3xl p-6 md:p-10 shadow-card space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" required placeholder="O seu nome" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" required placeholder="+351 9XX XXX XXX" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pet_type">Tipo de animal</Label>
              <Input id="pet_type" name="pet_type" placeholder="Cão, gato..." className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dates">Datas</Label>
              <Input id="dates" name="dates" placeholder="Ex: 12-15 Junho" className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea id="message" name="message" rows={4} placeholder="Conte-nos sobre o seu pet..." className="rounded-xl" />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="rounded-full w-full md:w-auto shadow-glow">
            {loading ? <PawPrint className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
            {loading ? "A enviar..." : "Enviar pedido"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
