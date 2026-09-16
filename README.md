# MakeReal

> **MAKE REAL — Try ideas. Learn from failure. Build better.**
>
> **MakeReal does not try to eliminate failure. It tries to make failure cheap, useful, and learnable.**
>
> **Don't avoid failure. Make failure useful.**

MakeReal helps people turn an idea into a real next step using the resources they already have.

The product is built around a simple belief: an idea becomes clearer through action. Instead of trying to predict everything before starting, MakeReal helps someone make a small move, collect evidence, learn, and change the plan.

## Core loop

```text
IDEA
  ↓
WHAT DO I HAVE?
  ↓
SMALL TEST
  ↓
ACTION
  ↓
EVIDENCE
  ↓
LEARN
  ↓
UPDATE THE PLAN
  ↓
REPEAT
```

The MVP currently exposes a deliberately small version of that loop:

```text
Idea → Resources → First Plan → Action
```

## Product principles

- **Action over prediction.** Help the user make the next useful move.
- **Reality over assumptions.** Start from the resources the user actually has.
- **Small experiments over expensive commitments.** Learn before scaling effort.
- **Failure is information.** A failed test should produce something useful to learn from.
- **Progressive disclosure.** Do not overwhelm users with the whole business-building problem at once.
- **Simple before clever.** Keep the product understandable and easy to extend.

## UI direction

MakeReal uses a premium **black + warm yellow** visual language:

- Deep black surfaces and high-contrast typography.
- Warm yellow for actions, important signals, and the MakeReal identity.
- Subtle borders, glow, grain, and depth instead of heavy decoration.
- Floating labels and small directional elements to make the interface feel alive.
- Motion is restrained and respects `prefers-reduced-motion`.
- Responsive layouts work from desktop down to small screens.

The visual language is inspired by modern idea-validation products, but the product identity and interaction model remain MakeReal's own.

## Architecture

The current application is intentionally dependency-light:

```text
index.html   → structure and product flow
style.css    → design system, responsive UI, motion
app.js       → client-side state and interactions
README.md    → product and engineering context
```

There is no framework, database, or AI dependency in the MVP. This is intentional. The first job is to validate the core product loop with real people before adding infrastructure.

### Extending the product

When the product grows, keep the current boundaries clear:

1. **UI layer** renders state and collects user actions.
2. **Product state** owns the current idea, resources, plan, and progress.
3. **Future services** can provide persistence, research, AI assistance, or analytics without changing the core loop.
4. **Design tokens and reusable components** should remain centralized in `style.css` as the interface grows.

Avoid introducing a framework or abstraction merely for scale that the product does not yet need.

## Safety and maintainability

The MVP is client-side and does not send user-entered idea/resource data to a server.

When extending it:

- Keep user-generated text escaped before inserting it into HTML.
- Do not put secrets or API keys in client-side JavaScript.
- Keep external integrations behind small, replaceable service boundaries.
- Validate data at integration boundaries.
- Prefer explicit state transitions over hidden side effects.
- Preserve existing behavior unless a change is intentional and tested.
- Keep UI changes independent from future persistence or AI providers where practical.

## Run locally

No build step is required.

Open `index.html` directly in a browser, or serve the directory with any static HTTP server.

For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Current scope

The prototype supports:

- Creating an idea/project.
- Adding resources already available to the builder.
- Generating a small first plan based on those resources.
- Marking plan steps complete.
- Showing the next action.
- Resetting the current project.

## Next product layer

After testing the loop with real users, the next layers can be added incrementally:

- Persistent projects.
- Evidence and learning journal.
- Research assistance.
- AI-assisted clarification and planning.
- Resource gap discovery.
- Plan updates based on evidence.
- Collaboration and community contribution.

The core principle should remain unchanged:

> **Don't avoid failure. Make failure useful.**
