document.addEventListener('DOMContentLoaded', () => {
  // Reading Progress Bar
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.pageYOffset / totalHeight) * 100 : 100;
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
        const copyFailed = () => showToast('Não foi possível copiar. Selecione o texto e use Ctrl+C.');
        if (!navigator.clipboard?.writeText) {
          copyFailed();
          return;
        }
        navigator.clipboard.writeText(codeElement.innerText).then(() => {
          btn.textContent = 'Copiado! ✓';
          btn.classList.add('copied');
          showToast('Código copiado para a área de transferência!');

          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
          }, 2000);
        }).catch(copyFailed);
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stepIds));
    } catch (e) {
      console.warn('Não foi possível salvar o checklist:', e);
    }

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
});

