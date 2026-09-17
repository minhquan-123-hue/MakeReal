// Planning domain logic for the MVP.
//
// Why this exists:
// The first plan is deliberately deterministic and local. Keeping the plan
// generation here gives us a clean boundary for a future AI Planner Agent.
// The UI should only render the plan, not decide how a plan is made.

// Creates the first three actions from the user's idea and available resources.
export function buildPlan(idea, resources) {
  const hasPeople = resources.some((resource) => resource.type === 'people');
  const hasAudience = resources.some((resource) => resource.type === 'audience');

  return [
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
}
