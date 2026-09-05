# Project Instructions

## Project memory

- Read `trip.md` before planning, researching, designing, or changing this project. It contains the current trip, fixed bookings, traveler preferences, route logic, and unresolved choices.
- The deployed static website lives in `site/`. Trip content is primarily stored in `site/js/data.js` and rendered through the HTML pages by `site/js/app.js`.
- Treat `pdf/` as original booking evidence. Re-check official sources before changing volatile facts such as schedules, fares, opening hours, construction, entry rules, or baggage policies.

## Mandatory synchronization

- Keep `trip.md` and the deployed website synchronized in every completed modification.
- When any trip fact, itinerary choice, booking, preference, route, or design changes, update both `trip.md` and the relevant source under `site/` in the same commit.
- Do not update only the Markdown brief or only the website. If a change is intentionally non-user-facing, record the maintenance change in `trip.md` and keep the synchronization marker in `site/index.html` current.
- Clearly distinguish confirmed bookings, current plans, optional alternatives, and facts that still require verification.

## Git workflow

- After modifying anything, validate the change, commit all intended project changes, and push the current branch to `origin` before finishing the task.
- Never leave completed work only in the local working tree.
- Use a normal push; do not force-push or rewrite remote history unless the user explicitly requests it.
- If commit or push fails, preserve the local changes and report the exact blocker.
- Before committing, run at least `git diff --check` and a relevant local smoke test when website behavior changed.

## Platform, Layout & Visual Testing

- The site in `site/` serves both the static web deployment and the Capacitor Android app (`com.kevin.eccvtrip`).
- The design is primarily optimized for phone layout, but desktop layout must always remain properly aligned and verified.
- Always use port `8080` (`http://localhost:8080`) when serving the site and inspecting with Playwright/browser tools.
- Every UI or content modification requires a visual check (testing both phone and desktop viewports) before committing.
- Commit and push to remote (`origin`) after completing each page feature.
