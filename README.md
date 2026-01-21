Ajuda Laguna App



Sistema de apoio social e operacional utilizado pela Guarda Municipal de Laguna/SC para o cadastro e acompanhamento de pessoas em situação de rua, com foco em assistência, orientação e encaminhamento adequado.

## 📱 Sobre o Projeto
O Ajuda Laguna é um sistema desenvolvido para atender uma demanda real da Guarda Municipal de Laguna, que atua diariamente em ocorrências envolvendo pessoas em situação de vulnerabilidade social.

A aplicação foi criada para organizar informações, registrar abordagens de caráter social e apoiar ações de auxílio, sempre com foco na dignidade humana, assistência e apoio, e não em ações repressivas.

O sistema auxilia a Guarda Municipal a trabalhar de forma mais integrada com os setores sociais da Prefeitura, evitando perda de informações e facilitando o acompanhamento dos atendimentos realizados.

Aplicação web e mobile (Android) para registro de abordagens e ocorrências, com captura de GPS, upload de fotos e sistema de permissões baseado em cargos.
⚠️ Uso restrito: para utilizar, testar ou implantar o sistema, é necessário entrar em contato diretamente comigo ou com a Guarda Municipal de Laguna.


### ✨ Funcionalidades

- 🔐 **Autenticação segura** com sistema de cargos (Comandante/Guarda)
- ➕ **Cadastro de ocorrências** com validação de dados
- 📍 **Captura automática de GPS** para localização precisa
- 📷 **Upload de fotos** com armazenamento em nuvem
- 📋 **Listagem e busca** de cadastros
- ✏️ **Edição e exclusão** de registros
- 📊 **Dashboard** com estatísticas em tempo real
- 🔗 **Integração com BNMP** (Banco Nacional de Mandados de Prisão)
- 📱 **App Android nativo** via Capacitor

## 🚀 Status do Projeto

- ✅ **Web:** Deployado na Vercel
- ⏳ **Android:** Em fase de testes (APK em desenvolvimento)

## 🛠️ Tecnologias

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **React Router** - Navegação
- **React Hook Form** - Formulários
- **Zod** - Validação

### Backend/Infraestrutura
- **Supabase** - Backend as a Service
  - PostgreSQL (Banco de dados)
  - Authentication (Autenticação)
  - Storage (Armazenamento de fotos)
  - Row Level Security (Segurança)
- **Vercel** - Deploy e hosting

### Mobile
- **Capacitor 7** - Framework híbrido
- **Android SDK** - Plataforma nativa

## 📚 Documentação

### 🎯 Início Rápido
- **[INDICE_DOCUMENTACAO.md](INDICE_DOCUMENTACAO.md)** - Índice completo de toda documentação
- **[PLANO_ACAO_RESUMIDO.md](PLANO_ACAO_RESUMIDO.md)** - Cronograma dos próximos 7 dias
- **[COMANDOS_RAPIDOS.md](COMANDOS_RAPIDOS.md)** - Comandos essenciais

### 📱 Android
- **[PROXIMOS_PASSOS_ANDROID.md](PROXIMOS_PASSOS_ANDROID.md)** - Guia completo para gerar APK
- **[build-android.ps1](build-android.ps1)** - Script automático de build

### 🧪 Testes
- **[CHECKLIST_TESTES.md](CHECKLIST_TESTES.md)** - Checklist completo de testes

### 🎓 Treinamento
- **[ROTEIRO_TREINAMENTO.md](ROTEIRO_TREINAMENTO.md)** - Roteiro para treinar guardas

### 👥 Gestão
- **[MANUAL_CARGOS_PERMISSOES.md](MANUAL_CARGOS_PERMISSOES.md)** - Sistema de cargos e permissões
- **[GUIA_LOGINS.md](GUIA_LOGINS.md)** - Como criar e gerenciar usuários

## 🏃 Como Executar

### Pré-requisitos
- Node.js 18+ e npm
- Git
- Conta no Supabase (para backend)

### Desenvolvimento Local

```powershell
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd ajudalaguna-app-web01

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Copie .env.example para .env e preencha com suas chaves do Supabase
cp .env.example .env

# 4. Inicie o servidor de desenvolvimento
npm run dev

# Acesse: http://localhost:5173
```

### Build para Produção

```powershell
# Build da aplicação web
npm run build

# Preview do build
npm run preview
```

### Build Android

```powershell
# Opção 1: Script automático
.\build-android.ps1

# Opção 2: Passo a passo
npm run build
npx cap sync android
npx cap open android
# No Android Studio: Build > Build APK
```

## 📦 Scripts Disponíveis

```powershell
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Preview do build
npm run lint         # Verifica erros de código
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### Capacitor (capacitor.config.ts)

```typescript
{
  appId: 'br.com.ajudalaguna.app',
  appName: 'Ajuda Laguna',
  webDir: 'dist'
}
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: `cadastros`
- `id` (uuid, PK)
- `nome_completo` (text)
- `cpf` (text)
- `rg` (text)
- `data_nascimento` (date)
- `nome_mae` (text)
- `telefone` (text)
- `tipo_ocorrencia` (text)
- `local` (text)
- `observacoes` (text)
- `latitude` (numeric)
- `longitude` (numeric)
- `foto_url` (text)
- `created_at` (timestamp)
- `user_id` (uuid, FK)

### Tabela: `user_roles`
- `id` (uuid, PK)
- `user_id` (uuid, FK)
- `role` (text: 'comandante' | 'guarda')
- `created_at` (timestamp)

## 🔒 Segurança

- ✅ Row Level Security (RLS) habilitado
- ✅ Autenticação obrigatória
- ✅ Sistema de cargos e permissões
- ✅ Validação de dados no frontend e backend
- ✅ Cadastro público bloqueado

## 🚀 Deploy

### Vercel (Automático)
```powershell
git push origin main
# Deploy automático via Vercel
```

### Manual
```powershell
npm run build
# Upload da pasta dist/ para seu servidor
```

## 🤝 Contribuindo

Este é um projeto interno da Guarda Municipal de Laguna. Para contribuir:

1. Crie uma branch para sua feature
2. Faça suas alterações
3. Teste localmente
4. Faça commit e push
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Consulte a documentação em `INDICE_DOCUMENTACAO.md`
- Verifique o troubleshooting em `COMANDOS_RAPIDOS.md`
- Entre em contato com o administrador do sistema

## 📝 Licença

Uso interno - Guarda Municipal de Laguna/SC

## 🎯 Roadmap

### V1.0 (Atual)
- [x] Aplicação web completa
- [x] Deploy na Vercel
- [x] Sistema de autenticação
- [x] CRUD de cadastros
- [x] Upload de fotos
- [x] Captura de GPS
- [x] Sistema de cargos
- [ ] APK Android (em testes)
**Desenvolvido para a Guarda Municipal de Laguna/SC** 🛡️
