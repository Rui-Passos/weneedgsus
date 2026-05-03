import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { PawPrint, Send } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(100),
  phone: z.string().trim().min(6, "Telefone inválido").max(30),
  pet_type: z.string().trim().max(80).optional(),
  dates: z.string().trim().max(120).optional(),
  message: z.string().trim().max(800).optional(),
});

const Contact = () => {
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
    const { error } = await supabase.from("contact_submissions").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Pedido enviado! 🐾", description: "O João entrará em contacto em breve." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">Contacto</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">Vamos cuidar do seu pet?</h2>
          <p className="text-muted-foreground mt-4">Preencha o formulário e o João responde-lhe rapidamente.</p>
        </div>
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
