# 📘 Guia Prático: Agentes de IA, OmniRoute e Gestão Inteligente de LLMs

Este tutorial consolida todo o aprendizado prático sobre o funcionamento de **Agentes de Desenvolvimento**, a infraestrutura de **Roteamento de LLMs (OmniRoute)**, a mitigação de erros de cota (**Erro 429**) e as melhores práticas com o **Claude Code**.

---

## 📑 Índice
1. [O que são Agentes de IA e como operam no seu PC](#1-o-que-são-agentes-de-ia)
2. [A Verdade sobre Custos de IA: A Falácia do "Almoço Grátis"](#2-a-verdade-sobre-custos-de-ia)
3. [Entendendo o Erro 429 e a Estratégia de Fallback (Transbordo)](#3-entendendo-o-erro-429-e-fallback)
4. [Arquitetura do OmniRoute: Múltiplos Provedores](#4-arquitetura-do-omniroute)
5. [Claude Code no Terminal: Dicas, Comandos e Otimização de MCPs](#5-claude-code-no-terminal)

---

## 1. O que são Agentes de IA?

Diferente de um chatbot tradicional (onde você copia e cola código manualmente), um **Agente de IA** (como Antigravity ou Claude Code) tem autonomia para executar ações reais no seu sistema:

```
[ Usuário dita o objetivo ]
          │
          ▼
   ┌──────────────┐
   │ Agente de IA │ ◄─── Loop de Raciocínio (ReAct)
   └──────┬───────┘
          │
     ┌────┴─────────────────────────────┐
     ▼                                  ▼
[ Leitura e Edição de Arquivos ]   [ Execução no Terminal ]
(Modifica código no disco)        (Roda testes, builds, scripts)
```

### O que um agente faz diretamente na sua máquina:
* **Lê e pesquisa arquivos:** Faz buscas globais (`grep`), analisa dependências e entende a arquitetura.
* **Edita código com precisão:** Altera apenas as linhas necessárias, sem perder o contexto nem apagar comentários.
* **Executa o terminal:** Roda scripts PowerShell, instala pacotes, executa testes e analisa mensagens de erro para autocorrigir o código.

---

## 2. A Verdade sobre Custos de IA

Muitos tutoriais prometem *"Use Claude Code 100% grátis para sempre via OpenRouter"*. Na prática, isso esbarra em limites técnicos:

1. **Inferência é cara:** Rodar modelos de ponta exige clusters de GPUs (H100) com alto consumo elétrico e de hardware.
2. **Modelos `:free` são para degustação:** O OpenRouter limita contas gratuitas a poucas dezenas de requisições por dia.
3. **Agentes consomem muito:** Uma única tarefa de agente pode fazer 30 a 50 chamadas de API em loop, esgotando cotas gratuitas em minutos.

### As Duas Únicas Estratégias Reais:
| Estratégia | Como funciona | Custo | Vantagem |
| :--- | :--- | :--- | :--- |
| **1. IA Local (Ollama)** | Roda no seu PC usando sua memória RAM (32 GB). | **R$ 0,00** | 100% privado, sem internet, sem erro 429. |
| **2. Pay-as-you-go Ultrabarato** | Paga centavos por uso em modelos rápidos (DeepSeek V3, Gemini Flash). | **R$ 5 a R$ 15/mês** | Altíssimo poder de raciocínio sem mensalidades fixas de R$ 120+. |

---

## 3. Entendendo o Erro 429 e Fallback

### O que significa?
> `API Error: Request rejected (429) · Rate limit exceeded: free-models-per-day`

* **Código 429:** *Too Many Requests* (Limite de requisições atingido).
* **Bloqueio por Conta:** No OpenRouter, o limite de modelos gratuitos é aplicado à **sua chave de API inteira**. Se um modelo gratuito travar, todos os outros modelos gratuitos daquela chave travam juntos.

### A Solução: Fallback Multi-Provedor
Para o sistema pular automaticamente para outra IA quando uma atingir o limite, os modelos devem vir de **empresas/contas diferentes**:

```
[ Chamada do Agente ]
          │
          ▼
┌────────────────────────────────────────┐
│ 1. Google Gemini (Google AI Studio)   │ ───► Sucesso? ──► Retorna resposta
└──────────────────┬─────────────────────┘
                   │ Falhou / 429
                   ▼
┌────────────────────────────────────────┐
│ 2. Groq Cloud (Llama 3.3 70B)          │ ───► Sucesso? ──► Retorna resposta
└──────────────────┬─────────────────────┘
                   │ Falhou / 429
                   ▼
┌────────────────────────────────────────┐
│ 3. DeepSeek / OpenRouter (Centavos)    │ ───► Conclui sem interrupção
└────────────────────────────────────────┘
```

---

## 4. Arquitetura do OmniRoute

O **OmniRoute** funciona como uma central telefônica (proxy reverso local na porta `20128`):
* O Claude Code conversa com `http://localhost:20128`.
* O OmniRoute recebe o pedido e encaminha para o **Combo** configurado.

### Provedores Conectados no seu Setup:
* 🟢 **Google Gemini** (`main`)
* 🟢 **Groq** (`main`)
* 🟢 **Ollama Cloud** (`romulo_ollama`)
* 🟢 **Grok / xAI** (OAuth)

### Comandos Essenciais do OmniRoute (PowerShell):
```powershell
# Abrir o painel web de controle
omniroute dashboard

# Testar se todos os provedores estão saudáveis
omniroute providers test-all

# Listar combos de roteamento ativos
omniroute combo list

# Ligar o OmniRoute no Claude Code da pasta atual
.\omniroute-on.ps1

# Desligar e voltar para a configuração padrão
.\omniroute-off.ps1
```

---

## 5. Claude Code no Terminal

### O que é o `* Transfiguring...`?
É a animação nativa do Claude Code indicando que ele está processando a resposta da LLM e avaliando as ferramentas disponíveis.

### Cuidado com o Excesso de MCPs:
Se houver muitos servidores MCP ativados, uma mensagem simples como *"olá"* pode enviar **mais de 140.000 tokens** de instruções de ferramentas, deixando as respostas mais lentas.

### Comandos do Claude Code (Digite `/` no terminal):
* `/` → Abre a lista suspensa com todos os comandos.
* `/model` → Mostra o modelo ou combo em uso.
* `/mcp` → Gerencia os servidores de ferramentas (desative os que não estiver usando para acelerar as respostas).
* `/clear` → Limpa o histórico da sessão e reduz drasticamente o consumo de tokens.
* `/cost` → Exibe estatísticas de tokens e custo da sessão.
* `/help` → Mostra o manual de comandos.

---

> 💡 **Regra Prática:** Mantenha o OmniRoute rodando com múltiplos provedores configurados, use `/clear` regularmente no Claude Code e utilize modelos ultrabaratos ou o Gemini direto para produtividade máxima sem surpresas de limite.
