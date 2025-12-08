-- Adicionar campo para registrar abordagens anteriores
-- Este campo permite registrar quando os guardas abordarem o mesmo indivíduo mais de uma vez

ALTER TABLE public.moradores 
ADD COLUMN abordagens_anteriores TEXT;

COMMENT ON COLUMN public.moradores.abordagens_anteriores IS 'Registra informações sobre abordagens anteriores do mesmo indivíduo (datas, locais, observações)';
