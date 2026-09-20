# 📘 AGENT-LAB: Guia Completo de Agentes de IA, OmniRoute e Claude Code

> **Instituto Federal do Ceará (IFCE) — Campus Caucaia**  
> **Disciplina de Inteligência Artificial — Prof. Romulo Cesar** (`romulo.cesar@ifce.edu.br`)  
> **Página Web Online para Alunos:** [https://rcminitor.github.io/omniroute-aula/](https://rcminitor.github.io/omniroute-aula/)  
> **Repositório GitHub:** [https://github.com/rcminitor/omniroute-aula](https://github.com/rcminitor/omniroute-aula)

---

## 🚨 1. Guia Rápido de Sobrevivência no Terminal (Leia Antes de Começar!)

Se você nunca usou o terminal ou não tem computador em casa, **não se preocupe!** Guarde estas 4 regras simples:

1. **🖱️ Como colar no terminal:** Copie o comando desejado. Na tela preta do PowerShell, basta dar **um clique com o botão direito do mouse** que o texto cola automaticamente.
2. **🪟 O segredo das 2 janelas pretas:** O OmniRoute precisa de **duas janelas abertas ao mesmo tempo**:
   * **Janela 1:** Fica rodando o motor (`omniroute serve`) e NÃO pode ser fechada.
   * **Janela 2:** É onde você entra na pasta e conversa com o Claude Code (`claude`).
3. **👻 A pasta "invisível":** No Windows, pastas que começam com ponto (como `.claude`) ficam **ocultas** no Explorador de Arquivos. Ela não sumiu, apenas está escondida.
4. **🟡 Texto amarelo não é erro:** Mensagens amarelas de aviso (`npm warn`) são apenas avisos do sistema. Não se preocupe a menos que a tela feche ou dê um bloco vermelho grande.

---

## 📖 2. Dicionário do Aluno (Em linguagem do dia a dia)

| Nome Técnico | Analogia da Vida Real | O que ele faz no computador? |
| :--- | :--- | :--- |
| **Agente de IA (Claude Code)** | Um estagiário de programação muito rápido. | Lê seus arquivos locais, escreve código e roda testes na máquina. |
| **OmniRoute** | Um roteador Wi-Fi inteligente. | Fica na porta `20128` e escolhe qual IA gratuita responderá seu comando. |
| **API** | O garçom de um restaurante. | Leva o seu pedido até o servidor da IA e traz a resposta de volta. |
| **Tokens** | Contagem de palavras do SMS. | É a quantidade de texto que a IA lê e escreve por segundo. |
| **Fallback (Transbordo)** | O plano B da caixa d'água. | Se o Gemini bater o limite, pula para o Groq sozinho sem travar sua aula. |

---

## 💸 3. A Falácia do "Almoço 100% Grátis" em IA

Muitos tutoriais prometem *"Use Claude Code 100% grátis para sempre via OpenRouter"*. Na prática, isso esbarra em limites técnicos:

1. **Inferência é cara:** Rodar modelos de ponta exige clusters de GPUs (H100) com alto consumo elétrico e de hardware.
2. **Modelos `:free` são para degustação:** O OpenRouter limita contas gratuitas a poucas dezenas de requisições por dia.
3. **Agentes consomem muito:** Uma única tarefa de agente pode fazer 30 a 50 chamadas de API em loop, esgotando cotas gratuitas em minutos.

### As Três Abordagens Reais:
| Abordagem | Custo Médio | Estabilidade | Veredito |
| :--- | :--- | :--- | :--- |
| **Modelos `:free` na Nuvem** | R$ 0,00 | Baixa (Erro 429 constante) | Frustrante para uso diário em agentes. |
| **Modelos Locais (Ollama)** | R$ 0,00 real | Alta (Roda na sua RAM) | Excelente para privacidade e sem limite de requisições. |
| **Pay-as-you-go Ultrabarato** | R$ 5 a R$ 15 / mês | Máxima (Sem bloqueios) | Melhor custo-benefício (DeepSeek / Gemini Flash). |

---

## 🔄 4. Anatomia do Erro 429 & Roteamento em Cascata (Fallback)

### O que significa?
> `API Error: Request rejected (429) · Rate limit exceeded: free-models-per-day`

* **Código 429:** *Too Many Requests* (Limite de requisições atingido).
* **Bloqueio por Conta:** No OpenRouter, o limite de modelos gratuitos é aplicado à **sua chave inteira**. Se um modelo gratuito travar, todos os outros modelos gratuitos daquela chave travam juntos.

### A Solução: Fallback Multi-Provedor
Para o sistema pular automaticamente para outra IA quando uma atingir o limite, os modelos devem vir de **provedores independentes**:
1. 🟢 **Google Gemini** (Google AI Studio - grátis e cota generosa).
2. 🟢 **Groq Cloud** (Llama 3.3 70B - ultra-rápido).
3. 🟢 **DeepSeek / OpenRouter com centavos** (Rede de segurança para nunca travar).

---

## 💻 5. Passo a Passo no Terminal (Pasta Única)

### 🔹 Passo 0: Testar se o Node.js e o npm existem no computador
O comando `npm` não existe sozinho no Windows; ele vem **dentro do pacote do Node.js**. Teste se o computador já tem o Node instalado:

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

## 🔑 6. Onde Pegar as Chaves de API Gratuitas

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

## ⚡ 7. Claude Code: Comandos e Boas Práticas

* **O que é o `* Transfiguring...`?**
  * É a animação normal do Claude Code indicando que ele está processando a resposta da LLM e avaliando as ferramentas do projeto.
* **Cuidado com MCPs em Excesso:**
  * Servidores MCP sem autenticação ou em excesso podem enviar até **150.000 tokens** em uma saudação simples, atrasando a resposta.
* **Comandos no Terminal do Claude Code:**
  * `/` → Abre o menu interativo com todas as opções.
  * `/model` → Exibe o modelo ou combo ativo (ex: gratuitos).
  * `/mcp` → Gerencia e desativa servidores MCP pesados.
  * `/clear` → Limpa o histórico da sessão e acelera as respostas.
  * `/cost` → Mostra o consumo de tokens e estatísticas.

---
*Material didático desenvolvido para o AGENT-LAB — IFCE Campus Caucaia.*
