## 🔑 1. Onde Pegar as Chaves Gratuitas (Passo a Passo Visual)

Para a IA funcionar, você precisa de uma **Chave de API** (sua senha de acesso gratuita). Clique nos links abaixo:

### 🟢 Opção 1: Google Gemini API (100% Gratuito Oficial)
* 🔗 **Link direto:** [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
* **Onde clicar na tela:**
  1. Faça login com seu Gmail normal.
  2. Clique no botão azul **"Get API key"**.
  3. Clique em **"Create API key"**.
  4. Copie a chave (começa com `AIzaSy...`).

---

### 🟢 Opção 2: Groq Cloud - Llama 3.3 (Ultra-Rápido e Gratuito)
* 🔗 **Link direto:** [https://console.groq.com/keys](https://console.groq.com/keys)
* **Onde clicar na tela:**
  1. Faça login com Google ou GitHub.
  2. No menu da esquerda, clique em **"API Keys"**.
  3. Clique no botão **"Create API Key"**.
  4. Copie a chave (começa com `gsk_...`).

---

### ⚙️ Como colocar as chaves no OmniRoute:
1. Abra o painel com o comando:
   ```powershell
   omniroute dashboard
   ```
2. Clique na aba lateral **"Providers"**.
3. Cole a sua chave do Gemini ou Groq e clique em **Save**.

---

## 🚨 2. Guia Rápido de Sobrevivência no Terminal (Leia Antes de Começar!)

Se você nunca usou o terminal ou não tem computador em casa, **não se preocupe!** Guarde estas 5 regras simples:

1. **🖱️ Como colar no terminal:** Copie o comando desejado. Na tela preta do PowerShell, basta dar **um clique com o botão direito do mouse** que o texto cola automaticamente.
2. **🪟 O segredo das 2 janelas pretas:** O OmniRoute precisa de **duas janelas abertas ao mesmo tempo**:
   * **Janela 1:** Fica rodando o motor (`omniroute serve`) e NÃO pode ser fechada.
   * **Janela 2:** É onde você entra na pasta e conversa com o Claude Code (`claude`).
3. **👻 A pasta "invisível":** No Windows, pastas que começam com ponto (como `.claude`) ficam **ocultas** no Explorador de Arquivos. Ela não sumiu, apenas está escondida.
4. **🟡 Texto amarelo não é erro:** Mensagens amarelas de aviso (`npm warn`) são apenas avisos do sistema. Não se preocupe a menos que a tela feche ou dê um bloco vermelho grande.
5. **🧹 Como deixar a IA mais rápida:** No Claude Code, digite `/clear` e aperte Enter para limpar a memória da conversa quando ele começar a ficar lento.

---

## 📖 2. Dicionário do Aluno (Em linguagem do dia a dia)

| Nome Técnico | Analogia da Vida Real | O que ele faz no computador? |
| :--- | :--- | :--- |
| **Agente de IA (Claude Code)** | Um estagiário de programação muito rápido. | Lê seus arquivos locais, escreve código e roda testes na máquina. |
| **OmniRoute** | Um roteador Wi-Fi inteligente. | Fica na porta `20128` e escolhe qual IA gratuita responderá seu comando. |
| **API** | O garçom de um restaurante. | Leva o seu pedido até o servidor da IA e traz a resposta de volta. |
| **Tokens** | Contagem de letras/palavras do SMS. | É a quantidade de texto que a IA lê e escreve por segundo. |
| **Fallback (Transbordo)** | O plano B da caixa d'água. | Se o Gemini bater o limite, pula para o Groq sozinho sem travar sua aula. |

---

## 💻 3. Passo a Passo no Terminal (Pasta Única)

Siga os passos na ordem. Cada passo deve ser executado com atenção.

### 🔹 Passo 0: Testar se o Node.js e o npm existem no computador
O comando `npm` não existe sozinho no Windows; ele vem **dentro do pacote do Node.js**. Antes de tudo, teste se o computador já tem o Node instalado:

```powershell
node -v
```

* **✅ Se apareceu um número (ex: `v20.x` ou `v22.x`):** O Node.js e o npm já estão instalados! Pule direto para o **Passo 2**.
* **❌ Se deu erro vermelho de comando não reconhecido:** O computador não tem Node.js. Instale com o comando:
  ```powershell
  winget install OpenJS.NodeJS.LTS
  ```
  *(Depois de instalar, **feche o PowerShell e abra de novo** para ele reconhecer o `npm`).*

---

### 🔹 Passo 1: Instalar o Claude Code e o OmniRoute
Com o Node.js pronto, instale os dois pacotes globais:
```powershell
npm install -g @anthropic-ai/claude-code
npm install -g omniroute
```

---

### 🔹 Passo 2: Criar a Pasta do Projeto
Copie e cole o comando abaixo no PowerShell:
```powershell
mkdir C:\Users\$env:USERNAME\Projetos\meu-projeto-ia -Force
cd C:\Users\$env:USERNAME\Projetos\meu-projeto-ia
mkdir .claude -Force
```
* **Resultado esperado:** O início da linha do terminal vai mudar para `PS C:\Users\...\Projetos\meu-projeto-ia>`.

---

### 🔹 Passo 3: Criar o arquivo de Proteção (`.gitignore`)
Impede que suas senhas ou arquivos temporários subam para a internet por engano:
```powershell
@'
.claude/settings.local.json*
*.env
*.log
*.sqlite*
'@ | Out-File -FilePath .gitignore -Encoding utf8
```

---

### 🔹 Passo 4: Configurar o Claude Code para falar com o OmniRoute
Cria o arquivo `.claude\settings.local.json` apontando para o servidor local:
```powershell
@'
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:20128",
    "ANTHROPIC_AUTH_TOKEN": "sk-omniroute-local-token",
    "ANTHROPIC_MODEL": "gratuitos",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "gratuitos",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "gratuitos",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "gratuitos",
    "CLAUDE_CODE_SUBAGENT_MODEL": "gratuitos",
    "ENABLE_CLAUDEAI_MCP_SERVERS": "false"
  },
  "model": "gratuitos",
  "disableClaudeAiConnectors": true
}
'@ | Out-File -FilePath .claude\settings.local.json -Encoding utf8
```

---

### 🔹 Passo 5: Ligar o Motor do OmniRoute (Janela 1)
Nesta primeira janela do terminal, inicie o servidor:
```powershell
omniroute serve
```
> ⚠️ **Atenção:** Esta janela vai ficar ocupada mostrando logs do servidor. **NÃO FECHE ESTA JANELA.**

---

### 🔹 Passo 6: Abrir a Segunda Janela e Rodar o Claude Code (Janela 2)
1. Abra uma **nova janela** do PowerShell (tecla Windows + digite `powershell`).
2. Entre na pasta do seu projeto e chame o Claude:
```powershell
cd C:\Users\$env:USERNAME\Projetos\meu-projeto-ia
claude
```
* **Resultado esperado:** O Claude Code iniciará exibindo o logotipo laranja e o modelo `gratuitos with high effort` pronto para suas perguntas e comandos!

---

## ⚠️ 4. Resolução de Dúvidas e Erros Comuns

* **Por que apareceu `Erro 429 - Rate limit exceeded`?**
  * Você usou todas as requisições gratuitas da sua chave do OpenRouter. A solução é abrir o painel `omniroute dashboard` e adicionar o **Google Gemini** ou o **Groq** para ter provedores extras de reserva.
* **O que significa `* Transfiguring...`?**
  * É a animação normal do Claude Code mostrando que ele está pensando e organizando ferramentas.
* **Como ver as opções do Claude Code?**
  * Digite apenas uma barra `/` no terminal para abrir o menu com `/model`, `/mcp`, `/cost` e `/clear`.

---
*Material didático desenvolvido para os estudantes do IFCE Campus Caucaia.*
