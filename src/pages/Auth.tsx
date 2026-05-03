import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { PawPrint } from "lucide-react";

const schema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent<HTMLFormElement>, mode: "login" | "signup") => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success) {
      toast({ title: "Erro", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) return toast({ title: "Erro no registo", description: error.message, variant: "destructive" });
      toast({ title: "Conta criada!", description: "Pode fazer login agora." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      setBusy(false);
      if (error) return toast({ title: "Erro no login", description: error.message, variant: "destructive" });
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-glow p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft mb-3">
            <PawPrint className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Painel Admin</h1>
          <p className="text-sm text-muted-foreground">João de Deus Pet Sitter</p>
        </div>
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 w-full rounded-full">
            <TabsTrigger value="login" className="rounded-full">Entrar</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-full">Criar conta</TabsTrigger>
          </TabsList>
          {(["login", "signup"] as const).map((mode) => (
            <TabsContent key={mode} value={mode}>
              <form onSubmit={(e) => submit(e, mode)} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`${mode}-email`}>Email</Label>
                  <Input id={`${mode}-email`} name="email" type="email" required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${mode}-pw`}>Palavra-passe</Label>
                  <Input id={`${mode}-pw`} name="password" type="password" required minLength={6} className="rounded-xl" />
                </div>
                <Button type="submit" disabled={busy} className="w-full rounded-full">
                  {busy ? "..." : mode === "login" ? "Entrar" : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
