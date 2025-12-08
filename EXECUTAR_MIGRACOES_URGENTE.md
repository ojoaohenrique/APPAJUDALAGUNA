# 🚨 EXECUTAR MIGRAÇÕES NO SUPABASE - URGENTE

## ❌ Erro Atual:
```
Could not find the 'abordagens_anteriores' column of 'moradores' 
in the schema cache
```

## 🔧 Solução: Executar Migrações SQL

Você precisa executar as migrações SQL no Supabase para adicionar as colunas que faltam.

---

## 📋 Passo a Passo

### **1. Acessar o Supabase**
1. Abra: https://supabase.com/dashboard
2. Faça login
3. Selecione seu projeto

### **2. Abrir SQL Editor**
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

### **3. Executar Migração 1: Abordagens Anteriores**

Copie e cole este SQL:

```sql
-- Adicionar campo para registrar abordagens anteriores
ALTER TABLE public.moradores 
ADD COLUMN IF NOT EXISTS abordagens_anteriores TEXT;

COMMENT ON COLUMN public.moradores.abordagens_anteriores IS 'Registra informações sobre abordagens anteriores do mesmo indivíduo (datas, locais, observações)';
```

Clique em **"RUN"** (ou pressione Ctrl+Enter)

### **4. Executar Migração 2: Motivo Situação de Rua**

Cole este SQL:

```sql
-- Adicionar campo para motivo da situação de rua
ALTER TABLE public.moradores 
ADD COLUMN IF NOT EXISTS motivo_situacao_rua TEXT;

COMMENT ON COLUMN public.moradores.motivo_situacao_rua IS 'Motivo pelo qual a pessoa está em situação de rua';
```

Clique em **"RUN"**

### **5. Executar Migração 3: Campos de Localização**

Cole este SQL:

```sql
-- Adicionar campos de localização detalhada
ALTER TABLE public.moradores 
ADD COLUMN IF NOT EXISTS bairro TEXT,
ADD COLUMN IF NOT EXISTS rua TEXT,
ADD COLUMN IF NOT EXISTS informacoes_local TEXT;

COMMENT ON COLUMN public.moradores.bairro IS 'Bairro onde a pessoa foi abordada';
COMMENT ON COLUMN public.moradores.rua IS 'Rua onde a pessoa foi abordada';
COMMENT ON COLUMN public.moradores.informacoes_local IS 'Informações adicionais sobre o local da abordagem';
```

Clique em **"RUN"**

### **6. Executar Migração 4: Nome do Criador**

Cole este SQL:

```sql
-- Adicionar campo para nome do criador
ALTER TABLE public.moradores 
ADD COLUMN IF NOT EXISTS criado_por_nome TEXT;

COMMENT ON COLUMN public.moradores.criado_por_nome IS 'Nome do guarda que criou o cadastro';
```

Clique em **"RUN"**

---

## ✅ Verificar se Funcionou

Após executar todas as migrações, execute este SQL para verificar:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'moradores' 
  AND column_name IN (
    'abordagens_anteriores',
    'motivo_situacao_rua',
    'bairro',
    'rua',
    'informacoes_local',
    'criado_por_nome'
  )
ORDER BY column_name;
```

Você deve ver todas as 6 colunas listadas.

---

## 🎯 SQL Completo (Tudo de Uma Vez)

Se preferir, pode executar tudo de uma vez:

```sql
-- Adicionar todas as colunas que faltam
ALTER TABLE public.moradores 
ADD COLUMN IF NOT EXISTS abordagens_anteriores TEXT,
ADD COLUMN IF NOT EXISTS motivo_situacao_rua TEXT,
ADD COLUMN IF NOT EXISTS bairro TEXT,
ADD COLUMN IF NOT EXISTS rua TEXT,
ADD COLUMN IF NOT EXISTS informacoes_local TEXT,
ADD COLUMN IF NOT EXISTS criado_por_nome TEXT;

-- Adicionar comentários
COMMENT ON COLUMN public.moradores.abordagens_anteriores IS 'Registra informações sobre abordagens anteriores do mesmo indivíduo';
COMMENT ON COLUMN public.moradores.motivo_situacao_rua IS 'Motivo pelo qual a pessoa está em situação de rua';
COMMENT ON COLUMN public.moradores.bairro IS 'Bairro onde a pessoa foi abordada';
COMMENT ON COLUMN public.moradores.rua IS 'Rua onde a pessoa foi abordada';
COMMENT ON COLUMN public.moradores.informacoes_local IS 'Informações adicionais sobre o local da abordagem';
COMMENT ON COLUMN public.moradores.criado_por_nome IS 'Nome do guarda que criou o cadastro';
```

---

## 📱 Depois de Executar

1. ✅ Feche o app no celular
2. ✅ Abra novamente
3. ✅ Tente cadastrar um morador
4. ✅ Deve funcionar sem erros!

---

## 🔍 Se Ainda Der Erro

Se ainda aparecer erro, verifique:

1. **Tabela correta?**
   - A tabela deve ser `public.moradores`
   - Não `moradores` de outro schema

2. **Permissões?**
   - Você precisa ser admin do projeto
   - Ou ter permissões de ALTER TABLE

3. **Cache?**
   - Às vezes o Supabase demora alguns segundos
   - Aguarde 30 segundos e tente novamente

---

## 📞 Suporte

Se precisar de ajuda:
1. Tire print do erro no SQL Editor
2. Verifique se está no projeto correto
3. Confirme que executou todos os SQLs

---

**Execute as migrações e o erro será resolvido! 🚀**
