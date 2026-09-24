document.addEventListener('DOMContentLoaded', () => {
  // Reading Progress Bar
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });

  // Scrollspy for Sidebar Links
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Copy to Clipboard Buttons with in-place feedback
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const codeElement = document.getElementById(targetId);
      if (codeElement) {
        const originalText = btn.textContent;
        navigator.clipboard.writeText(codeElement.innerText).then(() => {
          btn.textContent = 'Copiado! ✓';
          btn.classList.add('copied');
          showToast('Código copiado para a área de transferência!');

          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
          }, 2000);
        });
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Interactive Lab Checklist with localStorage Persistence
  const checklistCheckboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
  const checklistFill = document.getElementById('checklist-bar-fill');
  const checklistText = document.getElementById('checklist-progress-text');
  const STORAGE_KEY = 'agentlab_completed_steps';

  function loadChecklist() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      checklistCheckboxes.forEach(cb => {
        const step = cb.getAttribute('data-step');
        if (saved.includes(step)) {
          cb.checked = true;
          cb.closest('.check-item')?.classList.add('completed');
        }
      });
      updateChecklistProgress(false);
    } catch (e) {
      console.warn('Erro ao carregar checklist:', e);
    }
  }

  function updateChecklistProgress(triggerCelebration = true) {
    const total = checklistCheckboxes.length;
    if (total === 0) return;

    const completed = Array.from(checklistCheckboxes).filter(cb => cb.checked);
    const count = completed.length;
    const percent = Math.round((count / total) * 100);

    if (checklistFill) checklistFill.style.width = `${percent}%`;
    if (checklistText) checklistText.textContent = `${count}/${total}`;

    // Save to localStorage
    const stepIds = completed.map(cb => cb.getAttribute('data-step'));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stepIds));

    if (triggerCelebration && count === total) {
      showToast('🎉 Parabéns! Você concluiu todas as etapas do laboratório!');
    }
  }

  checklistCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const label = cb.closest('.check-item');
      if (cb.checked) {
        label?.classList.add('completed');
      } else {
        label?.classList.remove('completed');
      }
      updateChecklistProgress(true);
    });
  });

  loadChecklist();

  // ==========================================================================
  // Graphify Interactive Knowledge Graph
  // ==========================================================================
  function initGraphify() {
    const container = document.getElementById('graph-canvas-area');
    if (!container || typeof vis === 'undefined') return;

    const RAW_NODES = [
      {"id": "script_loadchecklist", "label": "loadChecklist()", "color": {"background": "#B07AA1", "border": "#B07AA1", "highlight": {"background": "#ffffff", "border": "#B07AA1"}}, "size": 16.7, "font": {"size": 12, "color": "#ffffff"}, "title": "loadChecklist()", "community": 6, "community_name": "script.js", "source_file": "script.js", "file_type": "code", "degree": 2},
      {"id": "script_showtoast", "label": "showToast()", "color": {"background": "#B07AA1", "border": "#B07AA1", "highlight": {"background": "#ffffff", "border": "#B07AA1"}}, "size": 16.7, "font": {"size": 12, "color": "#ffffff"}, "title": "showToast()", "community": 6, "community_name": "script.js", "source_file": "script.js", "file_type": "code", "degree": 2},
      {"id": "script_updatechecklistprogress", "label": "updateChecklistProgress()", "color": {"background": "#B07AA1", "border": "#B07AA1", "highlight": {"background": "#ffffff", "border": "#B07AA1"}}, "size": 20.0, "font": {"size": 12, "color": "#ffffff"}, "title": "updateChecklistProgress()", "community": 6, "community_name": "script.js", "source_file": "script.js", "file_type": "code", "degree": 3},
      {"id": "tutorial_agentes_omniroute_5_chegou_a_hora_pegar_as_chaves_gratuitas_de_api", "label": "🔑 5. Chaves Gratuitas de API", "color": {"background": "#4E79A7", "border": "#4E79A7", "highlight": {"background": "#ffffff", "border": "#4E79A7"}}, "size": 20.0, "font": {"size": 12, "color": "#ffffff"}, "title": "5. Chegou a Hora: Pegar as Chaves Gratuitas de API", "community": 0, "community_name": "🔑 5. Chaves Gratuitas", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 3},
      {"id": "tutorial_agentes_omniroute_opção_1_google_gemini_api_100_gratuito_oficial", "label": "🟢 Opção 1: Google Gemini API (100% Grátis)", "color": {"background": "#4E79A7", "border": "#4E79A7", "highlight": {"background": "#ffffff", "border": "#4E79A7"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Opção 1: Google Gemini API (100% Gratuito Oficial)", "community": 0, "community_name": "🔑 5. Chaves Gratuitas", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_opção_2_groq_cloud_llama_3_3_ultra_rápido_e_gratuito", "label": "🟢 Opção 2: Groq Cloud - Llama 3.3 (Ultra-Rápido)", "color": {"background": "#4E79A7", "border": "#4E79A7", "highlight": {"background": "#ffffff", "border": "#4E79A7"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Opção 2: Groq Cloud - Llama 3.3 (Ultra-Rápido e Gratuito)", "community": 0, "community_name": "🔑 5. Chaves Gratuitas", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_7_ligar_o_motor_e_rodar_o_claude_code", "label": "🚀 7. Ligar o Motor e Rodar o Claude Code", "color": {"background": "#F28E2B", "border": "#F28E2B", "highlight": {"background": "#ffffff", "border": "#F28E2B"}}, "size": 20.0, "font": {"size": 12, "color": "#ffffff"}, "title": "7. Ligar o Motor e Rodar o Claude Code", "community": 1, "community_name": "🚀 7. Executar Claude Code", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 3},
      {"id": "tutorial_agentes_omniroute_passo_5_ligar_o_motor_do_omniroute_janela_1", "label": "🔹 Passo 5: Ligar Motor OmniRoute (Janela 1)", "color": {"background": "#F28E2B", "border": "#F28E2B", "highlight": {"background": "#ffffff", "border": "#F28E2B"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Passo 5: Ligar o Motor do OmniRoute (Janela 1)", "community": 1, "community_name": "🚀 7. Executar Claude Code", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_passo_6_abrir_a_segunda_janela_e_rodar_o_claude_code_janela_2", "label": "🔹 Passo 6: Rodar Claude Code (Janela 2)", "color": {"background": "#F28E2B", "border": "#F28E2B", "highlight": {"background": "#ffffff", "border": "#F28E2B"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Passo 6: Abrir a Segunda Janela e Rodar o Claude Code (Janela 2)", "community": 1, "community_name": "🚀 7. Executar Claude Code", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute", "label": "TUTORIAL_AGENTES_OMNIROUTE.md", "color": {"background": "#E15759", "border": "#E15759", "highlight": {"background": "#ffffff", "border": "#E15759"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "TUTORIAL_AGENTES_OMNIROUTE.md", "community": 12, "community_name": "📘 Roteiro da Aula", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_1_as_ferramentas_da_aula_o_que_vamos_usar_hoje", "label": "🤖 1. Ferramentas da Aula (Claude + OmniRoute)", "color": {"background": "#E15759", "border": "#E15759", "highlight": {"background": "#ffffff", "border": "#E15759"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "1. As Ferramentas da Aula (O que vamos usar hoje?)", "community": 12, "community_name": "📘 Roteiro da Aula", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_2_a_falácia_do_almoço_100_grátis_em_ia_erro_429", "label": "💸 2. A Falácia do Almoço Grátis & Erro 429", "color": {"background": "#E15759", "border": "#E15759", "highlight": {"background": "#ffffff", "border": "#E15759"}}, "size": 16.7, "font": {"size": 12, "color": "#ffffff"}, "title": "2. A Falácia do 'Almoço 100% Grátis' em IA & Erro 429", "community": 12, "community_name": "📘 Roteiro da Aula", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 2},
      {"id": "tutorial_agentes_omniroute_3_regras_de_sobrevivência_no_terminal_antes_de_mexer_no_teclado", "label": "🚨 3. Regras de Sobrevivência no Terminal", "color": {"background": "#E15759", "border": "#E15759", "highlight": {"background": "#ffffff", "border": "#E15759"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "3. Regras de Sobrevivência no Terminal (Antes de Mexer no Teclado)", "community": 12, "community_name": "📘 Roteiro da Aula", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_8_vídeos_e_tutoriais_de_apoio_no_youtube", "label": "🎥 8. Vídeos e Tutoriais no YouTube", "color": {"background": "#E15759", "border": "#E15759", "highlight": {"background": "#ffffff", "border": "#E15759"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "8. Vídeos e Tutoriais de Apoio no YouTube", "community": 12, "community_name": "📘 Roteiro da Aula", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_a_solução_roteamento_com_fallback_transbordo", "label": "A Solução: Fallback (Transbordo)", "color": {"background": "#E15759", "border": "#E15759", "highlight": {"background": "#ffffff", "border": "#E15759"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "A Solução: Roteamento com Fallback (Transbordo)", "community": 12, "community_name": "📘 Roteiro da Aula", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_agent_lab_roteiro_completo_de_aula_agentes_de_ia_omniroute", "label": "📘 AGENT-LAB: Roteiro Completo de Aula", "color": {"background": "#E15759", "border": "#E15759", "highlight": {"background": "#ffffff", "border": "#E15759"}}, "size": 40.0, "font": {"size": 12, "color": "#ffffff"}, "title": "AGENT-LAB: Roteiro Completo de Aula - Agentes de IA & OmniRoute", "community": 12, "community_name": "📘 Roteiro da Aula", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 9},
      {"id": "tutorial_agentes_omniroute_4_mão_na_massa_instalando_ferramentas_e_criando_o_projeto", "label": "💻 4. Mão na Massa: Ferramentas & Projeto", "color": {"background": "#76B7B2", "border": "#76B7B2", "highlight": {"background": "#ffffff", "border": "#76B7B2"}}, "size": 30.0, "font": {"size": 12, "color": "#ffffff"}, "title": "4. Mão na Massa: Instalando Ferramentas e Criando o Projeto", "community": 13, "community_name": "💻 4. Mão na Massa", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 6},
      {"id": "tutorial_agentes_omniroute_passo_0_testar_se_o_node_js_e_o_npm_existem_no_computador", "label": "🔹 Passo 0: Testar Node.js e npm", "color": {"background": "#76B7B2", "border": "#76B7B2", "highlight": {"background": "#ffffff", "border": "#76B7B2"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Passo 0: Testar se o Node.js e o npm existem no computador", "community": 13, "community_name": "💻 4. Mão na Massa", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_passo_1_instalar_o_claude_code_e_o_omniroute", "label": "🔹 Passo 1: Instalar Claude Code & OmniRoute", "color": {"background": "#76B7B2", "border": "#76B7B2", "highlight": {"background": "#ffffff", "border": "#76B7B2"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Passo 1: Instalar o Claude Code e o OmniRoute", "community": 13, "community_name": "💻 4. Mão na Massa", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_passo_2_criar_a_pasta_do_projeto", "label": "🔹 Passo 2: Criar Pasta do Projeto", "color": {"background": "#76B7B2", "border": "#76B7B2", "highlight": {"background": "#ffffff", "border": "#76B7B2"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Passo 2: Criar a Pasta do Projeto", "community": 13, "community_name": "💻 4. Mão na Massa", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_passo_3_criar_o_arquivo_de_proteção_gitignore", "label": "🔹 Passo 3: Criar Proteção .gitignore", "color": {"background": "#76B7B2", "border": "#76B7B2", "highlight": {"background": "#ffffff", "border": "#76B7B2"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Passo 3: Criar o arquivo de Proteção (.gitignore)", "community": 13, "community_name": "💻 4. Mão na Massa", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_passo_4_configurar_o_claude_code_para_falar_com_o_omniroute", "label": "🔹 Passo 4: Conectar Claude ao OmniRoute", "color": {"background": "#76B7B2", "border": "#76B7B2", "highlight": {"background": "#ffffff", "border": "#76B7B2"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Passo 4: Configurar o Claude Code para falar com o OmniRoute", "community": 13, "community_name": "💻 4. Mão na Massa", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_6_como_conectar_os_provedores_criar_o_combo_e_testar_no_omniroute", "label": "⚙️ 6. Conectar Provedores & Criar Combo", "color": {"background": "#59A14F", "border": "#59A14F", "highlight": {"background": "#ffffff", "border": "#59A14F"}}, "size": 23.3, "font": {"size": 12, "color": "#ffffff"}, "title": "6. Como Conectar os Provedores, Criar o Combo e Testar no OmniRoute", "community": 14, "community_name": "⚙️ 6. Gateway OmniRoute", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 4},
      {"id": "tutorial_agentes_omniroute_etapa_a_cadastrar_os_provedores_no_painel", "label": "🔹 Etapa A: Cadastrar Provedores no Painel", "color": {"background": "#59A14F", "border": "#59A14F", "highlight": {"background": "#ffffff", "border": "#59A14F"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Etapa A: Cadastrar os Provedores no Painel", "community": 14, "community_name": "⚙️ 6. Gateway OmniRoute", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_etapa_b_criar_o_combo_gratuitos_roteamento_com_fallback", "label": "🔹 Etapa B: Criar Combo 'gratuitos' (Fallback)", "color": {"background": "#59A14F", "border": "#59A14F", "highlight": {"background": "#ffffff", "border": "#59A14F"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Etapa B: Criar o Combo 'gratuitos' (Roteamento com Fallback)", "community": 14, "community_name": "⚙️ 6. Gateway OmniRoute", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "tutorial_agentes_omniroute_etapa_c_fazer_o_teste_de_saúde_no_terminal_antes_de_chamar_o_claude", "label": "🔹 Etapa C: Teste de Saúde no Terminal", "color": {"background": "#59A14F", "border": "#59A14F", "highlight": {"background": "#ffffff", "border": "#59A14F"}}, "size": 13.3, "font": {"size": 0, "color": "#ffffff"}, "title": "Etapa C: Fazer o Teste de Saúde no Terminal (Antes de Chamar o Claude)", "community": 14, "community_name": "⚙️ 6. Gateway OmniRoute", "source_file": "TUTORIAL_AGENTES_OMNIROUTE.md", "file_type": "document", "degree": 1},
      {"id": "script", "label": "script.js", "color": {"background": "#B07AA1", "border": "#B07AA1", "highlight": {"background": "#ffffff", "border": "#B07AA1"}}, "size": 20.0, "font": {"size": 12, "color": "#ffffff"}, "title": "script.js", "community": 6, "community_name": "script.js", "source_file": "script.js", "file_type": "code", "degree": 3}
    ];

    const RAW_EDGES = [
      {"from": "script_loadchecklist", "to": "script_updatechecklistprogress", "label": "calls", "title": "calls [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "script_loadchecklist", "to": "script", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "script_showtoast", "to": "script_updatechecklistprogress", "label": "calls", "title": "calls [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "script_showtoast", "to": "script", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "script_updatechecklistprogress", "to": "script", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_5_chegou_a_hora_pegar_as_chaves_gratuitas_de_api", "to": "tutorial_agentes_omniroute_opção_1_google_gemini_api_100_gratuito_oficial", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_5_chegou_a_hora_pegar_as_chaves_gratuitas_de_api", "to": "tutorial_agentes_omniroute_opção_2_groq_cloud_llama_3_3_ultra_rápido_e_gratuito", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_5_chegou_a_hora_pegar_as_chaves_gratuitas_de_api", "to": "tutorial_agentes_omniroute_agent_lab_roteiro_completo_de_aula_agentes_de_ia_omniroute", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_7_ligar_o_motor_e_rodar_o_claude_code", "to": "tutorial_agentes_omniroute_passo_5_ligar_o_motor_do_omniroute_janela_1", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_7_ligar_o_motor_e_rodar_o_claude_code", "to": "tutorial_agentes_omniroute_passo_6_abrir_a_segunda_janela_e_rodar_o_claude_code_janela_2", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_7_ligar_o_motor_e_rodar_o_claude_code", "to": "tutorial_agentes_omniroute_agent_lab_roteiro_completo_de_aula_agentes_de_ia_omniroute", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute", "to": "tutorial_agentes_omniroute_agent_lab_roteiro_completo_de_aula_agentes_de_ia_omniroute", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_1_as_ferramentas_da_aula_o_que_vamos_usar_hoje", "to": "tutorial_agentes_omniroute_agent_lab_roteiro_completo_de_aula_agentes_de_ia_omniroute", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_2_a_falácia_do_almoço_100_grátis_em_ia_erro_429", "to": "tutorial_agentes_omniroute_a_solução_roteamento_com_fallback_transbordo", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_2_a_falácia_do_almoço_100_grátis_em_ia_erro_429", "to": "tutorial_agentes_omniroute_agent_lab_roteiro_completo_de_aula_agentes_de_ia_omniroute", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_3_regras_de_sobrevivência_no_terminal_antes_de_mexer_no_teclado", "to": "tutorial_agentes_omniroute_agent_lab_roteiro_completo_de_aula_agentes_de_ia_omniroute", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_8_vídeos_e_tutoriais_de_apoio_no_youtube", "to": "tutorial_agentes_omniroute_agent_lab_roteiro_completo_de_aula_agentes_de_ia_omniroute", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_agent_lab_roteiro_completo_de_aula_agentes_de_ia_omniroute", "to": "tutorial_agentes_omniroute_6_como_conectar_os_provedores_criar_o_combo_e_testar_no_omniroute", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_agent_lab_roteiro_completo_de_aula_agentes_de_ia_omniroute", "to": "tutorial_agentes_omniroute_4_mão_na_massa_instalando_ferramentas_e_criando_o_projeto", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_4_mão_na_massa_instalando_ferramentas_e_criando_o_projeto", "to": "tutorial_agentes_omniroute_passo_0_testar_se_o_node_js_e_o_npm_existem_no_computador", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_4_mão_na_massa_instalando_ferramentas_e_criando_o_projeto", "to": "tutorial_agentes_omniroute_passo_1_instalar_o_claude_code_e_o_omniroute", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_4_mão_na_massa_instalando_ferramentas_e_criando_o_projeto", "to": "tutorial_agentes_omniroute_passo_2_criar_a_pasta_do_projeto", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_4_mão_na_massa_instalando_ferramentas_e_criando_o_projeto", "to": "tutorial_agentes_omniroute_passo_3_criar_o_arquivo_de_proteção_gitignore", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_4_mão_na_massa_instalando_ferramentas_e_criando_o_projeto", "to": "tutorial_agentes_omniroute_passo_4_configurar_o_claude_code_para_falar_com_o_omniroute", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_6_como_conectar_os_provedores_criar_o_combo_e_testar_no_omniroute", "to": "tutorial_agentes_omniroute_etapa_a_cadastrar_os_provedores_no_painel", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_6_como_conectar_os_provedores_criar_o_combo_e_testar_no_omniroute", "to": "tutorial_agentes_omniroute_etapa_b_criar_o_combo_gratuitos_roteamento_com_fallback", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"},
      {"from": "tutorial_agentes_omniroute_6_como_conectar_os_provedores_criar_o_combo_e_testar_no_omniroute", "to": "tutorial_agentes_omniroute_etapa_c_fazer_o_teste_de_saúde_no_terminal_antes_de_chamar_o_claude", "label": "contains", "title": "contains [EXTRACTED]", "dashes": false, "width": 2, "color": {"opacity": 0.7}, "confidence": "EXTRACTED"}
    ];

    const LEGEND = [
      {"cid": 0, "color": "#4E79A7", "label": "🔑 5. Chaves Gratuitas de API", "count": 3},
      {"cid": 1, "color": "#F28E2B", "label": "🚀 7. Executar Claude Code", "count": 3},
      {"cid": 6, "color": "#B07AA1", "label": "💻 Frontend Interativo (script.js)", "count": 4},
      {"cid": 12, "color": "#E15759", "label": "📘 Roteiro da Aula (Fundamentos)", "count": 7},
      {"cid": 13, "color": "#76B7B2", "label": "💻 4. Mão na Massa (Instalação)", "count": 6},
      {"cid": 14, "color": "#59A14F", "label": "⚙️ 6. Gateway & Combo de Fallback", "count": 4}
    ];

    function esc(s) {
      return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    const nodesDS = new vis.DataSet(RAW_NODES.map((n, i) => ({
      id: n.id,
      label: n.label,
      color: n.color,
      size: n.size,
      font: n.font,
      title: n.title,
      x: 30 * Math.sqrt(i) * Math.cos(i * 2.4),
      y: 30 * Math.sqrt(i) * Math.sin(i * 2.4),
      _community: n.community,
      _community_name: n.community_name,
      _source_file: n.source_file,
      _file_type: n.file_type,
      _degree: n.degree,
    })));

    const edgesDS = new vis.DataSet(RAW_EDGES.map((e, i) => ({
      id: i,
      from: e.from,
      to: e.to,
      label: '',
      title: e.title,
      dashes: e.dashes,
      width: e.width,
      color: e.color,
      arrows: { to: { enabled: true, scaleFactor: 0.5 } },
    })));

    const network = new vis.Network(container, { nodes: nodesDS, edges: edgesDS }, {
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -60,
          centralGravity: 0.005,
          springLength: 110,
          springConstant: 0.08,
          damping: 0.4,
          avoidOverlap: 0.8,
        },
        stabilization: { iterations: 150, fit: true },
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        hideEdgesOnDrag: true,
        navigationButtons: false,
        keyboard: false,
      },
      nodes: { shape: 'dot', borderWidth: 1.5 },
      edges: { smooth: { type: 'continuous', roundness: 0.2 }, selectionWidth: 3 },
    });

    network.once('stabilizationIterationsDone', () => {
      network.setOptions({ physics: { enabled: false } });
    });

    function showNodeDetails(nodeId) {
      const n = nodesDS.get(nodeId);
      const detailsEl = document.getElementById('graph-node-details');
      if (!n || !detailsEl) return;
      const neighborIds = network.getConnectedNodes(nodeId);
      const neighborItems = neighborIds.map(nid => {
        const nb = nodesDS.get(nid);
        const color = nb ? nb.color.background : '#555';
        return `<div class="graph-neighbor-pill" style="border-left-color:${esc(color)}" data-nid="${esc(nid)}">${esc(nb ? nb.label : nid)}</div>`;
      }).join('');

      detailsEl.innerHTML = `
        <div class="field-title">${esc(n.label)}</div>
        <div class="field-tag" style="background:${esc(n.color.background)}25; color:${esc(n.color.background)}; border:1px solid ${esc(n.color.background)}50;">${esc(n._community_name)}</div>
        <div style="font-size:0.78rem; color:#94a3b8; margin-bottom:0.4rem;"><strong>Arquivo:</strong> ${esc(n._source_file || '-')} &bull; <strong>Tipo:</strong> ${esc(n._file_type || '-')} &bull; <strong>Conexões:</strong> ${n._degree}</div>
        ${neighborIds.length ? `<div style="font-size:0.75rem; color:#cbd5e1; font-weight:600; margin-top:0.6rem;">Conexões Diretas (${neighborIds.length}):</div><div class="graph-neighbors-list">${neighborItems}</div>` : ''}
      `;
    }

    function focusNode(nodeId) {
      network.focus(nodeId, { scale: 1.4, animation: { duration: 500 } });
      network.selectNodes([nodeId]);
      showNodeDetails(nodeId);
    }

    document.addEventListener('click', (e) => {
      const pill = e.target.closest('.graph-neighbor-pill');
      if (pill && pill.dataset.nid) {
        focusNode(pill.dataset.nid);
      }
    });

    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        showNodeDetails(params.nodes[0]);
      } else {
        const detailsEl = document.getElementById('graph-node-details');
        if (detailsEl) {
          detailsEl.innerHTML = '<span class="empty-hint">Clique em um nó do grafo para ver conexões e detalhes.</span>';
        }
      }
    });

    // Search Box Functionality
    const searchInput = document.getElementById('graph-search-input');
    const searchDropdown = document.getElementById('graph-search-dropdown');
    if (searchInput && searchDropdown) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        searchDropdown.innerHTML = '';
        if (!q) {
          searchDropdown.style.display = 'none';
          return;
        }
        const matches = RAW_NODES.filter(n => n.label.toLowerCase().includes(q) || (n.title && n.title.toLowerCase().includes(q))).slice(0, 10);
        if (!matches.length) {
          searchDropdown.style.display = 'none';
          return;
        }
        searchDropdown.style.display = 'block';
        matches.forEach(m => {
          const item = document.createElement('div');
          item.className = 'graph-search-item';
          item.textContent = m.label;
          item.style.borderLeft = `3px solid ${m.color.background}`;
          item.addEventListener('click', () => {
            focusNode(m.id);
            searchDropdown.style.display = 'none';
            searchInput.value = '';
          });
          searchDropdown.appendChild(item);
        });
      });

      document.addEventListener('click', (e) => {
        if (!searchDropdown.contains(e.target) && e.target !== searchInput) {
          searchDropdown.style.display = 'none';
        }
      });
    }

    // Controls
    const fitBtn = document.getElementById('graph-btn-fit');
    if (fitBtn) {
      fitBtn.addEventListener('click', () => {
        network.fit({ animation: { duration: 500 } });
      });
    }

    const card = document.getElementById('graph-container-card');
    const fsBtn = document.getElementById('graph-btn-fullscreen');
    if (fsBtn && card) {
      fsBtn.addEventListener('click', () => {
        card.classList.toggle('fullscreen');
        const isFs = card.classList.contains('fullscreen');
        fsBtn.innerHTML = isFs ? '&#x2715; Sair da Tela Cheia' : '&#x26F6; Tela Cheia';
        setTimeout(() => {
          network.redraw();
          network.fit({ animation: { duration: 400 } });
        }, 150);
      });
    }

    // Communities Legend & Filters
    const hiddenCommunities = new Set();
    const selectAllCb = document.getElementById('graph-select-all');
    const legendEl = document.getElementById('graph-legend-list');

    function updateSelectAllState() {
      if (!selectAllCb) return;
      const total = LEGEND.length;
      const hidden = hiddenCommunities.size;
      selectAllCb.checked = hidden === 0;
      selectAllCb.indeterminate = hidden > 0 && hidden < total;
    }

    if (selectAllCb) {
      selectAllCb.addEventListener('change', () => {
        const hide = !selectAllCb.checked;
        document.querySelectorAll('.graph-legend-item').forEach(item => {
          hide ? item.classList.add('dimmed') : item.classList.remove('dimmed');
        });
        document.querySelectorAll('.graph-legend-cb').forEach(cb => {
          cb.checked = !hide;
        });
        LEGEND.forEach(c => {
          if (hide) hiddenCommunities.add(c.cid);
          else hiddenCommunities.delete(c.cid);
        });
        const updates = RAW_NODES.map(n => ({ id: n.id, hidden: hide }));
        nodesDS.update(updates);
        updateSelectAllState();
      });
    }

    if (legendEl) {
      LEGEND.forEach(c => {
        const item = document.createElement('div');
        item.className = 'graph-legend-item';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'graph-legend-cb';
        cb.checked = true;
        cb.addEventListener('change', (e) => {
          e.stopPropagation();
          if (cb.checked) {
            hiddenCommunities.delete(c.cid);
            item.classList.remove('dimmed');
          } else {
            hiddenCommunities.add(c.cid);
            item.classList.add('dimmed');
          }
          const updates = RAW_NODES
            .filter(n => n.community === c.cid)
            .map(n => ({ id: n.id, hidden: !cb.checked }));
          nodesDS.update(updates);
          updateSelectAllState();
        });

        item.innerHTML = `
          <div class="graph-legend-dot" style="background:${c.color}"></div>
          <span class="graph-legend-label">${esc(c.label)}</span>
          <span class="graph-legend-count">${c.count}</span>
        `;
        item.prepend(cb);
        item.addEventListener('click', (e) => {
          if (e.target === cb) return;
          cb.checked = !cb.checked;
          cb.dispatchEvent(new Event('change'));
        });
        legendEl.appendChild(item);
      });
    }
  }

  initGraphify();
});

