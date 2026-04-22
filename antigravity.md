# Antigravity - Markdown Documentation Standards

## Purpose
Ensure consistent, scalable, and maintainable documentation aligned with enterprise SaaS architecture.

## Structure
- Exactly one H1 per file
- Ordered flow: Overview → Architecture → Implementation → Usage → Notes
- Use H2/H3 for hierarchy
- Keep sections logically isolated

## Naming Conventions
- File names: kebab-case (`auth-flow.md`, `login-ui.md`)
- No spaces or special characters
- Match feature/module naming from codebase

## Content Rules
- Direct, technical language only
- No redundancy or filler
- No conversational tone
- Every line must add value

## Formatting
- Use bullet lists for rules/steps
- Use numbered lists for sequences
- Inline code for paths, variables, functions
- No decorative formatting

## Code Blocks
- Mandatory language tagging (`ts`, `tsx`, `bash`, `json`, `scss`)
- Keep examples minimal and production-relevant
- No pseudo-code unless unavoidable

## Links
- Use relative paths for internal references
- Avoid external links unless necessary

## Consistency
- Terminology must match codebase (features, services, hooks, etc.)
- Follow project architecture and folder structure
- Align with established naming and design patterns

## Architecture Alignment
- Feature-based structure only
- Reference modules using aliases (`@features`, `@components`)
- Do not expose internal file paths of features
- Respect barrel exports

## UI Documentation Rules
- Document states: default, loading, error, empty, disabled
- Include accessibility notes (aria roles, labels)
- Reference Storybook stories for visual states

## Testing Documentation
- Mention test coverage expectations (≥95%)
- Document edge cases and failure scenarios
- Align with Jest + Testing Library practices

## Security Notes
- No secrets, tokens, or credentials in docs
- Avoid unsafe patterns (eval, innerHTML, etc.)
- Follow secure coding references from project

## Restrictions
- No emojis
- No explanations of obvious code
- No duplicated sections
- No speculative or unverified content

## Maintenance
- Update documentation with every code change
- Remove outdated sections immediately
- Keep docs tightly coupled with implementation