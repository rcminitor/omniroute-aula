# 📘 Guia & Tutorial Prático: OmniRoute + Claude Code em Pasta Única

> **Disciplina de Inteligência Artificial — IFCE Campus Caucaia**  
> **Prof. Romulo Cesar** (`romulo.cesar@ifce.edu.br`)  
> **Repositório:** [https://github.com/rcminitor/omniroute-aula](https://github.com/rcminitor/omniroute-aula)  
> **Página Web Online:** [https://rcminitor.github.io/omniroute-aula/](https://rcminitor.github.io/omniroute-aula/)

---

## 📑 Índice
1. [Conceitos: Agentes de IA e o OmniRoute](#1-conceitos-agentes-de-ia-e-omniroute)
2. [A Falácia do "Grátis" & Erro 429](#2-a-falácia-do-grátis--erro-429)
3. [Tutorial Passo a Passo: Criando o Ambiente em Pasta Única do Zero](#3-tutorial-passo-a-passo-pasta-única)
4. [Estrutura de Arquivos da Pasta do Projeto](#4-estrutura-de-arquivos-do-projeto)
5. [Configuração do Combo Multi-Provedor no OmniRoute](#5-configuração-do-combo-multi-provedor)
6. [Operação no Terminal do Claude Code](#6-operação-no-terminal-do-claude-code)

---

## 1. Conceitos: Agentes de IA e OmniRoute

Um **Agente de IA** (como Claude Code ou Antigravity) difere de um chat comum porque tem acesso direto aos arquivos locais e ao terminal do computador:
* **Leitura Cirúrgica:** Inspeciona o código e a estrutura do projeto.
* **Edição de Arquivos:** Altera o código direto no disco.
* **Execução de Terminal:** Compila, roda testes e corrige falhas automaticamente.

O **OmniRoute** é um gateway/proxy local (porta `20128`) que intercepta as chamadas do Claude Code e permite rotear para múltiplos provedores (Google Gemini, Groq, Ollama, OpenRouter).

---

## 2. A Falácia do "Grátis" & Erro 429

No OpenRouter, contas sem crédito recebem o erro:
> `API Error: Request rejected (429) · Rate limit exceeded: free-models-per-day`

* **Motivo:** O limite é aplicado à **chave inteira**. Trocar entre modelos `:free` dentro da mesma conta não resolve.
* **Solução:** Criar um **Combo com Fallback (Transbordo)** usando provedores independentes:
  1. 🟢 **Google Gemini** (Google AI Studio - grátis e cota generosa).
  2. 🟢 **Groq Cloud** (Llama 3.3 70B - ultra-rápido).
  3. 🟢 **DeepSeek / OpenRouter com centavos** (Rede de segurança para nunca travar).

---

## 3. Tutorial Passo a Passo: Pasta Única (Via Terminal)

Siga este roteiro no **PowerShell** para criar um ambiente isolado em uma única pasta.

### Passo 1: Instalar o Node.js e Claude Code
Se ainda não tiver o Node.js e o Claude Code instalados:
```powershell
# 1. Instalar o Node.js LTS (caso necessário)
winget install OpenJS.NodeJS.LTS

# 2. Instalar o Claude Code globalmente
npm install -g @anthropic-ai/claude-code

# 3. Instalar o OmniRoute globalmente
npm install -g omniroute
```

---

### Passo 2: Criar a Pasta do Projeto
```powershell
# Criar e entrar na pasta do projeto
mkdir C:\Users\$env:USERNAME\Projetos\meu-projeto-ia
cd C:\Users\$env:USERNAME\Projetos\meu-projeto-ia

# Criar a subpasta oculta do Claude Code
mkdir .claude
```

---

### Passo 3: Criar o `.gitignore` de Segurança
Crie o arquivo `.gitignore` para impedir que suas chaves de API sejam enviadas para o GitHub por engano:
```powershell
@'
.claude/settings.local.json*
*.env
*.log
*.sqlite*
'@ | Out-File -FilePath .gitignore -Encoding utf8
```

---

### Passo 4: Criar o arquivo de Configuração `.claude\settings.local.json`
Este arquivo instrui o Claude Code a falar com o OmniRoute em `http://localhost:20128` usando o combo `gratuitos`:

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

### Passo 5: Iniciar o Gateway do OmniRoute e Validar
Em uma janela de terminal, inicie o OmniRoute:
```powershell
omniroute serve
```

Para abrir o painel e gerenciar os provedores conectados:
```powershell
omniroute dashboard
```

---

### Passo 6: Executar o Claude Code
Dentro da pasta do projeto (`meu-projeto-ia`), basta rodar:
```powershell
claude
```

Pronto! O Claude Code iniciará conectado ao seu combo do OmniRoute.

---

## 4. Estrutura de Arquivos da Pasta

Ao final do passo a passo, sua pasta terá a seguinte estrutura limpa e isolada:

```
meu-projeto-ia/
│
├── .claude/
│   └── settings.local.json     # Aponta para o OmniRoute (localhost:20128)
│
├── .gitignore                  # Protege arquivos sensíveis e tokens
├── TUTORIAL.md                 # Roteiro da aula
└── index.html                  # Página web do projeto
```

---

## 5. Configuração do Combo Multi-Provedor

No painel do OmniRoute (`omniroute dashboard`):
1. **Providers:** Conecte o **Google Gemini API**, **Groq** e **Ollama/OpenRouter**.
2. **Combos:** Crie um combo com nome `gratuitos` e estratégia `fill-first`.
3. Adicione os modelos na ordem de preferência:
   * 1º `gemini-2.0-flash`
   * 2º `groq/llama-3.3-70b`
   * 3º `deepseek/deepseek-chat` (backup pago)

---

## 6. Operação no Terminal do Claude Code

No prompt do Claude Code:
* Digite `/` para ver a lista de comandos.
* Use `/clear` regularmente para liberar tokens de contexto e acelerar respostas.
* Use `/model` para confirmar o combo ativo.
* Se aparecer `* Transfiguring...`, é o Claude Code processando o raciocínio e ferramentas.

---
*Material desenvolvido para as aulas de Inteligência Artificial — IFCE Caucaia.*
