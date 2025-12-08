-- Adicionar coluna motivo_situacao_rua na tabela moradores
ALTER TABLE public.moradores 
ADD COLUMN IF NOT EXISTS motivo_situacao_rua TEXT;

-- Adicionar comentário explicativo
COMMENT ON COLUMN public.moradores.motivo_situacao_rua IS 'Motivo que levou a pessoa à situação de rua';
