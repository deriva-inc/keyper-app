# Agent Constitution & Project Guidelines

You are an expert software engineer working on this repository. Adhere strictly to the operational boundaries, technical invariants, and routing rules below.

---

## 1. Core Technical Invariants
- **Frontend:** Always write code in **React**, **TypeScript (strict)**, and **Tailwind CSS**. Adhere to semantic mappings and design tokens from `@aion-intelligence/genesis` and `@/public/styles`.
- **Animation:** Use `motion/react` (Framer Motion) or `gsap`. Keep animations subtle, performant, and lightweight—never introduce heavy visual bloat.
- **Package Manager:** Use `pnpm` exclusively. Never run `npm` or `yarn`.

---

## 2. Terminal & Tool Execution Guardrails
- **Destructive Actions:** Always prompt for explicit confirmation before running destructive operations (`rm -rf`, dropping tables, git resets, pruning volumes).
- **Git Cleanliness:** Never commit directly to `main` or `master`. Verify working tree changes with `git status` before staging. Adhere to trunk-based development with short-lived feature branches and atomic commits.

---

## 3. Communication & Code Quality Standards
- **No Fluff:** Be concise, direct, and technical. Skip conversational filler, pleasantries, or robotic summaries.
- **Surgical Refactoring:** When editing code:
    - Preserve core logic, intent, and developer voice.
    - Improve readability, type safety, and vocabulary without over-engineering.
    - Do NOT rewrite an entire module from scratch unless explicitly requested.
- **Quality Verification:** Always verify changes before marking tasks complete:
    - Type check: `pnpm tsc --noEmit`
    - Lint check: `pnpm lint`
    - Tests: `pnpm test` (following TDD red-green-refactor loop)

---

## 4. Procedural Skills & Playbooks
Consult and execute the canonical playbooks under `.agent/skills/` based on the operational context:

- **[Coding Format](.agent/skills/coding-format/SKILL.md):** Repository-wide code conventions, 4-space indentation, strict TypeScript, import hierarchy, and feature-based folder architecture. Use this skill to create new files and also refactor old ones.
- **[Test-Driven Development](.agent/skills/test-driven-development/SKILL.md):** Red-Green-Refactor cycle, test pyramid standards, and the Prove-It bug reproduction pattern before changing logic.
- **[Browser Testing with DevTools](.agent/skills/browser-testing-with-devtools/SKILL.md):** Real-browser runtime validation via Chrome DevTools MCP (DOM inspection, console zero-error standard, network tracking, and visual screenshots).
- **[Debugging & Error Recovery](.agent/skills/debugging-and-error-recovery/SKILL.md):** Systematic root-cause debugging (Stop-the-Line rule and the 6-step triage checklist: Reproduce, Localize, Reduce, Fix Root Cause, Guard, Verify).
- **[Git Workflow & Versioning](.agent/skills/git-workflow-and-versioning/SKILL.md):** Branch naming, atomic commit discipline, merge conflict resolution, clean PR preparation, and semantic release versioning.
- **[Documentation & ADRs](.agent/skills/documentation-and-adr/SKILL.md):** Documenting architectural decisions in ADRs under `docs/decisions/`, JSDoc API comments, and recording non-obvious design trade-offs.
- **[Design with Elementa](.agent/skills/design-with-elementa/SKILL.md):** Foundational guidelines for Elementa design tokens, semantic mappings, typography, component usage, and UI patterns. This is the most important skill when thinking of UI and UX from deriva's designer's perspective. Always consult [learnings-from-past.md](.agent/skills/design-with-elementa/learnings-from-past.md) before designing, append new learnings once a design is finalized, and keep [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) synchronized whenever `design-with-elementa/SKILL.md` updates.

---

## 5. Documentation Routing & Reference Map

Before writing architecture, UI components, or complex workflows, consult the following sources of truth:

- **Domain Feature Files:** Check feature-level specifications under `docs/` before altering domain logic.
- **Architecture Decisions:** Read existing ADRs in `docs/decisions/` before introducing new libraries or changing core design patterns.
