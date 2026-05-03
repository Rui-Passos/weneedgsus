import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Msg {
  id: string;
  name: string;
  phone: string;
  pet_type: string | null;
  dates: string | null;
  message: string | null;
  created_at: string;
}

const AdminMessages = () => {
  const [msgs, setMsgs] = useState<Msg[]>([]);

  const load = () =>
    supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setMsgs((data as Msg[]) ?? []));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Apagar mensagem?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold">Mensagens recebidas</h1>
        <p className="text-muted-foreground text-sm">Pedidos de contacto enviados pelo formulário.</p>
      </div>
      <div className="bg-card rounded-2xl shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Pet</TableHead>
              <TableHead>Datas</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {msgs.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(m.created_at).toLocaleString("pt-PT")}
                </TableCell>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell><a href={`tel:${m.phone}`} className="text-primary">{m.phone}</a></TableCell>
                <TableCell>{m.pet_type ?? "-"}</TableCell>
                <TableCell>{m.dates ?? "-"}</TableCell>
                <TableCell className="max-w-xs">{m.message ?? "-"}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" onClick={() => remove(m.id)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {msgs.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Sem mensagens.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminMessages;
