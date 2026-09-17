import { state, resetState } from './src/state.js';
import { $, showSection, renderResources, renderPlan, updateNextAction } from './src/ui.js';

// app.js is the application entry point.
//
// Its job is orchestration: connect user events to state, domain logic,
// and rendering. Keeping this file thin gives future features a clear home
// without turning the browser entry point into one large file.

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
  showSection('resources');
  renderResources();
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
  renderResources();
});

// Move from resources to the first executable plan.
$('resourceNext').addEventListener('click', () => {
  renderPlan();
  showSection('plan');
});

// Event delegation lets dynamically rendered resource buttons work without
// attaching a new listener every time the resource list is rendered.
document.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-resource]');
  if (!removeButton) return;

  state.resources.splice(Number(removeButton.dataset.removeResource), 1);
  renderResources();
});

// Completion state belongs to the application state, not to the DOM checkbox.
document.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-step]');
  if (!checkbox) return;

  const index = Number(checkbox.dataset.step);
  if (checkbox.checked) state.completedSteps.add(index);
  else state.completedSteps.delete(index);
  updateNextAction();
});

// Navigation is intentionally small in the MVP. As more stages arrive,
// this can become a dedicated router without changing the domain modules.
document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.section === 'plan') renderPlan();
    showSection(button.dataset.section);
  });
});

// Reset delegates state ownership to the state module, then clears the UI.
$('resetBtn').addEventListener('click', () => {
  resetState();
  $('projectName').value = '';
  $('ideaInput').value = '';
  $('resourceInput').value = '';
  renderResources();
  showSection('idea');
});

// Initial render keeps the empty resource state visible on first load.
renderResources();
