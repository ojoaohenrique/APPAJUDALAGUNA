# 🚨 CORREÇÃO URGENTE - Erro ao Cadastrar

## Problema
```
Erro ao cadastrar
Could not find the 'motivo_situacao_rua' column of 'moradores' in the schema cache
```

## Causa
O código da aplicação está tentando salvar o campo `motivo_situacao_rua`, mas essa coluna não existe na tabela `moradores` do banco de dados.

## Solução Rápida

### Opção 1: Executar SQL no Supabase (RECOMENDADO)

1. **Acesse:** https://supabase.com/dashboard
2. **Selecione** seu projeto
3. **Vá em:** SQL Editor (menu lateral)
4. **Cole e execute:**

```sql
ALTER TABLE public.moradores 
ADD COLUMN IF NOT EXISTS motivo_situacao_rua TEXT;
```

5. **Pronto!** O erro está corrigido.

---

### Opção 2: Remover o campo do código (Temporário)

Se você não conseguir acessar o Supabase agora, pode remover temporariamente o campo do formulário:

**Arquivo:** `src/pages/NovoCadastro.tsx`

**Linha 48:** Comente ou remova:
```typescript
// const [motivoSituacaoRua, setMotivoSituacaoRua] = useState("");
```

E remova todas as referências a `motivoSituacaoRua` no código.

---

## Verificação

Após executar o SQL, teste cadastrando um novo morador. O erro não deve mais aparecer.

## Arquivos Relacionados

- **Migração criada:** `supabase/migrations/20251126000000_add_motivo_situacao_rua.sql`
- **Código que usa o campo:** `src/pages/NovoCadastro.tsx` (linha 48)
- **Schema original:** `supabase/migrations/20251016133651_bdf91aba-a550-40db-a470-ebfdd977209b.sql`

## Próximos Passos

Após corrigir, você pode:
1. ✅ Testar o cadastro de um novo morador
2. ✅ Verificar se o campo aparece no formulário
3. ✅ Confirmar que os dados são salvos corretamente
