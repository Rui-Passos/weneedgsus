import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { toast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

type Status = "pending" | "confirmed" | "completed" | "cancelled" | "all";

interface Booking {
  id: string;
  client_name: string;
  service: string | null;
  pet_type: string | null;
  start_at: string;
  status: Exclude<Status, "all">;
  price: number | null;
}

const STATUS_LABEL: Record<Exclude<Status, "all">, string> = {
  pending: "Pendente",
  confirmed: "Confirmada",
  completed: "Concluída",
  cancelled: "Cancelada",
};

const fmtEuro = (n: number) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--muted-foreground))", "hsl(var(--destructive))"];

const todayInput = () => new Date().toISOString().slice(0, 10);
const monthAgoInput = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
};

const AdminReports = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [from, setFrom] = useState(monthAgoInput());
  const [to, setTo] = useState(todayInput());
  const [status, setStatus] = useState<Status>("all");
  const [service, setService] = useState<string>("all");
  const [petType, setPetType] = useState<string>("all");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, client_name, service, pet_type, start_at, status, price")
        .order("start_at", { ascending: false });
      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        return;
      }
      setBookings((data as Booking[]) ?? []);
    })();
  }, []);

  const services = useMemo(
    () => Array.from(new Set(bookings.map((b) => b.service).filter((s): s is string => !!s))).sort(),
    [bookings],
  );
  const petTypes = useMemo(
    () => Array.from(new Set(bookings.map((b) => b.pet_type).filter((s): s is string => !!s))).sort(),
    [bookings],
  );

  const filtered = useMemo(() => {
    const fromTs = from ? new Date(from + "T00:00:00").getTime() : -Infinity;
    const toTs = to ? new Date(to + "T23:59:59").getTime() : Infinity;
    return bookings.filter((b) => {
      const t = new Date(b.start_at).getTime();
      if (t < fromTs || t > toTs) return false;
      if (status !== "all" && b.status !== status) return false;
      if (service !== "all" && b.service !== service) return false;
      if (petType !== "all" && b.pet_type !== petType) return false;
      return true;
    });
  }, [bookings, from, to, status, service, petType]);

  const kpis = useMemo(() => {
    const count = filtered.length;
    const revenue = filtered.reduce((acc, b) => acc + Number(b.price ?? 0), 0);
    const withPrice = filtered.filter((b) => b.price != null).length;
    const avg = withPrice ? revenue / withPrice : 0;
    return { count, revenue, avg };
  }, [filtered]);

  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of filtered) {
      const d = new Date(b.start_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) ?? 0) + Number(b.price ?? 0));
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total: Number(total.toFixed(2)) }));
  }, [filtered]);

  const byService = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of filtered) {
      const key = b.service ?? "Sem serviço";
      map.set(key, (map.get(key) ?? 0) + Number(b.price ?? 0));
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));
  }, [filtered]);

  const exportPdf = async () => {
    setExporting(true);
    try {
      const [{ default: jsPDF }, autoTableMod, html2canvasMod] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
        import("html2canvas"),
      ]);
      const autoTable = (autoTableMod as any).default ?? autoTableMod;
      const html2canvas = (html2canvasMod as any).default ?? html2canvasMod;

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      let y = margin;

      doc.setFontSize(18);
      doc.text("Relatório de Marcações", margin, y);
      y += 22;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Período: ${from || "—"} a ${to || "—"}`, margin, y);
      y += 14;
      const filtersTxt = [
        status !== "all" ? `Estado: ${STATUS_LABEL[status as Exclude<Status, "all">]}` : null,
        service !== "all" ? `Serviço: ${service}` : null,
        petType !== "all" ? `Animal: ${petType}` : null,
      ].filter(Boolean).join(" · ");
      if (filtersTxt) { doc.text(`Filtros: ${filtersTxt}`, margin, y); y += 14; }
      doc.text(`Gerado em ${new Date().toLocaleString("pt-PT")}`, margin, y);
      y += 20;
      doc.setTextColor(0);

      doc.setFontSize(12);
      doc.text(`Marcações: ${kpis.count}`, margin, y);
      doc.text(`Total faturado: ${fmtEuro(kpis.revenue)}`, margin + 180, y);
      doc.text(`Ticket médio: ${fmtEuro(kpis.avg)}`, margin + 380, y);
      y += 24;

      const charts = document.getElementById("reports-charts");
      if (charts) {
        const canvas = await html2canvas(charts, { backgroundColor: "#ffffff", scale: 2 });
        const img = canvas.toDataURL("image/png");
        const w = pageWidth - margin * 2;
        const h = (canvas.height * w) / canvas.width;
        if (y + h > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); y = margin; }
        doc.addImage(img, "PNG", margin, y, w, h);
        y += h + 20;
      }

      autoTable(doc, {
        startY: y,
        head: [["Data", "Cliente", "Serviço", "Estado", "Valor"]],
        body: filtered.map((b) => [
          new Date(b.start_at).toLocaleDateString("pt-PT"),
          b.client_name,
          b.service ?? "—",
          STATUS_LABEL[b.status],
          b.price != null ? fmtEuro(Number(b.price)) : "—",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [60, 60, 60] },
        margin: { left: margin, right: margin },
      });

      doc.save(`relatorio-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      toast({ title: "Erro a gerar PDF", description: (e as Error).message, variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground text-sm">Analise faturação e atividade por período.</p>
        </div>
        <Button onClick={exportPdf} disabled={exporting} className="rounded-full">
          <Download className="w-4 h-4" /> {exporting ? "A gerar..." : "Exportar PDF"}
        </Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-4 grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">De</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Até</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Estado</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {(Object.keys(STATUS_LABEL) as Array<Exclude<Status, "all">>).map((s) => (
                <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Serviço</Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Tipo de animal</Label>
          <Select value={petType} onValueChange={setPetType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {petTypes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl shadow-card p-4">
          <p className="text-xs text-muted-foreground">Marcações</p>
          <p className="text-2xl font-bold mt-1">{kpis.count}</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-4">
          <p className="text-xs text-muted-foreground">Total faturado</p>
          <p className="text-2xl font-bold mt-1">{fmtEuro(kpis.revenue)}</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-4">
          <p className="text-xs text-muted-foreground">Ticket médio</p>
          <p className="text-2xl font-bold mt-1">{fmtEuro(kpis.avg)}</p>
        </div>
      </div>

      <div id="reports-charts" className="grid grid-cols-1 lg:grid-cols-2 gap-3 bg-background">
        <div className="bg-card rounded-2xl shadow-card p-4">
          <h3 className="font-semibold mb-3">Faturação por mês</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => fmtEuro(v)} />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-4">
          <h3 className="font-semibold mb-3">Faturação por serviço</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byService} dataKey="value" nameKey="name" outerRadius={90} label>
                  {byService.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmtEuro(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="text-sm whitespace-nowrap">{new Date(b.start_at).toLocaleDateString("pt-PT")}</TableCell>
                <TableCell className="font-medium">{b.client_name}</TableCell>
                <TableCell>{b.service ?? "—"}</TableCell>
                <TableCell>{STATUS_LABEL[b.status]}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {b.price != null ? fmtEuro(Number(b.price)) : "—"}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Sem marcações no período/filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminReports;
