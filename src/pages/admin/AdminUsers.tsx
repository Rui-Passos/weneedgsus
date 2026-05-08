import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
}

const AdminUsers = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("id, email, display_name, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role").eq("role", "admin"),
    ]);
    if (profilesRes.error) toast({ title: "Erro", description: profilesRes.error.message, variant: "destructive" });
    if (rolesRes.error) toast({ title: "Erro", description: rolesRes.error.message, variant: "destructive" });
    setProfiles((profilesRes.data as Profile[]) ?? []);
    setAdminIds(new Set((rolesRes.data ?? []).map((r: { user_id: string }) => r.user_id)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const promote = async (uid: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Permissões concedidas" });
    load();
  };

  const demote = async (uid: string) => {
    if (uid === user?.id && !confirm("Remover as suas próprias permissões? Vai perder acesso ao admin.")) return;
    const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Permissões removidas" });
    load();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Utilizadores</h1>
        <p className="text-muted-foreground text-sm">Aprove novos registos e gira as permissões de administrador.</p>
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registado em</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">A carregar...</TableCell></TableRow>
            ) : profiles.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Sem utilizadores.</TableCell></TableRow>
            ) : (
              profiles.map((p) => {
                const isAdmin = adminIds.has(p.id);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.display_name ?? "—"}</TableCell>
                    <TableCell>{p.email ?? "—"}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString("pt-PT")}
                    </TableCell>
                    <TableCell>
                      {isAdmin ? <Badge>Admin</Badge> : <Badge variant="secondary">Pendente</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      {isAdmin ? (
                        <Button size="sm" variant="outline" onClick={() => demote(p.id)}>
                          Remover admin
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => promote(p.id)}>
                          Tornar admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
