# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete

## Current Goal

- Implement the project home and dialogs defined in `context/feature-specs/04-projects-dialouge.md`.

## Completed

- Configured shadcn/ui with the Base Nova style and Tailwind CSS v4.
- Added generated Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea primitives.
- Installed `lucide-react` and the primitive dependencies.
- Added the reusable `cn()` helper in `lib/utils.ts`.
- Added dark-only theme tokens and global styling in `app/globals.css`.
- Added the reusable `EditorNavbar` with sidebar toggle states and left, center, and right sections.
- Added the floating, animated `ProjectSidebar` with project tabs, empty states, close control, and New Project action.
- Wired the editor chrome into the home screen without pushing the editor canvas when the sidebar opens.
- Added the reusable `EditorDialogContent` pattern for token-based dialog title, description, body, and footer actions without creating an actual dialog flow.
- Installed `@clerk/ui` for the Clerk dark theme and shadcn-compatible styling.
- Wrapped the app with `ClerkProvider` and mapped Clerk appearance variables to the existing CSS tokens.
- Added responsive sign-in and sign-up pages with minimal two-panel desktop layouts and form-only mobile layouts.
- Added root auth redirects and a Next.js 16 `proxy.ts` that protects all non-auth routes.
- Added the Clerk `UserButton` to the editor navbar for profile settings and logout.
- Added the editor home empty state with project creation guidance and a New Project action.
- Added a dedicated `useProjectDialogs` hook for mock projects, dialog state, form state, loading state, and local actions.
- Added Create Project, Rename Project, and Delete Project dialogs with live slug preview, autofocus, Enter submission, and destructive confirmation styling.
- Added owned-project rename/delete actions while keeping shared-project rows read-only.
- Added a mobile sidebar backdrop scrim that closes the sidebar when tapped outside.

## In Progress

- None.

## Next Up

- Build the next feature specified after projects and dialogs.

## Open Questions

- None for the projects and dialogs foundation.

## Architecture Decisions

- Use shadcn/ui generated primitives with the Base Nova style and Base UI primitives because the specification requires generator-owned `components/ui/*` files.
- Keep theme values as CSS custom properties in `app/globals.css` and expose them through Tailwind theme tokens so all primitives share the dark palette.
- Keep the project sidebar fixed and transform-based so opening it overlays the editor canvas instead of changing the page layout.
- Use Clerk's prebuilt auth and profile flows, with the app's CSS tokens supplied through `ClerkProvider` appearance variables.
- Use `proxy.ts` for Next.js 16 route protection and derive public auth paths from the existing Clerk route environment variables, falling back to `/sign-in` and `/sign-up`.
- Keep project data local and mock-only until a persistence layer is specified; the dialog hook owns all temporary mutations.

- [Decisions made that affect the system design or
  data model — include why the decision was made]

## Session Notes

- On 2026-11-09, the populated design-system specification was implemented. TypeScript verification passes.
- On 2026-11-11, the editor navbar and floating project sidebar were implemented from `02-editor-chrome.md`.
- On 2026-11-11, TypeScript and ESLint verification passed. Production build verification is blocked by the environment being unable to fetch the existing Google-hosted Geist fonts.
- On 2026-11-11, the Clerk authentication feature was implemented from `03-auth.md`.
- On 2026-11-11, TypeScript, ESLint, and the production build passed with Clerk routes and proxy protection enabled.
- On 2026-11-11, the project home and dialog/sidebar actions were implemented from `04-projects-dialouge.md`; TypeScript, ESLint, and production build verification passed.
