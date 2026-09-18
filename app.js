import { state, resetState, loadState, saveState } from './src/state.js';
import { $, showSection, renderResources, renderPlan, updateNextAction } from './src/ui.js';

const researchQuestions = [
  {
    key: 'tools',
    question: 'Công cụ nghiên cứu?',
    placeholder: 'Ví dụ: Google, LinkedIn, khảo sát, landing page, community, báo cáo ngành, ...',
  },
  {
    key: 'customer',
    question: 'KH là ai, họ cần gì?',
    placeholder: 'Mô tả nhóm khách hàng, vấn đề họ đang gặp và điều họ đang cần giải quyết.',
  },
  {
    key: 'legal',
    question: 'Pháp lý tại local?',
    placeholder: 'Các ràng buộc pháp lý, giấy phép, quy định, bảo mật, hoặc điều kiện vận hành ở địa phương là gì?',
  },
  {
    key: 'knowledgeAndResources',
    question: 'Kiến thức và vật chất tài nguyên cần và đã có?',
    placeholder: 'Bạn cần gì về kỹ năng, công nghệ, thời gian, tiền, thiết bị, hoặc quan hệ để làm việc này?',
  },
  {
    key: 'competition',
    question: 'Đối thủ đã giải pháp gì rồi?',
    placeholder: 'Bạn có thấy những giải pháp hiện có không? Họ làm gì tốt, làm gì chưa tốt?',
  },
  {
    key: 'distribution',
    question: 'KH tìm mình ở đâu?',
    placeholder: 'Nơi nào người dùng đang sống, tìm kiếm, thảo luận hoặc mua hàng?',
  },
  {
    key: 'risks',
    question: 'Rủi ro là gì?',
    placeholder: 'Rủi ro kỹ thuật, tâm lý, tài chính, thị trường, hoặc vận hành mà bạn cần đối mặt?',
  },
  {
    key: 'test',
    question: 'Test sản phẩm như thế nào?',
    placeholder: 'Bạn sẽ test sản phẩm/ý tưởng bằng cách nào để thu thập bằng chứng nhanh nhất?',
  },
];

function hydrateUiFromState() {
  $('projectName').value = state.projectName;
  $('ideaInput').value = state.idea;

  researchQuestions.forEach(({ key }) => {
    const input = document.querySelector(`[data-research-key="${key}"]`);
    if (input) input.value = state.researchAnswers[key] || '';
  });

  if (state.idea || state.resources.length > 0) {
    renderResources();
    if (state.idea) {
      renderPlan();
    }
  } else {
    renderResources();
  }
}

function collectResearchAnswers() {
  return researchQuestions.reduce((acc, { key }) => {
    const input = document.querySelector(`[data-research-key="${key}"]`);
    acc[key] = input ? input.value.trim() : '';
    return acc;
  }, {});
}

function renderResearchForm() {
  const form = $('researchForm');
  if (!form) return;

  form.innerHTML = researchQuestions.map(({ key, question, placeholder }) => `
    <div class="research-question">
      <label for="research-${key}">${question}</label>
      <textarea id="research-${key}" data-research-key="${key}" rows="4" placeholder="${placeholder}">${state.researchAnswers[key] || ''}</textarea>
    </div>
  `).join('');
}

// Idea stage: capture the user's rough idea before asking for resources.
$('ideaNext').addEventListener('click', () => {
  const projectName = $('projectName').value.trim();
  const idea = $('ideaInput').value.trim();

  if (!idea) {
    $('ideaInput').focus();
    return;
  }

  state.projectName = projectName || 'My MakeReal Project';
  state.idea = idea;
  saveState();
  renderResearchForm();
  showSection('research');
});

$('researchNext').addEventListener('click', () => {
  state.researchAnswers = collectResearchAnswers();
  saveState();
  showSection('resources');
  renderResources();
});

document.addEventListener('input', (event) => {
  const target = event.target.closest('[data-research-key]');
  if (!target) return;

  const key = target.dataset.researchKey;
  state.researchAnswers[key] = target.value.trim();
  saveState();
});

// Resource stage: add a real resource the user can use right now.
$('addResource').addEventListener('click', () => {
  const value = $('resourceInput').value.trim();
  if (!value) {
    $('resourceInput').focus();
    return;
  }

  state.resources.push({ type: $('resourceType').value, value });
  $('resourceInput').value = '';
  saveState();
  renderResources();
});

// Move from resources to the first executable plan.
$('resourceNext').addEventListener('click', () => {
  renderPlan();
  saveState();
  showSection('plan');
});

// Event delegation lets dynamically rendered resource buttons work without
// attaching a new listener every time the resource list is rendered.
document.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-resource]');
  if (!removeButton) return;

  state.resources.splice(Number(removeButton.dataset.removeResource), 1);
  saveState();
  renderResources();
});

// Completion state belongs to the application state, not to the DOM checkbox.
document.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-step]');
  if (!checkbox) return;

  const index = Number(checkbox.dataset.step);
  if (checkbox.checked) state.completedSteps.add(index);
  else state.completedSteps.delete(index);

  saveState();
  updateNextAction();
});

// Navigation is intentionally small in the MVP. As more stages arrive,
// this can become a dedicated router without changing the domain modules.
document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.section === 'plan') renderPlan();
    if (button.dataset.section === 'research') renderResearchForm();
    showSection(button.dataset.section);
  });
});

// Reset delegates state ownership to the state module, then clears the UI.
$('resetBtn').addEventListener('click', () => {
  resetState();
  $('projectName').value = '';
  $('ideaInput').value = '';
  $('resourceInput').value = '';
  renderResearchForm();
  renderResources();
  showSection('idea');
});

// Load persisted project before the initial render.
const hasSavedState = loadState();
if (hasSavedState) {
  hydrateUiFromState();
} else {
  renderResearchForm();
  renderResources();
}
