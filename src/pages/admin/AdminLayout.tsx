import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Image, FileText, MessageSquare, LogOut, PawPrint, Home, User, Calendar } from "lucide-react";

const items = [
  { title: "Marcações", url: "/admin/bookings", icon: Calendar },
  { title: "Galeria", url: "/admin/gallery", icon: Image },
  { title: "Conteúdos", url: "/admin/content", icon: FileText },
  { title: "Mensagens", url: "/admin/messages", icon: MessageSquare },
  { title: "Conta", url: "/admin/account", icon: User },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, adminError, signOut } = useAuth();
  const { pathname } = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center">A carregar...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <PawPrint className="w-12 h-12 text-primary" />
        <h1 className="text-2xl font-bold">Sem acesso</h1>
        {adminError ? (
          <p className="text-muted-foreground max-w-md">
            Não foi possível verificar as suas permissões: {adminError}. Tente recarregar a página.
          </p>
        ) : (
          <p className="text-muted-foreground max-w-md">
            A sua conta ({user.email}) ainda não tem permissões de administrador. Contacte o responsável pelo site.
          </p>
        )}
        <Button onClick={signOut} variant="outline" className="rounded-full">Terminar sessão</Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="p-4 flex items-center gap-2 font-bold">
              <span className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-primary-foreground" />
              </span>
              <span>Admin</span>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Gestão</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <NavLink to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/"><Home className="h-4 w-4" /><span>Ver site</span></NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={signOut}>
                      <LogOut className="h-4 w-4" /><span>Sair</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-4 gap-2">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </header>
          <main className="flex-1 p-6"><Outlet /></main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
