import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { PawPrint } from "lucide-react";

const schema = z.object({ email: z.string().email("Email inválido").max(255) });

const ForgotPassword = () => {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ email: fd.get("email") });
    if (!parsed.success) {
      toast({ title: "Erro", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    setSent(true);
    toast({ title: "Email enviado", description: "Verifique a sua caixa de entrada." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-glow p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft mb-3">
            <PawPrint className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Recuperar palavra-passe</h1>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Indique o email da sua conta. Enviamos-lhe um link para definir uma nova palavra-passe.
          </p>
        </div>
        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm">Verifique o seu email e siga o link para definir a nova palavra-passe.</p>
            <Link to="/auth"><Button variant="outline" className="rounded-full">Voltar ao login</Button></Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required className="rounded-xl" />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-full">
              {busy ? "A enviar..." : "Enviar link"}
            </Button>
            <div className="text-center">
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
                Voltar ao login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
