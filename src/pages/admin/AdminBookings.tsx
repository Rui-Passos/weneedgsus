import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Status = "pending" | "confirmed" | "completed" | "cancelled";

interface Booking {
  id: string;
  client_name: string;
  phone: string;
  pet_type: string | null;
  service: string | null;
  start_at: string;
  end_at: string | null;
  status: Status;
  notes: string | null;
  price: number | null;
  contact_submission_id: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<Status, string> = {
  pending: "Pendente",
  confirmed: "Confirmada",
  completed: "Concluída",
  cancelled: "Cancelada",
};

const STATUS_VARIANT: Record<Status, "secondary" | "default" | "outline" | "destructive"> = {
  pending: "secondary",
  confirmed: "default",
  completed: "outline",
  cancelled: "destructive",
};

const emptyForm = {
  id: "",
  client_name: "",
  phone: "",
  pet_type: "",
  service: "",
  start_at: "",
  end_at: "",
  status: "pending" as Status,
  notes: "",
  price: "",
};

const fmtEuro = (n: number) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);


const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("start_at", { ascending: false });
    if (error) {
      toast({ title: "Erro a carregar", description: error.message, variant: "destructive" });
      return;
    }
    setBookings((data as Booking[]) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter],
  );

  const stats = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
    const yearKey = now.getFullYear();
    let monthCount = 0;
    let monthRevenue = 0;
    let yearRevenue = 0;
    let pending = 0;
    let confirmed = 0;
    for (const b of bookings) {
      const d = new Date(b.start_at);
      const bm = `${d.getFullYear()}-${d.getMonth()}`;
      if (bm === monthKey) monthCount++;
      if (b.status === "completed") {
        if (bm === monthKey) monthRevenue += Number(b.price ?? 0);
        if (d.getFullYear() === yearKey) yearRevenue += Number(b.price ?? 0);
      }
      if (b.status === "pending") pending++;
      if (b.status === "confirmed") confirmed++;
    }
    return { monthCount, monthRevenue, yearRevenue, pending, confirmed };
  }, [bookings]);

  const openNew = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (b: Booking) => {
    setForm({
      id: b.id,
      client_name: b.client_name,
      phone: b.phone,
      pet_type: b.pet_type ?? "",
      service: b.service ?? "",
      start_at: toLocalInput(b.start_at),
      end_at: toLocalInput(b.end_at),
      status: b.status,
      notes: b.notes ?? "",
      price: b.price != null ? String(b.price) : "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.client_name.trim() || !form.phone.trim() || !form.start_at) {
      toast({ title: "Preencha nome, telefone e data de início", variant: "destructive" });
      return;
    }
    const priceNum = form.price.trim() ? Number(form.price.replace(",", ".")) : null;
    if (priceNum != null && (isNaN(priceNum) || priceNum < 0)) {
      toast({ title: "Valor inválido", variant: "destructive" });
      return;
    }
    const payload = {
      client_name: form.client_name.trim(),
      phone: form.phone.trim(),
      pet_type: form.pet_type.trim() || null,
      service: form.service.trim() || null,
      start_at: new Date(form.start_at).toISOString(),
      end_at: form.end_at ? new Date(form.end_at).toISOString() : null,
      status: form.status,
      notes: form.notes.trim() || null,
      price: priceNum,
    };
    const res = form.id
      ? await supabase.from("bookings").update(payload).eq("id", form.id)
      : await supabase.from("bookings").insert(payload);
    if (res.error) {
      toast({ title: "Erro a guardar", description: res.error.message, variant: "destructive" });
      return;
    }
    toast({ title: form.id ? "Marcação atualizada" : "Marcação criada" });
    setOpen(false);
    load();
  };

  const setStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    setBookings((s) => s.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const remove = async (id: string) => {
    if (!confirm("Apagar esta marcação?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marcações</h1>
          <p className="text-muted-foreground text-sm">Faça a gestão dos serviços agendados.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as Status | "all")}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="confirmed">Confirmadas</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="rounded-full">
                <Plus className="w-4 h-4" /> Nova marcação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{form.id ? "Editar marcação" : "Nova marcação"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2 col-span-2">
                    <Label>Nome do cliente</Label>
                    <Input
                      value={form.client_name}
                      onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de animal</Label>
                    <Input
                      value={form.pet_type}
                      onChange={(e) => setForm({ ...form, pet_type: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Serviço</Label>
                    <Input
                      placeholder="Dog walking, Pet sitting, Hospedagem..."
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Início</Label>
                    <Input
                      type="datetime-local"
                      value={form.start_at}
                      onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fim (opcional)</Label>
                    <Input
                      type="datetime-local"
                      value={form.end_at}
                      onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Valor (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Estado</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => setForm({ ...form, status: v as Status })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
                          <SelectItem key={s} value={s}>
                            {STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Notas internas</Label>
                    <Textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={save}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Início</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="whitespace-nowrap text-sm">
                  {new Date(b.start_at).toLocaleString("pt-PT")}
                </TableCell>
                <TableCell className="font-medium">{b.client_name}</TableCell>
                <TableCell>
                  <a href={`tel:${b.phone}`} className="text-primary">
                    {b.phone}
                  </a>
                </TableCell>
                <TableCell>{b.service ?? "-"}</TableCell>
                <TableCell>
                  <Select value={b.status} onValueChange={(v) => setStatus(b.id, v as Status)}>
                    <SelectTrigger className="w-[140px] h-8">
                      <Badge variant={STATUS_VARIANT[b.status]}>{STATUS_LABEL[b.status]}</Badge>
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(b)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(b.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Sem marcações.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBookings;
