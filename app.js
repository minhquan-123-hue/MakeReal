const state = {
  projectName: '',
  idea: '',
  resources: [],
  completedSteps: new Set(),
};

const $ = (id) => document.getElementById(id);
const sections = {
  idea: $('ideaSection'),
  resources: $('resourcesSection'),
  plan: $('planSection'),
};

function showSection(name) {
  Object.entries(sections).forEach(([key, element]) => {
    element.classList.toggle('hidden', key !== name);
  });
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.section === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderResources() {
  const list = $('resourceList');
  list.innerHTML = state.resources.length
    ? state.resources.map((resource, index) => `
      <div class="resource">
        <div>
          <strong>${escapeHtml(resource.type)}</strong>
          <span>${escapeHtml(resource.value)}</span>
        </div>
        <button class="remove" type="button" data-remove-resource="${index}" aria-label="Remove resource">Remove</button>
      </div>
    `).join('')
    : '<p class="muted">Nothing added yet. Start with whatever you actually have.</p>';
}

function buildPlan() {
  const hasPeople = state.resources.some((r) => r.type === 'people');
  const hasAudience = state.resources.some((r) => r.type === 'audience');
  const idea = state.idea.trim();

  const steps = [
    {
      title: 'Talk to 3 real people',
      description: hasPeople
        ? 'Use the people you already have access to. Ask what problem they have, not whether they like your idea.'
        : 'Find three people who might experience this problem. Ask what they do today and what frustrates them.',
    },
    {
      title: 'Write down what you learned',
      description: 'Capture concrete observations, surprising answers, and anything that changed your assumptions.',
    },
    {
      title: 'Build the smallest test',
      description: hasAudience
        ? 'Put a simple version in front of your existing audience and observe what they actually do.'
        : 'Create the smallest possible test that can produce evidence before you spend significant money or time.',
    },
  ];

  $('projectSummary').innerHTML = `
    <h3>${escapeHtml(state.projectName || 'Untitled project')}</h3>
    <p>${escapeHtml(idea)}</p>
  `;

  $('planList').innerHTML = steps.map((step, index) => `
    <article class="plan-step">
      <input type="checkbox" data-step="${index}" ${state.completedSteps.has(index) ? 'checked' : ''} aria-label="Complete step ${index + 1}" />
      <div>
        <h3>${index + 1}. ${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.description)}</p>
      </div>
    </article>
  `).join('');

  updateNextAction();
}

function updateNextAction() {
  const steps = [...document.querySelectorAll('[data-step]')];
  const next = steps.findIndex((checkbox) => !checkbox.checked);
  $('nextAction').innerHTML = next === -1
    ? '<p class="eyebrow">YOU MOVED</p><p>All first steps are done. Now record what happened, then let the plan change.</p>'
    : `<p class="eyebrow">NEXT ACTION</p><p>${next + 1}. ${escapeHtml(steps[next].closest('.plan-step').querySelector('h3').textContent.replace(/^\d+\. /, ''))}</p>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

$('ideaNext').addEventListener('click', () => {
  const projectName = $('projectName').value.trim();
  const idea = $('ideaInput').value.trim();

  if (!idea) {
    $('ideaInput').focus();
    return;
  }

  state.projectName = projectName || 'My MakeReal Project';
  state.idea = idea;
  showSection('resources');
  renderResources();
});

$('addResource').addEventListener('click', () => {
  const value = $('resourceInput').value.trim();
  if (!value) {
    $('resourceInput').focus();
    return;
  }

  state.resources.push({ type: $('resourceType').value, value });
  $('resourceInput').value = '';
  renderResources();
});

$('resourceNext').addEventListener('click', () => {
  buildPlan();
  showSection('plan');
});

document.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-resource]');
  if (removeButton) {
    state.resources.splice(Number(removeButton.dataset.removeResource), 1);
    renderResources();
  }
});

document.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-step]');
  if (!checkbox) return;
  const index = Number(checkbox.dataset.step);
  if (checkbox.checked) state.completedSteps.add(index);
  else state.completedSteps.delete(index);
  updateNextAction();
});

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.section === 'plan') buildPlan();
    showSection(button.dataset.section);
  });
});

$('resetBtn').addEventListener('click', () => {
  state.projectName = '';
  state.idea = '';
  state.resources = [];
  state.completedSteps = new Set();
  $('projectName').value = '';
  $('ideaInput').value = '';
  $('resourceInput').value = '';
  renderResources();
  showSection('idea');
});

renderResources();
