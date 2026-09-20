# 📘 AGENT-LAB: Roteiro Completo de Aula - Agentes de IA & OmniRoute

> **Instituto Federal do Ceará (IFCE) — Campus Caucaia**  
> **Disciplina de Inteligência Artificial — Prof. Romulo Cesar** (`romulo.cesar@ifce.edu.br`)  
> **Página Web Online para Alunos:** [https://rcminitor.github.io/omniroute-aula/](https://rcminitor.github.io/omniroute-aula/)  
> **Repositório GitHub:** [https://github.com/rcminitor/omniroute-aula](https://github.com/rcminitor/omniroute-aula)

---

## 🤖 1. As Ferramentas da Aula (O que vamos usar hoje?)

Hoje não usaremos um chat comum. Usaremos um **Agente de Desenvolvimento Autônomo** que opera diretamente no computador:
* **Claude Code:** O cérebro da aula. Roda no terminal, lê seus arquivos, escreve código e executa testes.
* **OmniRoute:** O roteador da aula (porta `20128`). Recebe os pedidos e escolhe a IA gratuita disponível.
* **Provedores de IA:** As plataformas que fornecem os modelos oficiais gratuitos (Google Gemini e Groq Cloud com Llama 3).

---

## 💸 2. A Falácia do "Almoço 100% Grátis" em IA & Erro 429

Muitos tutoriais prometem *"Use Claude Code 100% grátis para sempre via OpenRouter"*. Na prática, isso esbarra em limites técnicos:

1. **Inferência é cara:** Rodar modelos de ponta exige clusters de GPUs (H100) com alto consumo de hardware e energia.
2. **Modelos `:free` são para testes rápidos:** O OpenRouter limita contas gratuitas a poucas requisições por dia.
3. **O Erro 429:** Um agente faz 40 chamadas em 5 minutos, esgotando a cota diária e gerando o erro `429 (Rate limit exceeded)`.

### A Solução: Roteamento com Fallback (Transbordo)
Para não travar sua aula, conectamos múltiplos provedores no OmniRoute:
1. 🟢 **Google Gemini** (1ª escolha: cota gratuita generosa direta do Google).
2. 🟢 **Groq Cloud** (2ª escolha: Llama 3.3 em chips ultra-rápidos).
3. 🟢 **DeepSeek / Centavos** (Rede de segurança para quem tiver saldo mínimo).

---

## 🚨 3. Regras de Sobrevivência no Terminal (Antes de Mexer no Teclado)

1. **🖱️ Como colar no terminal:** Copie o comando desejado. Na tela preta do PowerShell, basta dar **um clique com o botão direito do mouse** que o texto cola automaticamente.
2. **🪟 O segredo das 2 janelas pretas:** O OmniRoute precisa de **duas janelas abertas ao mesmo tempo**:
   * **Janela 1:** Fica rodando o motor (`omniroute serve`) e NÃO pode ser fechada.
   * **Janela 2:** É onde você entra na pasta e conversa com o Claude Code (`claude`).
3. **👻 A pasta "invisível":** No Windows, pastas que começam com ponto (como `.claude`) ficam **ocultas** no Explorador de Arquivos. Ela não sumiu, apenas está escondida.
4. **🟡 Texto amarelo não é erro:** Mensagens amarelas de aviso (`npm warn`) são apenas avisos do sistema. Não se preocupe a menos que a tela feche ou dê um bloco vermelho grande.

---

## 💻 4. Mão na Massa: Instalando Ferramentas e Criando o Projeto

### 🔹 Passo 0: Testar se o Node.js e o npm existem no computador
O comando `npm` não existe sozinho no Windows; ele vem **dentro do pacote do Node.js**. Abra o PowerShell e teste:

```powershell
node -v
```

* **✅ Se apareceu um número (ex: `v20.x` ou `v22.x`):** O Node.js e o npm já estão instalados! Pule direto para o **Passo 1**.
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

## 🔑 5. Chegou a Hora: Pegar as Chaves Gratuitas de API

Agora que a estrutura do seu projeto está montada, **vamos pegar as chaves nos sites oficiais e cadastrar no OmniRoute**:

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

### ⚙️ Como cadastrar no OmniRoute:
1. Abra o painel com o comando:
   ```powershell
   omniroute dashboard
   ```
2. Clique na aba lateral **"Providers"**.
3. Cole a sua chave do Gemini ou Groq e clique em **Save**.

---

## 🚀 6. Ligar o Motor e Rodar o Claude Code

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

## 👁️ 7. Telas Reais & Comandos Úteis

* **O que é o `* Transfiguring...`?**
  * É a animação normal do Claude Code indicando que ele está processando a resposta da LLM e avaliando as ferramentas do projeto.
* **Comando `/clear`:**
  * Se a conversa começar a demorar, digite `/clear` no terminal para limpar o histórico e acelerar as respostas.
* **Menu de Comandos:**
  * Digite apenas uma barra `/` no terminal para ver opções como `/model`, `/mcp`, `/cost` e `/help`.

---
*Material didático desenvolvido para o AGENT-LAB — IFCE Campus Caucaia.*
