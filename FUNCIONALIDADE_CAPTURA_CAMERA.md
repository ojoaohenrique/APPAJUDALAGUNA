# 📸 Funcionalidade de Captura de Fotos pela Câmera

## ✅ Implementado em 08/12/2024

---

## 🎯 O que foi Adicionado

Agora é possível **tirar fotos diretamente pela câmera** do dispositivo, além de escolher arquivos da galeria!

### **Onde está disponível:**
1. ✅ **Foto Principal de Identificação**
2. ✅ **Fotos Adicionais (até 15 fotos)**

---

## 🚀 Como Funciona

### **Foto Principal de Identificação**

Agora você tem **2 opções**:

```
┌─────────────────────────────────────────┐
│  📸 Foto Principal de Identificação     │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   📷         │  │   📁         │   │
│  │ Tirar Foto   │  │ Escolher     │   │
│  │              │  │ Arquivo      │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### **Fotos Adicionais**

Mesma funcionalidade para fotos adicionais:

```
┌─────────────────────────────────────────┐
│  📷 Fotos Adicionais (até 15)           │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   📷         │  │   📁         │   │
│  │ Tirar Foto   │  │ Escolher     │   │
│  │              │  │ Arquivos     │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  Total: 0 / 15 foto(s)                 │
└─────────────────────────────────────────┘
```

---

## 🔧 Detalhes Técnicos

### **API Utilizada**
- `navigator.mediaDevices.getUserMedia()`
- Suporte nativo em navegadores modernos
- Funciona em dispositivos móveis e desktop

### **Configuração da Câmera**

#### **Foto Principal:**
- Usa câmera frontal (`facingMode: 'user'`)
- Ideal para foto de identificação/selfie

#### **Fotos Adicionais:**
- Usa câmera traseira (`facingMode: 'environment'`)
- Ideal para fotos do ambiente/documentos

### **Formato das Fotos**
- Formato: **JPEG**
- Qualidade: **90%**
- Nome do arquivo: `foto-{timestamp}.jpg`

---

## 📱 Como Usar

### **Passo 1: Clicar em "Tirar Foto"**
- O navegador pedirá permissão para acessar a câmera
- Clique em "Permitir"

### **Passo 2: Captura Automática**
- A foto é capturada automaticamente
- Preview aparece imediatamente
- Foto fica pronta para ser salva

### **Passo 3: Salvar**
- Clique em "Salvar Cadastro"
- A foto será enviada junto com os dados

---

## ⚠️ Requisitos

### **Navegador**
- Chrome 53+
- Firefox 36+
- Safari 11+
- Edge 12+

### **Permissões**
- O usuário precisa **permitir** acesso à câmera
- Permissão é solicitada automaticamente

### **HTTPS**
- A funcionalidade **requer HTTPS** em produção
- Em desenvolvimento (localhost) funciona sem HTTPS

---

## 🎨 Interface

### **Botão "Tirar Foto"**
```
┌──────────────┐
│   📷         │
│ Tirar Foto   │
└──────────────┘
```
- Ícone de câmera
- Texto descritivo
- Hover com feedback visual

### **Botão "Escolher Arquivo"**
```
┌──────────────┐
│   📁         │
│ Escolher     │
│ Arquivo      │
└──────────────┘
```
- Ícone de upload
- Texto descritivo
- Borda tracejada

---

## ✅ Validações

### **Foto Principal**
- ✅ Apenas 1 foto por vez
- ✅ Substitui foto anterior se existir
- ✅ Preview imediato

### **Fotos Adicionais**
- ✅ Limite de 15 fotos
- ✅ Contador visual: "X / 15 foto(s)"
- ✅ Mensagem quando atingir limite
- ✅ Pode remover fotos individualmente

---

## 🔄 Fluxo de Captura

```
Usuário clica "Tirar Foto"
         ↓
Navegador pede permissão
         ↓
Usuário permite
         ↓
Câmera é ativada
         ↓
Foto é capturada automaticamente
         ↓
Câmera é desligada
         ↓
Preview aparece na tela
         ↓
Foto pronta para salvar
```

---

## 🛡️ Segurança

### **Permissões**
- Permissão é solicitada a cada captura
- Usuário tem controle total
- Câmera é desligada após captura

### **Privacidade**
- Fotos não são enviadas automaticamente
- Apenas salvas ao clicar "Salvar Cadastro"
- Armazenadas no Supabase Storage

---

## 📊 Compatibilidade

### **Desktop**
- ✅ Windows (Chrome, Edge, Firefox)
- ✅ macOS (Chrome, Safari, Firefox)
- ✅ Linux (Chrome, Firefox)

### **Mobile**
- ✅ Android (Chrome, Firefox)
- ✅ iOS (Safari, Chrome)

### **Tablets**
- ✅ iPad (Safari)
- ✅ Android Tablets (Chrome)

---

## 🐛 Tratamento de Erros

### **Erro: Permissão Negada**
```
❌ Erro ao acessar câmera
Não foi possível acessar a câmera. 
Verifique as permissões.
```

### **Erro: Câmera Não Disponível**
```
❌ Erro ao acessar câmera
Câmera não encontrada no dispositivo.
```

### **Erro: Limite de Fotos**
```
❌ Limite atingido
Você já adicionou o máximo de 15 fotos.
```

---

## 🎯 Benefícios

### **Para o Usuário**
- ✅ Mais rápido que escolher da galeria
- ✅ Não precisa tirar foto antes
- ✅ Captura direta no momento
- ✅ Menos passos no processo

### **Para a Guarda Municipal**
- ✅ Fotos mais recentes
- ✅ Captura no momento da abordagem
- ✅ Menos erros de upload
- ✅ Processo mais ágil

---

## 📝 Código Implementado

### **Arquivo Modificado**
- `src/pages/NovoCadastro.tsx`

### **Funções Adicionadas**
1. `capturarFotoPrincipal()` - Captura foto principal
2. `capturarFotoAdicional()` - Captura fotos adicionais

### **UI Atualizada**
- Botões de câmera adicionados
- Layout em grid 2 colunas
- Ícones e textos descritivos

---

## 🧪 Como Testar

### **1. Acesse a Página**
```
http://localhost:5173/novo-cadastro
```

### **2. Teste Foto Principal**
1. Clique em "Tirar Foto"
2. Permita acesso à câmera
3. Veja o preview
4. Clique em "Salvar Cadastro"

### **3. Teste Fotos Adicionais**
1. Role até "Fotos Adicionais"
2. Clique em "Tirar Foto"
3. Permita acesso à câmera
4. Veja o preview
5. Adicione mais fotos (até 15)
6. Clique em "Salvar Cadastro"

### **4. Teste em Mobile**
1. Acesse pelo celular
2. Teste câmera frontal (foto principal)
3. Teste câmera traseira (fotos adicionais)

---

## 🚀 Deploy

### **Vercel**
A funcionalidade já está pronta para deploy:
- ✅ Código implementado
- ✅ HTTPS automático no Vercel
- ✅ Compatível com mobile

### **Comandos**
```bash
# Commit das alterações
git add .
git commit -m "feat: adicionar captura de fotos pela câmera"
git push

# Deploy automático no Vercel
```

---

## 📱 Experiência Mobile

### **Android**
- Câmera abre em tela cheia
- Botão de captura automático
- Preview imediato

### **iOS**
- Integração nativa com Safari
- Permissões do iOS
- Funciona em PWA

---

## 💡 Dicas de Uso

### **Para Melhores Resultados**
1. ✅ Boa iluminação
2. ✅ Segurar o celular firme
3. ✅ Enquadrar bem a pessoa/objeto
4. ✅ Verificar preview antes de salvar

### **Foto Principal**
- Use câmera frontal (selfie)
- Centralize o rosto
- Boa iluminação no rosto

### **Fotos Adicionais**
- Use câmera traseira
- Capture detalhes importantes
- Várias fotos de diferentes ângulos

---

## 🎉 Resultado Final

Agora o cadastro de moradores em situação de rua ficou **muito mais rápido e prático**!

### **Antes:**
1. Tirar foto com app de câmera
2. Salvar na galeria
3. Abrir o sistema
4. Escolher foto da galeria
5. Upload

### **Agora:**
1. Clicar em "Tirar Foto"
2. Foto capturada automaticamente
3. Salvar cadastro
4. Pronto! ✅

---

## 📞 Suporte

Se tiver algum problema:
1. Verifique permissões da câmera
2. Teste em outro navegador
3. Verifique se está em HTTPS (produção)
4. Limpe cache do navegador

---

**Funcionalidade implementada e pronta para uso! 🎉📸**
