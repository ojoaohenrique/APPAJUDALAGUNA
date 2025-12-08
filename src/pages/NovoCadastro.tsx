import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Camera, Upload, MapPin, User, FileText, MapPinned, Loader2, X, Image } from "lucide-react";
import { CriadorInfo } from "@/components/CriadorInfo";
import { CameraModal } from "@/components/CameraModal";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { z } from "zod";

const NovoCadastro = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { permissions, loading: permissionsLoading, userEmail, userId } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const isEditMode = !!id;
  
  // Informações do criador (para modo visualização)
  const [criadorNome, setCriadorNome] = useState("");
  const [dataCriacao, setDataCriacao] = useState("");

  // Informações pessoais
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date>();
  const [dataNascimentoInput, setDataNascimentoInput] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [sexo, setSexo] = useState("");
  const [cidadeNatal, setCidadeNatal] = useState("");
  const [profissao, setProfissao] = useState("");

  // Situação social
  const [recebeAuxilio, setRecebeAuxilio] = useState(false);
  const [qualAuxilio, setQualAuxilio] = useState("");
  const [tempoSituacaoRua, setTempoSituacaoRua] = useState("");
  const [motivoSituacaoRua, setMotivoSituacaoRua] = useState("");
  const [tempoEmLaguna, setTempoEmLaguna] = useState("");
  const [tempoPretendeFicar, setTempoPretendeFicar] = useState("");
  const [procurouAssistencia, setProcurouAssistencia] = useState(false);
  const [qualServico, setQualServico] = useState("");

  // Localização
  const [localAbordagem, setLocalAbordagem] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [informacoesLocal, setInformacoesLocal] = useState("");

  // Informações adicionais
  const [possuiVicios, setPossuiVicios] = useState(false);
  const [quaisVicios, setQuaisVicios] = useState("");
  const [passagensPolicia, setPassagensPolicia] = useState(false);
  const [observacoesPassagens, setObservacoesPassagens] = useState("");
  const [abordagensAnteriores, setAbordagensAnteriores] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Foto principal (identificação)
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  
  // Fotos adicionais
  const [fotosAdicionais, setFotosAdicionais] = useState<File[]>([]);
  const [fotosAdicionaisPreview, setFotosAdicionaisPreview] = useState<string[]>([]);
  const [fotosAdicionaisExistentes, setFotosAdicionaisExistentes] = useState<Array<{id: string, url: string, descricao?: string}>>([]);

  // Estados para modais de câmera
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraModalAdicionalOpen, setCameraModalAdicionalOpen] = useState(false);

  // Funções de máscara
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');
    }
    return value;
  };

  const handleDataNascimentoChange = (value: string) => {
    const formatted = formatDate(value);
    setDataNascimentoInput(formatted);
    
    // Tentar parsear a data se estiver completa
    if (formatted.length === 10) {
      try {
        const parsedDate = parse(formatted, "dd/MM/yyyy", new Date());
        if (!isNaN(parsedDate.getTime())) {
          setDataNascimento(parsedDate);
        }
      } catch (error) {
        // Ignorar erro de parsing
      }
    }
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(10))) return false;
    
    return true;
  };

  // Buscar dados do morador se estiver em modo de edição
  useEffect(() => {
    if (isEditMode && id) {
      setLoadingData(true);
      const fetchMorador = async () => {
        try {
          const { data, error } = await supabase
            .from('moradores')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          if (data) {
            setNomeCompleto(data.nome_completo || "");
            setCpf(data.cpf || "");
            if (data.data_nascimento) {
              const date = new Date(data.data_nascimento);
              setDataNascimento(date);
              setDataNascimentoInput(format(date, "dd/MM/yyyy"));
            }
            setNomeMae(data.nome_mae || "");
            setSexo(data.sexo || "");
            setCidadeNatal(data.cidade_natal || "");
            setProfissao(data.profissao || "");
            setRecebeAuxilio(data.recebe_auxilio || false);
            setQualAuxilio(data.qual_auxilio || "");
            setTempoSituacaoRua(data.tempo_situacao_rua || "");
            setMotivoSituacaoRua(data.motivo_situacao_rua || "");
            setTempoEmLaguna(data.tempo_em_laguna || "");
            setTempoPretendeFicar(data.tempo_pretende_ficar || "");
            setProcurouAssistencia(data.procurou_assistencia_social || false);
            setQualServico(data.qual_servico_procurou || "");
            setLocalAbordagem(data.local_abordagem || "");
            setBairro(data.bairro || "");
            setRua(data.rua || "");
            setInformacoesLocal(data.informacoes_local || "");
            setPossuiVicios(data.possui_vicios || false);
            
            // Carregar informações do criador
            setCriadorNome(data.criado_por_nome || "");
            if (data.created_at) {
              setDataCriacao(format(new Date(data.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }));
            }
            setQuaisVicios(data.quais_vicios || "");
            setPassagensPolicia(data.passagens_policia || false);
            setObservacoesPassagens(data.observacoes_passagens || "");
            setAbordagensAnteriores(data.abordagens_anteriores || "");
            setObservacoes(data.observacoes || "");
            if (data.foto_url) {
              setFotoPreview(data.foto_url);
            }
          }

          // Buscar fotos adicionais
          const { data: fotosData, error: fotosError } = await supabase
            .from('morador_fotos')
            .select('*')
            .eq('morador_id', id)
            .order('ordem', { ascending: true });

          if (!fotosError && fotosData) {
            setFotosAdicionaisExistentes(fotosData.map(f => ({
              id: f.id,
              url: f.foto_url,
              descricao: f.descricao || undefined
            })));
          }
        } catch (error: any) {
          toast({
            title: "Erro ao carregar dados",
            description: error.message,
            variant: "destructive",
          });
          navigate("/cadastrados");
        } finally {
          setLoadingData(false);
        }
      };

      fetchMorador();
    }
  }, [id, isEditMode, navigate, toast]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturarFotoPrincipal = () => {
    setCameraModalOpen(true);
  };

  const handleCaptureFotoPrincipal = (file: File) => {
    setFoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const capturarFotoAdicional = () => {
    const MAX_FOTOS = 15;
    const totalAtual = fotosAdicionaisExistentes.length + fotosAdicionais.length;
    
    if (totalAtual >= MAX_FOTOS) {
      toast({
        title: "Limite atingido",
        description: "Você já adicionou o máximo de 15 fotos.",
        variant: "destructive",
      });
      return;
    }
    
    setCameraModalAdicionalOpen(true);
  };

  const handleCaptureFotoAdicional = (file: File) => {
    setFotosAdicionais(prev => [...prev, file]);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotosAdicionaisPreview(prev => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const handleFotosAdicionaisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const MAX_FOTOS = 15;
    const totalAtual = fotosAdicionaisExistentes.length + fotosAdicionais.length;
    const espacoDisponivel = MAX_FOTOS - totalAtual;
    
    if (files.length > 0) {
      // Verificar limite
      if (totalAtual >= MAX_FOTOS) {
        toast({
          title: "Limite atingido",
          description: `Você já adicionou o máximo de ${MAX_FOTOS} fotos adicionais`,
          variant: "destructive",
        });
        return;
      }
      
      // Limitar quantidade de fotos a adicionar
      const fotosParaAdicionar = files.slice(0, espacoDisponivel);
      
      if (files.length > espacoDisponivel) {
        toast({
          title: "Limite de fotos",
          description: `Apenas ${espacoDisponivel} foto(s) foram adicionadas. Limite máximo: ${MAX_FOTOS} fotos`,
        });
      }
      
      setFotosAdicionais(prev => [...prev, ...fotosParaAdicionar]);
      
      // Criar previews
      fotosParaAdicionar.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFotosAdicionaisPreview(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    
    // Limpar o input para permitir selecionar as mesmas fotos novamente
    e.target.value = '';
  };

  const removerFotoAdicional = (index: number) => {
    setFotosAdicionais(prev => prev.filter((_, i) => i !== index));
    setFotosAdicionaisPreview(prev => prev.filter((_, i) => i !== index));
  };

  const removerFotoExistente = async (fotoId: string) => {
    try {
      const { error } = await supabase
        .from('morador_fotos')
        .delete()
        .eq('id', fotoId);

      if (error) throw error;

      setFotosAdicionaisExistentes(prev => prev.filter(f => f.id !== fotoId));
      
      toast({
        title: "Foto removida",
        description: "Foto adicional removida com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover foto",
        description: error.message,
        variant: "destructive",
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!nomeCompleto || !localAbordagem) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome completo e local da abordagem",
        variant: "destructive",
      });
      return;
    }

    // Validação de CPF se preenchido
    if (cpf && !validateCPF(cpf)) {
      toast({
        title: "CPF inválido",
        description: "Por favor, verifique o CPF informado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("🔍 Iniciando processo de salvamento...");
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log("👤 Usuário:", user?.id, "Erro:", userError);
      
      if (!user) throw new Error("Usuário não autenticado");

      let fotoUrl = null;

      // Upload da foto se existir
      if (foto) {
        console.log("📸 Fazendo upload da foto...");
        const fileExt = foto.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('morador-fotos')
          .upload(fileName, foto);

        if (uploadError) {
          console.error("❌ Erro no upload da foto:", uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('morador-fotos')
          .getPublicUrl(fileName);

        fotoUrl = publicUrl;
        console.log("✅ Foto enviada:", fotoUrl);
      }

      // Preparar dados do morador
      const moradorData = {
        user_id: user.id,
        nome_completo: nomeCompleto,
        cpf: cpf || null,
        data_nascimento: dataNascimento ? format(dataNascimento, 'yyyy-MM-dd') : null,
        nome_mae: nomeMae || null,
        sexo: (sexo || null) as 'masculino' | 'feminino' | 'outro' | null,
        cidade_natal: cidadeNatal || null,
        profissao: profissao || null,
        recebe_auxilio: recebeAuxilio,
        qual_auxilio: qualAuxilio || null,
        tempo_situacao_rua: tempoSituacaoRua || null,
        motivo_situacao_rua: motivoSituacaoRua || null,
        tempo_em_laguna: tempoEmLaguna || null,
        tempo_pretende_ficar: tempoPretendeFicar || null,
        procurou_assistencia_social: procurouAssistencia,
        qual_servico_procurou: qualServico || null,
        local_abordagem: localAbordagem,
        bairro: bairro || null,
        rua: rua || null,
        informacoes_local: informacoesLocal || null,
        possui_vicios: possuiVicios,
        quais_vicios: quaisVicios || null,
        passagens_policia: passagensPolicia,
        observacoes_passagens: observacoesPassagens || null,
        abordagens_anteriores: abordagensAnteriores || null,
        foto_url: fotoUrl || (isEditMode && fotoPreview ? fotoPreview : null),
        observacoes: observacoes || null,
        status_sincronizacao: 'enviado',
        // Rastreamento de autoria (apenas para novos registros)
        ...(isEditMode ? {} : {
          criado_por_id: userId,
          criado_por_nome: userEmail,
        }),
      };

      console.log("📝 Dados preparados:", moradorData);

      // Inserir ou atualizar morador
      let result;
      if (isEditMode && id) {
        console.log("🔄 Atualizando morador ID:", id);
        result = await supabase
          .from('moradores')
          .update(moradorData)
          .eq('id', id)
          .select();
        console.log("📊 Resultado da atualização:", result);
      } else {
        console.log("➕ Inserindo novo morador...");
        result = await supabase
          .from('moradores')
          .insert([moradorData])
          .select();
        console.log("📊 Resultado da inserção:", result);
      }

      if (result.error) {
        console.error("❌ Erro do Supabase:", result.error);
        throw result.error;
      }

      const moradorId = isEditMode ? id : result.data[0]?.id;

      // Upload de fotos adicionais
      if (fotosAdicionais.length > 0 && moradorId) {
        console.log("📸 Fazendo upload de fotos adicionais...");
        
        for (let i = 0; i < fotosAdicionais.length; i++) {
          const fotoFile = fotosAdicionais[i];
          const fileExt = fotoFile.name.split('.').pop();
          const fileName = `${user.id}-${moradorId}-${Date.now()}-${i}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('morador-fotos')
            .upload(fileName, fotoFile);

          if (uploadError) {
            console.error("❌ Erro no upload da foto adicional:", uploadError);
            continue; // Continua com as próximas fotos mesmo se uma falhar
          }

          const { data: { publicUrl } } = supabase.storage
            .from('morador-fotos')
            .getPublicUrl(fileName);

          // Salvar referência no banco
          const { error: dbError } = await supabase
            .from('morador_fotos')
            .insert({
              morador_id: moradorId,
              foto_url: publicUrl,
              ordem: fotosAdicionaisExistentes.length + i
            });

          if (dbError) {
            console.error("❌ Erro ao salvar referência da foto:", dbError);
          } else {
            console.log("✅ Foto adicional salva:", publicUrl);
          }
        }
      }

      console.log("✅ Cadastro salvo com sucesso!");

      toast({
        title: isEditMode ? "Cadastro atualizado!" : "Cadastro realizado!",
        description: isEditMode ? "Alterações salvas com sucesso" : "Morador cadastrado com sucesso",
      });

      navigate("/cadastrados");
    } catch (error: any) {
      console.error("❌ Erro completo:", error);
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Erro desconhecido ao salvar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{isEditMode ? "Editar Cadastro" : "Novo Cadastro"}</h1>
            <p className="text-muted-foreground">
              {isEditMode ? "Atualizar informações do morador" : "Cadastrar novo morador em situação de rua"}
            </p>
            {isEditMode && criadorNome && (
              <CriadorInfo 
                criadorNome={criadorNome} 
                dataCriacao={dataCriacao}
                className="mt-2"
              />
            )}
            {permissions?.isReadOnly && (
              <div className="mt-2 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-md">
                <span className="font-medium">Modo Visualização</span>
                <span>Você não tem permissão para editar</span>
              </div>
            )}
          </div>
          <img 
            src="/logo-guarda.png" 
            alt="Logo Guarda Municipal" 
            className="h-24 w-24 object-contain"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto Principal de Identificação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Foto Principal de Identificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fotoPreview && (
                <div className="flex justify-center">
                  <img
                    src={fotoPreview}
                    alt="Preview"
                    className="h-48 w-48 object-cover rounded-lg border-2 border-border"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-secondary transition"
                  onClick={capturarFotoPrincipal}
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-sm">Tirar Foto</span>
                </Button>
                
                <Label htmlFor="foto-upload" className="cursor-pointer">
                  <div className="h-full flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:bg-secondary transition">
                    <Upload className="h-5 w-5" />
                    <span className="text-sm">Escolher Arquivo</span>
                  </div>
                  <Input
                    id="foto-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFotoChange}
                  />
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    value={dataNascimentoInput}
                    onChange={(e) => handleDataNascimentoChange(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select value={sexo} onValueChange={setSexo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeMae">Nome da Mãe</Label>
                  <Input
                    id="nomeMae"
                    value={nomeMae}
                    onChange={(e) => setNomeMae(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidadeNatal">Cidade Natal</Label>
                  <Input
                    id="cidadeNatal"
                    value={cidadeNatal}
                    onChange={(e) => setCidadeNatal(e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input
                    id="profissao"
                    value={profissao}
                    onChange={(e) => setProfissao(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Situação Social */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Situação Social
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="recebeAuxilio">Recebe auxílio do governo?</Label>
                <Switch
                  id="recebeAuxilio"
                  checked={recebeAuxilio}
                  onCheckedChange={setRecebeAuxilio}
                />
              </div>

              {recebeAuxilio && (
                <div className="space-y-2">
                  <Label htmlFor="qualAuxilio">Qual auxílio?</Label>
                  <Input
                    id="qualAuxilio"
                    value={qualAuxilio}
                    onChange={(e) => setQualAuxilio(e.target.value)}
                    placeholder="Ex: Bolsa Família, BPC..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="tempoRua">Tempo em situação de rua</Label>
                <Input
                  id="tempoRua"
                  value={tempoSituacaoRua}
                  onChange={(e) => setTempoSituacaoRua(e.target.value)}
                  placeholder="Ex: 6 meses"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivoRua">Motivo da situação de rua</Label>
                <Textarea
                  id="motivoRua"
                  value={motivoSituacaoRua}
                  onChange={(e) => setMotivoSituacaoRua(e.target.value)}
                  placeholder="Descreva o motivo pelo qual a pessoa está em situação de rua..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tempoLaguna">Tempo em Laguna</Label>
                  <Input
                    id="tempoLaguna"
                    value={tempoEmLaguna}
                    onChange={(e) => setTempoEmLaguna(e.target.value)}
                    placeholder="Ex: 2 anos"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempoFicar">Tempo que pretende ficar</Label>
                  <Input
                    id="tempoFicar"
                    value={tempoPretendeFicar}
                    onChange={(e) => setTempoPretendeFicar(e.target.value)}
                    placeholder="Ex: 1 ano"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="procurouAssistencia">Já procurou assistência social?</Label>
                <Switch
                  id="procurouAssistencia"
                  checked={procurouAssistencia}
                  onCheckedChange={setProcurouAssistencia}
                />
              </div>

              {procurouAssistencia && (
                <div className="space-y-2">
                  <Label htmlFor="qualServico">Qual serviço procurou?</Label>
                  <Input
                    id="qualServico"
                    value={qualServico}
                    onChange={(e) => setQualServico(e.target.value)}
                    placeholder="Ex: CRAS, CREAS..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinned className="h-5 w-5" />
                Localização da Abordagem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="local">Local da Abordagem *</Label>
                <Input
                  id="local"
                  value={localAbordagem}
                  onChange={(e) => setLocalAbordagem(e.target.value)}
                  placeholder="Ex: Praça Vidal Ramos, Centro"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Ex: Centro, Mar Grosso..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rua">Rua/Avenida</Label>
                  <Input
                    id="rua"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    placeholder="Ex: Rua Raulino Horn"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="informacoesLocal">Informações do Local</Label>
                <Textarea
                  id="informacoesLocal"
                  value={informacoesLocal}
                  onChange={(e) => setInformacoesLocal(e.target.value)}
                  placeholder="Descreva características do local, pontos de referência, condições do ambiente..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="vicios">Possui vícios?</Label>
                <Switch
                  id="vicios"
                  checked={possuiVicios}
                  onCheckedChange={setPossuiVicios}
                />
              </div>

              {possuiVicios && (
                <div className="space-y-2">
                  <Label htmlFor="quaisVicios">Quais vícios?</Label>
                  <Input
                    id="quaisVicios"
                    value={quaisVicios}
                    onChange={(e) => setQuaisVicios(e.target.value)}
                    placeholder="Ex: Álcool, Tabaco, Drogas..."
                  />
                </div>
              )}

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="passagens">Passagens pela polícia?</Label>
                <Switch
                  id="passagens"
                  checked={passagensPolicia}
                  onCheckedChange={setPassagensPolicia}
                />
              </div>

              {passagensPolicia && (
                <div className="space-y-2">
                  <Label htmlFor="obsPassagens">Observações sobre passagens</Label>
                  <Textarea
                    id="obsPassagens"
                    value={observacoesPassagens}
                    onChange={(e) => setObservacoesPassagens(e.target.value)}
                    placeholder="Detalhes..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="abordagensAnteriores">Abordagens Anteriores</Label>
                <Textarea
                  id="abordagensAnteriores"
                  value={abordagensAnteriores}
                  onChange={(e) => setAbordagensAnteriores(e.target.value)}
                  placeholder="Registre se este indivíduo já foi abordado anteriormente (datas, locais, observações)..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Use este campo para registrar quando os guardas abordarem o mesmo indivíduo mais de uma vez
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Gerais</Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Informações adicionais relevantes..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Fotos Adicionais (Opcional) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Fotos Adicionais
                <span className="text-sm font-normal text-muted-foreground ml-2">(Opcional - até 15 fotos)</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Adicione até 15 fotos complementares como documentos, situação do local, contexto da abordagem, etc.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Fotos existentes (modo edição) */}
              {fotosAdicionaisExistentes.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Fotos já cadastradas</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {fotosAdicionaisExistentes.map((foto) => (
                      <div key={foto.id} className="relative group">
                        <img
                          src={foto.url}
                          alt="Foto adicional"
                          className="w-full h-32 object-cover rounded-lg border-2 border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition"
                          onClick={() => removerFotoExistente(foto.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previews de novas fotos */}
              {fotosAdicionaisPreview.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Novas fotos a serem enviadas</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {fotosAdicionaisPreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition"
                          onClick={() => removerFotoAdicional(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botões para adicionar fotos */}
              {(fotosAdicionaisExistentes.length + fotosAdicionaisPreview.length) < 15 ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-secondary transition"
                    onClick={capturarFotoAdicional}
                  >
                    <Camera className="h-5 w-5" />
                    <span className="text-sm font-medium">Tirar Foto</span>
                  </Button>
                  
                  <Label htmlFor="fotos-adicionais-upload" className="cursor-pointer">
                    <div className="h-full flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:bg-secondary transition">
                      <Upload className="h-5 w-5" />
                      <span className="text-sm font-medium">Escolher Arquivos</span>
                    </div>
                    <Input
                      id="fotos-adicionais-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFotosAdicionaisChange}
                    />
                  </Label>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-muted rounded-lg bg-muted/50">
                  <span className="font-medium text-muted-foreground">
                    Limite de 15 fotos atingido
                  </span>
                </div>
              )}

              {/* Contador de fotos */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <p className="text-muted-foreground">
                  Total: {fotosAdicionaisExistentes.length + fotosAdicionaisPreview.length} / 15 foto(s)
                </p>
                {(fotosAdicionaisExistentes.length + fotosAdicionaisPreview.length) >= 15 && (
                  <span className="text-xs text-orange-500 font-medium">
                    (Limite máximo)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-4 pb-20">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/cadastrados")}
            >
              {permissions?.isReadOnly ? "Voltar" : "Cancelar"}
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={loading || permissions?.isReadOnly}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                isEditMode ? "Salvar Alterações" : "Salvar Cadastro"
              )}
            </Button>
          </div>
        </form>

        {/* Modais de Câmera */}
        <CameraModal
          isOpen={cameraModalOpen}
          onClose={() => setCameraModalOpen(false)}
          onCapture={handleCaptureFotoPrincipal}
          facingMode="user"
          title="Foto Principal de Identificação"
        />

        <CameraModal
          isOpen={cameraModalAdicionalOpen}
          onClose={() => setCameraModalAdicionalOpen(false)}
          onCapture={handleCaptureFotoAdicional}
          facingMode="environment"
          title="Foto Adicional"
        />
      </div>
    </AppLayout>
  );
};

export default NovoCadastro;
