import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const schema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "As palavras-passe não coincidem", path: ["confirm"] });

const AdminAccount = () => {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  const change = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ password: fd.get("password"), confirm: fd.get("confirm") });
    if (!parsed.success) {
      toast({ title: "Erro", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setBusy(false);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Palavra-passe alterada" });
    (e.target as HTMLFormElement).reset();
  };

  const signOutEverywhere = async () => {
    await supabase.auth.signOut({ scope: "global" });
    toast({ title: "Sessão terminada em todos os dispositivos" });
  };

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Conta</h1>
        <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
      </div>

      <section className="bg-card rounded-2xl border p-6 space-y-4">
        <h2 className="font-semibold">Alterar palavra-passe</h2>
        <form onSubmit={change} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova palavra-passe</Label>
            <Input id="password" name="password" type="password" required minLength={8} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmar</Label>
            <Input id="confirm" name="confirm" type="password" required minLength={8} className="rounded-xl" />
          </div>
          <Button type="submit" disabled={busy} className="rounded-full">
            {busy ? "A guardar..." : "Guardar"}
          </Button>
        </form>
      </section>

      <section className="bg-card rounded-2xl border p-6 space-y-4">
        <h2 className="font-semibold">Sessão</h2>
        <p className="text-sm text-muted-foreground">
          Termine a sessão em todos os dispositivos onde tenha entrado.
        </p>
        <div className="flex gap-2">
          <Button onClick={signOut} variant="outline" className="rounded-full">Sair deste dispositivo</Button>
          <Button onClick={signOutEverywhere} variant="destructive" className="rounded-full">
            Sair de todos os dispositivos
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AdminAccount;
