# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- The editor home, `/editor/[roomId]` workspace shell, and project sharing
  flow are wired to server-loaded project data and API-backed mutations;
  database application verification is pending because the configured local
  Prisma Postgres server is unavailable.

## Current Goal

- Verify the project and collaborator API routes, editor home flows, workspace
  access checks, and Clerk profile enrichment against a running database.

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
- Added the Prisma `ProjectStatus`, `Project`, and `ProjectCollaborator` models
  with the required relations, cascade delete, uniqueness constraint, and
  indexes in `prisma/models/project.prisma`.
- Added the cached Prisma singleton in `lib/prisma.ts`, branching between
  Prisma Accelerate and the direct PostgreSQL driver adapter based on
  `DATABASE_URL`.
- Generated the Prisma 7 client and added the first migration at
  `prisma/migrations/20261111120000_init/migration.sql`.
- Added authenticated project API route handlers for listing and creating
  projects, plus owner-checked rename and delete handlers, from
  `context/feature-specs/06-project-apis.md`.
- Added `lib/project-access.ts` with Clerk identity and owner/collaborator
  access helpers.
- Added the server-checked `/editor/[roomId]` workspace route from
  `context/feature-specs/08-editor-workspace-shell.md`.
- Added the reusable `AccessDenied` state for missing and unauthorized rooms.
- Added the editor workspace shell with the project name navbar, share and AI
  sidebar actions, highlighted current project, canvas placeholder, and AI
  sidebar placeholder.
- Added collaborator API routes for listing, inviting, and removing project
  collaborators with server-side access and owner checks.
- Added Clerk-backed collaborator profile enrichment with email-only fallback
  when a matching Clerk user is unavailable.
- Added the workspace share dialog with project-link copying, collaborator
  lists, owner invite/remove controls, and read-only collaborator access.

## In Progress

- Apply the first migration and exercise the project and collaborator API
  routes, workspace access checks, and share dialog once the configured local
  Prisma Postgres server is running.

## Next Up

- Run `prisma migrate dev` against the configured database and verify `401`,
  `403`, CRUD, owner-scoping, workspace access, collaborator mutations, and
  Clerk profile enrichment behavior.

## Open Questions

- The configured `prisma+postgres` database points to local ports `51213` and
  `51214`, but the local Prisma Postgres server is not running in this
  environment. Migration application must be re-run when it is available.

## Architecture Decisions

- Use shadcn/ui generated primitives with the Base Nova style and Base UI primitives because the specification requires generator-owned `components/ui/*` files.
- Keep theme values as CSS custom properties in `app/globals.css` and expose them through Tailwind theme tokens so all primitives share the dark palette.
- Keep the project sidebar fixed and transform-based so opening it overlays the editor canvas instead of changing the page layout.
- Use Clerk's prebuilt auth and profile flows, with the app's CSS tokens supplied through `ClerkProvider` appearance variables.
- Use `proxy.ts` for Next.js 16 route protection and derive public auth paths from the existing Clerk route environment variables, falling back to `/sign-in` and `/sign-up`.
- Keep project data local and mock-only until a persistence layer is specified; the dialog hook owns all temporary mutations.
- Use Prisma's generated client output under `app/generated/prisma`; use
  `accelerateUrl` for Prisma Accelerate URLs and `PrismaPg` for direct
  PostgreSQL connections.
- Keep workspace authorization in a server-side helper and pass only the
  authorized project context into the interactive client shell.
- Store collaborator email addresses in `ProjectCollaborator` and enrich
  display data at read time through Clerk rather than adding a local user
  table.

- [Decisions made that affect the system design or
  data model — include why the decision was made]

## Session Notes

- On 2026-11-09, the populated design-system specification was implemented. TypeScript verification passes.
- On 2026-11-11, the editor navbar and floating project sidebar were implemented from `02-editor-chrome.md`.
- On 2026-11-11, TypeScript and ESLint verification passed. Production build verification is blocked by the environment being unable to fetch the existing Google-hosted Geist fonts.
- On 2026-11-11, the Clerk authentication feature was implemented from `03-auth.md`.
- On 2026-11-11, TypeScript, ESLint, and the production build passed with Clerk routes and proxy protection enabled.
- On 2026-11-11, the project home and dialog/sidebar actions were implemented from `04-projects-dialouge.md`; TypeScript, ESLint, and production build verification passed.
- On 2026-11-11, the Prisma schema, client singleton, generated client, and
  first migration were implemented from `05-prisma.md`. Schema formatting and
  client generation passed; migration application was blocked by the local
  Prisma Postgres server being unavailable.
- On 2026-11-11, the backend-only project API routes were implemented from
  `06-project-apis.md`; TypeScript compilation and the production build passed.
  ESLint passed with only the existing generated-Prisma unused-directive
  warnings.
- On 2026-11-11, `07-wire-editor-home.md` was implemented: the editor page now
  loads owned and shared projects server-side, the sidebar receives real data,
  and create, rename, and delete actions call the project API. Created project
  room IDs use a slug plus short unique suffix and are used as the project ID;
  successful creation navigates to the workspace route.
- On 2026-11-11, the editor home was made resilient to the unavailable local
  Prisma Postgres service: connection failures now render an explanatory empty
  state instead of crashing the Server Component.
- On 2026-11-11, local `prisma+postgres` URLs were updated to use the direct
  PostgreSQL URL embedded in Prisma Dev's local API key, avoiding the Prisma
  7.10.1 local HTTP connection incompatibility while retaining Accelerate for
  non-local URLs.
- On 2026-11-11, Prisma Dev's base64url API key format was supported alongside
  JWT-shaped Accelerate keys, and the Clerk `UserButton` was gated behind
  `ClerkLoaded` to prevent editor hydration mismatches.
- On 2026-11-11, the editor's uncached Clerk/project read was moved behind a
  route-level `Suspense` boundary to support Next.js 16 Cache Components and
  partial prefetching during navigation.
- On 2026-11-11, the editor route opted out of instant-navigation validation
  because Clerk session reads are request-time authentication data; the route
  remains server-rendered and is allowed to block until that data resolves.
- On 2026-11-11, the `/editor/[roomId]` workspace shell was implemented from
  `08-editor-workspace-shell.md`; TypeScript, ESLint, and the production build
  passed. Runtime database verification remains pending because the local
  Prisma Postgres server is unavailable.
- On 2026-11-11, project sharing was implemented from `09-share-dialog.md`;
  collaborator API routes, Clerk profile enrichment, and owner/read-only share
  dialog behavior were added. TypeScript, ESLint, and the production build
  passed. Runtime database and Clerk verification remains pending because the
  local Prisma Postgres server is unavailable.
