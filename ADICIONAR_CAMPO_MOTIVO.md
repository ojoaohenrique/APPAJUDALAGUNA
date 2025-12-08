# 🔧 CORREÇÃO URGENTE - Campo "Motivo da Situação de Rua"

## ⚠️ ERRO ATUAL
```
Could not find the 'motivo_situacao_rua' column of 'moradores' in the schema cache
```

## 📋 SOLUÇÃO - Execute no Supabase AGORA

### 1. Acesse o Supabase
1. Vá em: https://supabase.com/dashboard
2. Selecione seu projeto **ajudalaguna-app-web**
3. Clique em **SQL Editor** (no menu lateral esquerdo)

### 2. Cole e Execute este SQL

```sql
-- Adicionar coluna motivo_situacao_rua na tabela moradores
ALTER TABLE public.moradores 
ADD COLUMN IF NOT EXISTS motivo_situacao_rua TEXT;

-- Adicionar comentário na coluna
COMMENT ON COLUMN public.moradores.motivo_situacao_rua IS 'Motivo que levou a pessoa à situação de rua';
```

### 3. Clique em "RUN" (ou pressione Ctrl+Enter)

### 4. Verifique se funcionou
```sql
-- Verificar se a coluna foi criada
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'moradores'
  AND column_name = 'motivo_situacao_rua';
```

**Resultado esperado:** Deve retornar 1 linha mostrando a coluna `motivo_situacao_rua`

---

## ✅ Pronto!

Agora o campo está disponível no banco de dados e o código já está preparado para usá-lo.

**Próximos passos:**
1. ✅ Campo adicionado no type `Morador`
2. ⏳ Adicionar no formulário de cadastro
3. ⏳ Adicionar no formulário de edição
4. ⏳ Exibir nas páginas de visualização
5. ⏳ Incluir na exportação de dados
