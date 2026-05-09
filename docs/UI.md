# UI setup & guidelines

Recommended libraries
---------------------
- shadcn/ui — low-level, accessible React UI primitives (works well with Tailwind)
- DaisyUI — Tailwind plugin with component classes for rapid layouts
- Flowbite / Flowbite React — prebuilt components and patterns for Tailwind

Why these?
----------
- Tailwind-first: all three work directly with Tailwind utility classes and speed up design implementation.
- Mix-and-match: use shadcn/ui for consistent primitives, DaisyUI for form and layout helpers, and Flowbite for ready-made components.

Quick setup (Next.js + Tailwind)
--------------------------------
1. Install Tailwind (if not installed):

```bash
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Install UI libraries:

```bash
pnpm add daisyui flowbite flowbite-react
```

For shadcn/ui, use the init tool which scaffolds components into your app:

```bash
npx shadcn-ui@latest init
```

3. Tailwind config additions (tailwind.config.cjs):

```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/**/*.js'
  ],
  theme: { extend: {} },
  plugins: [require('daisyui'), require('flowbite/plugin')],
}
```

4. Import Flowbite styles in `globals.css` (or your main CSS file):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Flowbite */
@import 'flowbite';
```

5. Using components
- Use `shadcn/ui` components for consistent primitives and accessible patterns.
- Use DaisyUI utility classes (e.g., `btn`, `card`, `input`) for rapid prototyping.
- Use Flowbite React components for complex interactive pieces (modals, dropdowns).

Design notes
------------
- Mobile-first: design components to work well on small screens first.
- Accessibility: prefer accessible primitives (shadcn) for forms and interactive controls.
- Consistency: create a small design token file (colors, spacing, fonts) and use it across components.

Example quick commands
----------------------
Install dependencies and run locally:

```bash
pnpm install
pnpm dev
```
