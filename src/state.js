// Central application state for the MVP.
//
// Why this exists:
// Keeping state in one small module makes it easier to replace the
// in-memory state with persistent storage later without coupling the UI
// to a database implementation.
export const state = {
  projectName: '',
  idea: '',
  resources: [],
  completedSteps: new Set(),
};

// Resets the current project back to its initial state.
// The UI calls this instead of knowing how every state field is stored.
export function resetState() {
  state.projectName = '';
  state.idea = '';
  state.resources = [];
  state.completedSteps = new Set();
}
