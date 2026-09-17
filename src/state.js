// Central application state for the MVP.
//
// Why this exists:
// Keeping state in one small module makes it easier to replace the
// in-memory state with persistent storage later without coupling the UI
// to a database implementation.
const STORAGE_KEY = 'makeReal.project.v1';

export const state = {
  projectName: '',
  idea: '',
  resources: [],
  completedSteps: new Set(),
};

export function serializeState() {
  return {
    projectName: state.projectName,
    idea: state.idea,
    resources: state.resources,
    completedSteps: [...state.completedSteps],
  };
}

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeState()));
  } catch (error) {
    console.warn('Unable to save MakeReal project state:', error);
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return false;

    state.projectName = typeof parsed.projectName === 'string' ? parsed.projectName : '';
    state.idea = typeof parsed.idea === 'string' ? parsed.idea : '';
    state.resources = Array.isArray(parsed.resources) ? parsed.resources : [];
    state.completedSteps = new Set(Array.isArray(parsed.completedSteps) ? parsed.completedSteps : []);

    return true;
  } catch (error) {
    console.warn('Unable to load MakeReal project state:', error);
    return false;
  }
}

// Resets the current project back to its initial state.
// The UI calls this instead of knowing how every state field is stored.
export function resetState() {
  state.projectName = '';
  state.idea = '';
  state.resources = [];
  state.completedSteps = new Set();

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear MakeReal project state:', error);
  }
}
