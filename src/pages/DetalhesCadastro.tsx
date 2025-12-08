import { AppLayout } from "@/components/layout/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, User, Calendar, MapPin, Phone, Briefcase, 
  Home, Clock, HandHelping, AlertCircle, Edit, Image as ImageIcon,
  MapPinned, FileText, Download, FileJson, X, ZoomIn
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { CriadorInfo } from "@/components/CriadorInfo";
import { exportarMoradorJSON, exportarMoradorCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

const DetalhesCadastro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null);

  // Buscar dados do morador
  const { data: morador, isLoading } = useQuery({
    queryKey: ['morador', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('moradores')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Buscar fotos adicionais
  const { data: fotosAdicionais = [] } = useQuery({
    queryKey: ['morador-fotos', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('morador_fotos')
        .select('*')
        .eq('morador_id', id)
        .order('ordem', { ascending: true });
      
      if (error) throw error;
      
      // Gerar URLs públicas para as fotos
      const fotosComUrl = data.map(foto => {
        // Se a URL já for completa, usar ela
        if (foto.foto_url && (foto.foto_url.startsWith('http://') || foto.foto_url.startsWith('https://'))) {
          return {
            ...foto,
            url: foto.foto_url
          };
        }
        
        // Caso contrário, gerar URL pública do Supabase
        const { data: { publicUrl } } = supabase.storage
          .from('morador-fotos')
          .getPublicUrl(foto.foto_url || '');
        
        return {
          ...foto,
          url: publicUrl
        };
      });
      
      return fotosComUrl;
    },
    enabled: !!id,
  });

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!morador) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Cadastro não encontrado</h3>
              <Button onClick={() => navigate('/cadastrados')} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Cadastrados
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/cadastrados')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Detalhes do Cadastro</h1>
            <p className="text-muted-foreground">
              Cadastrado em {format(new Date(morador.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
            {morador.criado_por_nome && (
              <CriadorInfo 
                criadorNome={morador.criado_por_nome}
                dataCriacao={format(new Date(morador.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                className="mt-2"
              />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                exportarMoradorJSON(morador);
                toast({
                  title: "Exportado!",
                  description: "Dados exportados em formato JSON",
                });
              }}
            >
              <FileJson className="mr-2 h-4 w-4" />
              Exportar JSON
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                exportarMoradorCSV(morador);
                toast({
                  title: "Exportado!",
                  description: "Dados exportados em formato CSV",
                });
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button onClick={() => navigate(`/editar-cadastro/${id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Cadastro
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Foto e Info Básica */}
          <div className="lg:col-span-1 space-y-6">
            {/* Foto Principal */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative group cursor-pointer" onClick={() => morador.foto_url && setFotoAmpliada(morador.foto_url)}>
                    <Avatar className="h-56 w-56 border-4 border-primary/30 shadow-2xl ring-4 ring-primary/10 transition-all group-hover:ring-primary/40">
                      <AvatarImage src={morador.foto_url || undefined} className="object-cover" />
                      <AvatarFallback className="text-6xl bg-primary/10 text-primary font-bold">
                        {getInitials(morador.nome_completo)}
                      </AvatarFallback>
                    </Avatar>
                    {morador.foto_url && (
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold mt-6 text-center leading-tight">{morador.nome_completo}</h2>
                  {morador.cpf && (
                    <div className="mt-3 bg-secondary/50 px-4 py-2 rounded-lg">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">CPF</p>
                      <p className="text-lg font-bold">{morador.cpf}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status e Badges */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Status e Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {morador.recebe_auxilio && (
                  <Badge variant="secondary" className="w-full justify-start text-base py-3 px-4">
                    <HandHelping className="h-5 w-5 mr-2" />
                    <div className="flex-1 text-left">
                      <div className="font-bold">Recebe Auxílio</div>
                      {morador.qual_auxilio && <div className="text-xs mt-0.5">{morador.qual_auxilio}</div>}
                    </div>
                  </Badge>
                )}
                {morador.possui_vicios && (
                  <Badge variant="outline" className="w-full justify-start text-base py-3 px-4">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <div className="flex-1 text-left">
                      <div className="font-bold">Possui Vícios</div>
                      {morador.quais_vicios && <div className="text-xs mt-0.5">{morador.quais_vicios}</div>}
                    </div>
                  </Badge>
                )}
                {morador.passagens_policia && (
                  <Badge variant="destructive" className="w-full justify-start text-base py-3 px-4">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-bold">Passagens Policiais</span>
                  </Badge>
                )}
                {morador.procurou_assistencia_social && (
                  <Badge variant="secondary" className="w-full justify-start text-base py-3 px-4">
                    <HandHelping className="h-5 w-5 mr-2" />
                    <div className="flex-1 text-left">
                      <div className="font-bold">Assistência Social</div>
                      {morador.qual_servico_procurou && <div className="text-xs mt-0.5">{morador.qual_servico_procurou}</div>}
                    </div>
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Informações Detalhadas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Pessoais */}
            <Card className="border-2">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-6 w-6" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                {morador.data_nascimento && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Data de Nascimento</p>
                    <p className="font-bold text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      {format(new Date(morador.data_nascimento), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                )}
                {morador.sexo && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Sexo</p>
                    <p className="font-bold text-lg capitalize">{morador.sexo}</p>
                  </div>
                )}
                {morador.nome_mae && (
                  <div className="md:col-span-2 bg-secondary/30 rounded-lg p-4 border border-secondary">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Nome da Mãe</p>
                    <p className="font-bold text-lg">{morador.nome_mae}</p>
                  </div>
                )}
                {morador.cidade_natal && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Cidade Natal</p>
                    <p className="font-bold text-lg flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      {morador.cidade_natal}
                    </p>
                  </div>
                )}
                {morador.profissao && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Profissão</p>
                    <p className="font-bold text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      {morador.profissao}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Localização da Abordagem */}
            <Card className="border-2">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPinned className="h-6 w-6" />
                  Localização da Abordagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                  <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Local da Abordagem</p>
                  <p className="font-bold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {morador.local_abordagem}
                  </p>
                </div>
                {morador.bairro && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Bairro</p>
                    <p className="font-bold text-lg">{morador.bairro}</p>
                  </div>
                )}
                {morador.rua && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Rua/Avenida</p>
                    <p className="font-bold text-lg">{morador.rua}</p>
                  </div>
                )}
                {morador.informacoes_local && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Informações do Local</p>
                    <p className="font-bold text-base leading-relaxed">{morador.informacoes_local}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Situação Social */}
            <Card className="border-2">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Clock className="h-6 w-6" />
                  Situação Social
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                {morador.tempo_situacao_rua && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Tempo em Situação de Rua</p>
                    <p className="font-bold text-lg">{morador.tempo_situacao_rua}</p>
                  </div>
                )}
                {morador.motivo_situacao_rua && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-secondary md:col-span-2">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Motivo da Situação de Rua</p>
                    <p className="font-bold text-base leading-relaxed">{morador.motivo_situacao_rua}</p>
                  </div>
                )}
                {morador.tempo_em_laguna && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Tempo em Laguna</p>
                    <p className="font-bold text-lg">{morador.tempo_em_laguna}</p>
                  </div>
                )}
                {morador.tempo_pretende_ficar && (
                  <div className="bg-secondary/30 rounded-lg p-4 border border-secondary md:col-span-2">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Tempo que Pretende Ficar</p>
                    <p className="font-bold text-lg">{morador.tempo_pretende_ficar}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Observações */}
            {(morador.observacoes || morador.observacoes_passagens || morador.abordagens_anteriores) && (
              <Card className="border-2">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="h-6 w-6" />
                    Observações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {morador.abordagens_anteriores && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-300 dark:border-blue-800 rounded-lg p-5">
                      <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wide">Abordagens Anteriores</p>
                      <p className="text-base text-blue-800 dark:text-blue-200 leading-relaxed font-medium">{morador.abordagens_anteriores}</p>
                    </div>
                  )}
                  {morador.observacoes && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800 rounded-lg p-5">
                      <p className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-3 uppercase tracking-wide">Observações Gerais</p>
                      <p className="text-base text-amber-800 dark:text-amber-200 leading-relaxed font-medium">{morador.observacoes}</p>
                    </div>
                  )}
                  {morador.observacoes_passagens && (
                    <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-800 rounded-lg p-5">
                      <p className="text-sm font-bold text-red-900 dark:text-red-100 mb-3 uppercase tracking-wide">Observações sobre Passagens Policiais</p>
                      <p className="text-base text-red-800 dark:text-red-200 leading-relaxed font-medium">{morador.observacoes_passagens}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Fotos Adicionais */}
            {fotosAdicionais.length > 0 && (
              <Card className="border-2">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ImageIcon className="h-6 w-6" />
                    Fotos Adicionais ({fotosAdicionais.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {fotosAdicionais.map((foto) => (
                      <div key={foto.id} className="relative group">
                        <div 
                          className="relative overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer"
                          onClick={() => setFotoAmpliada(foto.url)}
                        >
                          <img
                            src={foto.url}
                            alt={foto.descricao || 'Foto adicional'}
                            className="w-full h-40 object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        {foto.descricao && (
                          <p className="text-sm text-muted-foreground mt-2 font-medium truncate">{foto.descricao}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Modal de Foto Ampliada */}
        {fotoAmpliada && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setFotoAmpliada(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setFotoAmpliada(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={fotoAmpliada}
              alt="Foto ampliada"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DetalhesCadastro;
