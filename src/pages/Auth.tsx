import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { PawPrint } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

const signupSchema = loginSchema.extend({
  display_name: z.string().min(2, "Nome demasiado curto").max(80),
});

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/admin" replace />;

  const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success) {
      toast({ title: "Erro", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setBusy(false);
    if (error) return toast({ title: "Erro no login", description: error.message, variant: "destructive" });
    navigate("/admin");
  };

  const submitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
      display_name: fd.get("display_name"),
    });
    if (!parsed.success) {
      toast({ title: "Erro", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { display_name: parsed.data.display_name },
      },
    });
    setBusy(false);
    if (error) return toast({ title: "Erro no registo", description: error.message, variant: "destructive" });
    toast({
      title: "Conta criada",
      description: "Verifique o seu email para confirmar. Depois aguarde aprovação do administrador.",
    });
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

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Criar conta</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={submitLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" name="email" type="email" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Palavra-passe</Label>
                <Input id="login-password" name="password" type="password" required minLength={6} className="rounded-xl" />
              </div>
              <Button type="submit" disabled={busy} className="w-full rounded-full">
                {busy ? "..." : "Entrar"}
              </Button>
              <div className="text-center">
                <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
                  Esqueci-me da palavra-passe
                </Link>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={submitSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Nome</Label>
                <Input id="signup-name" name="display_name" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Palavra-passe</Label>
                <Input id="signup-password" name="password" type="password" required minLength={6} className="rounded-xl" />
              </div>
              <Button type="submit" disabled={busy} className="w-full rounded-full">
                {busy ? "..." : "Criar conta"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Após criar conta, o administrador terá de lhe dar permissões para aceder ao painel.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
