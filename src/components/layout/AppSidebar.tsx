import { Home, List, UserPlus, LogOut, Shield, BarChart3 } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const items = [
  { title: "Painel Geral", url: "/", icon: Home },
  { title: "Cadastrados", url: "/cadastrados", icon: List },
  { title: "Novo Cadastro", url: "/novo-cadastro", icon: UserPlus },
  { title: "Dados", url: "/dados", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const collapsed = state === "collapsed";

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/auth");
  };

  const isActive = (path: string) => location.pathname === path;

  const getNavClass = (active: boolean) =>
    active
      ? "bg-primary text-primary-foreground font-semibold"
      : "hover:bg-secondary";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
    >
      <div className={`flex items-center gap-3 px-4 ${collapsed ? 'justify-center' : ''} mb-6 mt-4`}>
        <Shield className="h-8 w-8 text-primary" />
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold">Guarda Municipal</h2>
            <p className="text-xs text-muted-foreground">Laguna</p>
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) => getNavClass(isActive)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pb-20">
        {!collapsed && profile && (
          <div className="mb-3 p-3 bg-secondary rounded-lg">
            <p className="text-sm font-medium">{profile.nome_completo}</p>
            <p className="text-xs text-muted-foreground">Guarda Municipal</p>
          </div>
        )}
        <Button
          variant="destructive"
          size={collapsed ? "icon" : "default"}
          onClick={handleLogout}
          className="w-full"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
