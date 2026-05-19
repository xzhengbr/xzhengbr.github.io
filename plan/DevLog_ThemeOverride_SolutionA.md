# Developer Log - Theme Override Migration (Solution A)

## Date
2026-05-19

## Goal
Make local and production behavior consistent by avoiding direct edits in `themes/hugo-apero/*` and moving customization to the main repository override paths.

## Background
Some UI changes (header brand text, search icon entry, homepage style adjustments, footer placement behavior) appeared locally but not on the published site.

Root cause:
- Modified files were inside the theme submodule working tree.
- CI/CD deploys the committed superproject state and submodule pointer, not local uncommitted submodule edits.

## Migration Strategy
Use Hugo override precedence:
1. Project `layouts/` overrides theme `layouts/`.
2. Project `assets/custom.scss` appends custom style rules after base theme styles.

No direct dependency on local dirty state in theme submodule.

## Files Added/Updated (Main Repo)

### Added
- `layouts/index.html`
  - Homepage title weight update (`fw7`), image width control, and homepage social wrapper.
- `layouts/partials/header.html`
  - Brand text shown after logo, search icon entry added, and header menu behavior preserved.

### Updated
- `assets/custom.scss`
  - Sticky footer behavior when content is short:
    - `.grid-container { grid-template-rows: auto 1fr auto; min-height: 100vh; }`
  - Brand hover underline animation for `XIN ZHENG`.
  - Homepage social icon size and spacing overrides.

## Why This Works Better
- Deployment-stable: CI always reads these changes directly from the main repository.
- Easier review and commit history: all business-facing customizations live in one repo.
- Lower operational risk for a personal site workflow.

## Trade-offs
- If upstream theme changes the same templates significantly, local overrides may need periodic diff checks.
- Custom style rules can grow over time and need simple organization discipline.

## Validation Performed
- Local build success: `hugo --quiet`
- Lint checks on touched files: no new diagnostics.
- Override paths exist and are resolved by Hugo.

## Follow-up Recommendation
- Keep `themes/hugo-apero/*` untouched for daily development.
- Continue future UI changes in:
  - `layouts/`
  - `assets/custom.scss`
  - `content/`
