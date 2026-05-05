import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { PawPrint } from "lucide-react";

const schema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "As palavras-passe não coincidem", path: ["confirm"] });

type Status = "validating" | "ready" | "error";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>("validating");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const url = new URL(window.location.href);
        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash;
        const hashParams = new URLSearchParams(hash);

        const code = url.searchParams.get("code");
        const errorDesc =
          url.searchParams.get("error_description") || hashParams.get("error_description");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (errorDesc) {
          throw new Error(errorDesc);
        }

        // PKCE flow (?code=...)
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          // Implicit flow (#access_token=...&refresh_token=...)
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        }

        // Limpar URL para evitar reprocessamento
        window.history.replaceState({}, "", window.location.pathname);

        // Verificar sessão (poll curto)
        let session = (await supabase.auth.getSession()).data.session;
        for (let i = 0; i < 10 && !session && !cancelled; i++) {
          await new Promise((r) => setTimeout(r, 200));
          session = (await supabase.auth.getSession()).data.session;
        }

        if (cancelled) return;

        if (!session) {
          throw new Error(
            "Link inválido ou expirado. Peça um novo email de recuperação."
          );
        }

        setStatus("ready");
      } catch (e: any) {
        if (cancelled) return;
        setErrorMsg(e?.message ?? "Não foi possível validar o link.");
        setStatus("error");
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    toast({ title: "Palavra-passe atualizada", description: "Já pode usar o painel." });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-glow p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft mb-3">
            <PawPrint className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Nova palavra-passe</h1>
        </div>

        {status === "validating" && (
          <p className="text-center text-sm text-muted-foreground">A validar link...</p>
        )}

        {status === "error" && (
          <div className="space-y-4 text-center">
            <p className="text-sm text-destructive">{errorMsg}</p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/forgot-password">Pedir novo link</Link>
            </Button>
          </div>
        )}

        {status === "ready" && (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova palavra-passe</Label>
              <Input id="password" name="password" type="password" required minLength={8} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar</Label>
              <Input id="confirm" name="confirm" type="password" required minLength={8} className="rounded-xl" />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-full">
              {busy ? "A guardar..." : "Definir palavra-passe"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
