# Business Starter UI redesign — HeroUI + WYSIWYG

Context: React 18 + Vite + Express + sql.js app (PLAN-BUILDER). Current UI = plain inline-styled JSX, raw <textarea> per section field, sections I-X per plan. PIN-auth. Serve :3001 via launchd (com.business-starter.server). Working dir: THIS repo.

## Goal
1) Install + wire @heroui/react (install Tailwind v4 too — HeroUI requires it + framer-motion) and REDESIGN the app shell:
   - Modern dark fintech look (fleet pattern: #0d1012 page, #14181b surfaces, #4c9ffe accent, rounded cards, subtle borders #232a2f)
   - HeroUI components: Card, Button, Input, Textarea, Select, Tabs, Progress, Chip for statuses, Navbar for top nav; keep ALL existing functionality working (AuthGate PIN, AI Draft (Ollama glm-5.3-flash:cloud), section tabs I-X, Print/export, OfflineIndicator, ThemeToggle)
   - Section pages: replace the raw textarea FIELD pattern with a polished layout: GroupTitle section headers + field cards, hint text under fields, sticky save indicator, autosaved state preserved
2) WYSIWYG editor: install @tiptap/core + @tiptap/starter-kit + @tiptap/react (MIT, free). Create a shared <RichText value onChange> component: bold/italic/underline/h2/h3/lists/links toolbar (floating menu or fixed top toolbar), placeholder via @tiptap/extension-placeholder, stored as HTML string. Migrate EVERY textarea field that takes long-form plan text (the main 'content' body fields) to the RichText editor; keep short single-line fields as text inputs. DB stores HTML — on RENDER (read view), output sanitized rich HTML (DOMPurify / isomorphic-dompurify) not plain text. Keep backwards compat with existing plaintext contents (render as-is if no HTML tags).
3) Do NOT change: server/index.js API contracts, sql.js data schema, AI-draft server logic. Frontend-only redesign + editor + render pipeline. Keep reset-pin.mjs working.
4) Quality gates: npm run build zero-errors; vitest passes (adapt tests where UI changed — same behavioral contracts); Playwright smoke (use grocery-tracker's node_modules playwright if needed): open app, PIN-gate flow, open each tab I-X, verify editor mounts, no console/pageerror, screenshot list+editor+summary views.

## Deliverables
- Redesigned app: HeroUI-based, dark sleek, all 10 sections using RichText where appropriate
- package.json updated (heroui, tailwind v4 via @tailwindcss/vite, framer-motion, tiptap, isomorphic-dompurify)
- Screenshots: /tmp/bs_v3_list.png, /tmp/bs_v3_editor.png, /tmp/bs_v3_summary.png
- Commit to git (feat: heroui redesign + tiptap wysiwyg) but DON'T push. DO NOT restart the launchd service — the user handles that.

## Notes / known gotchas (do not violate)
- sql.js persist path is debounced-atomic (commit 066b0ac) — do not touch persist logic
- React TDZ crash class fixed before (commit e858e22): useCallback/useEffect ordering matters — declare callbacks before effects that reference them
- HeroUI Card has NO default horizontal padding — set px-5 / px-4 pt-4 pb-4 explicitly on cards
- The PIN gate is AuthGate.jsx wrapping App — keep its behavior identical (PIN setup + verify flows)