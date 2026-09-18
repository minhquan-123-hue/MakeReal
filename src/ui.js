import { state } from './state.js';
import { buildPlan } from './plan.js';

// Small DOM helper used throughout the UI layer.
// Keeping DOM lookup here avoids scattering query logic across the app.
export const $ = (id) => document.getElementById(id);

export const sections = {
  idea: $('ideaSection'),
  research: $('researchSection'),
  resources: $('resourcesSection'),
  plan: $('planSection'),
};

// Switches the visible project stage and keeps navigation in sync.
export function showSection(name) {
  Object.entries(sections).forEach(([key, element]) => {
    element.classList.toggle('hidden', key !== name);
  });

  document.querySelectorAll('.nav-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.section === name);
  });

  const target = sections[name];
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Escapes user-provided text before placing it into innerHTML.
// This keeps the intentionally simple DOM rendering safe as the app grows.
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Renders the resources currently attached to the project.
// Later this can render resources loaded from persistent storage instead.
export function renderResources() {
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

// Renders the current plan and the next action.
// Planning logic stays outside this function so UI and domain logic remain separate.
export function renderPlan() {
  const steps = buildPlan(state.idea, state.resources);

  $('projectSummary').innerHTML = `
    <h3>${escapeHtml(state.projectName || 'Untitled project')}</h3>
    <p>${escapeHtml(state.idea)}</p>
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

// Finds the first unfinished plan step and presents it as the user's current action.
export function updateNextAction() {
  const steps = [...document.querySelectorAll('[data-step]')];
  const next = steps.findIndex((checkbox) => !checkbox.checked);

  $('nextAction').innerHTML = next === -1
    ? '<p class="eyebrow">YOU MOVED</p><p>All first steps are done. Now record what happened, then let the plan change.</p>'
    : `<p class="eyebrow">NEXT ACTION</p><p>${next + 1}. ${escapeHtml(steps[next].closest('.plan-step').querySelector('h3').textContent.replace(/^\d+\. /, ''))}</p>`;
}
