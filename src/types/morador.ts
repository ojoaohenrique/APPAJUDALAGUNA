export type SexoType = 'masculino' | 'feminino' | 'outro';
export type StatusSincronizacao = 'offline' | 'enviado';

export interface Morador {
  id: string;
  user_id: string;
  
  // Informações pessoais
  nome_completo: string;
  cpf?: string;
  data_nascimento?: string;
  nome_mae?: string;
  sexo?: SexoType;
  cidade_natal?: string;
  profissao?: string;
  
  // Situação social
  recebe_auxilio: boolean;
  qual_auxilio?: string;
  tempo_situacao_rua?: string;
  motivo_situacao_rua?: string;
  tempo_em_laguna?: string;
  tempo_pretende_ficar?: string;
  procurou_assistencia_social: boolean;
  qual_servico_procurou?: string;
  
  // Localização da abordagem
  local_abordagem: string;
  latitude?: number;
  longitude?: number;
  bairro?: string;
  rua?: string;
  informacoes_local?: string;
  
  // Informações adicionais
  possui_vicios: boolean;
  quais_vicios?: string;
  passagens_policia: boolean;
  observacoes_passagens?: string;
  abordagens_anteriores?: string;
  
  // Foto
  foto_url?: string;
  
  // Observações gerais
  observacoes?: string;
  
  // Status de sincronização
  status_sincronizacao: StatusSincronizacao;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Informações de auditoria
  criado_por_nome?: string;
}
