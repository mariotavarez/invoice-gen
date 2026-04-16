<div align="center">

# InvoiceGen

### Create invoices. Get paid.

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003b57?logo=sqlite&logoColor=white)](https://github.com/WiseLibs/better-sqlite3)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<img src=".github/demo.svg" alt="InvoiceGen demo" width="100%"/>

</div>

---

## Why InvoiceGen?

Most invoice tools are either bloated SaaS products that cost $30/mo for features you never use, or ugly open-source projects that look like they were built in 2008. InvoiceGen is neither.

It's a self-hosted, zero-dependency invoice generator that lives in your repo, stores data in a single SQLite file, and looks like it was designed by Stripe. No accounts. No subscriptions. No cloud.

---

## Features

- **Create & edit invoices** — client details, line items (qty × unit price), due date, notes
- **PDF export** — clean print-CSS layout, one click to Save as PDF from any browser
- **Invoice list** — sortable table with status filtering and quick actions
- **Dashboard KPIs** — total invoiced, paid, outstanding, draft count
- **Status workflow** — Draft → Sent → Paid, with one-click toggles
- **Auto invoice numbering** — `INV-2026-0001` format, auto-incrementing per year
- **Stripe-inspired design** — light typography, blue-tinted shadows, `#533afd` purple accent

---

## Quick Start

```bash
git clone https://github.com/mariotavarez/invoice-gen.git
cd invoice-gen
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The SQLite database is created automatically at `data/invoices.db` on first run. No setup needed.

**Production build:**
```bash
npm run build && npm start
```

**Type check:**
```bash
npx tsc --noEmit
```

---

## How It Works

```
User fills form → Server Action validates inputs
               → nanoid generates INV-2026-XXXX code
               → better-sqlite3 stores invoice + line items

User visits /invoices/[id]/preview → Server Component renders printable layout
                                   → Browser "Print → Save as PDF"

Dashboard → Server Component reads live SQLite data
          → Renders KPI cards + sortable table (0 client fetches)
```

All mutations go through **Next.js Server Actions** — no API routes, no client-side fetch. The SQLite database is a single file at `data/invoices.db` you can back up with `cp`.

---

## Invoice Status Workflow

```
Draft ──→ Sent ──→ Paid
  ↑________________________↓  (revert to draft)
```

One-click transitions from the invoice detail page. Status badge updates server-side with `revalidatePath`.

---

## PDF Export

The `/invoices/[id]/preview` route renders a print-optimized page. Use your browser's built-in **Print → Save as PDF**:

- Navigation and action buttons are hidden via `@media print`
- Line items table expands to full width
- Page margins set to 0.5in for clean output
- Works in Chrome, Safari, Firefox, Edge

---

## Data Model

```sql
CREATE TABLE invoices (
  id           TEXT PRIMARY KEY,   -- INV-2026-0001
  client_name  TEXT NOT NULL,
  client_email TEXT NOT NULL,
  company      TEXT,
  address      TEXT,
  status       TEXT DEFAULT 'draft', -- draft | sent | paid
  due_date     TEXT NOT NULL,
  notes        TEXT,
  created_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE line_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id  TEXT REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity    REAL NOT NULL,
  unit_price  REAL NOT NULL
);
```

---

## Design System

This project uses a **Stripe-inspired design system**. See [DESIGN.md](./DESIGN.md).

Key tokens:
- Primary: `#533afd` (Stripe purple)
- Headings: `#061b31` (deep navy, not black)
- Shadows: `rgba(50,50,93,0.25)` blue-tinted multi-layer
- Nav background: `#1c1e54` (brand dark)
- Radius: 4–8px (no pill shapes)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router + Server Actions | 15 |
| Language | TypeScript strict mode | 5.7 |
| Styling | Tailwind CSS via `@tailwindcss/postcss` | v4 |
| Database | SQLite via `better-sqlite3` | 9 |
| ID generation | `nanoid` (URL-safe codes) | 5 |
| Icons | `lucide-react` | 0.344 |
| Font | Inter via Google Fonts | — |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                # Dark navbar with Stripe branding
│   ├── page.tsx                  # Dashboard — 4 KPI cards + recent invoices
│   ├── invoices/
│   │   ├── page.tsx              # All invoices — sortable table
│   │   ├── new/page.tsx          # Create invoice form
│   │   └── [id]/
│   │       ├── page.tsx          # Detail view + status actions + edit
│   │       └── preview/page.tsx  # Printable PDF-ready layout
├── components/
│   ├── InvoiceForm.tsx           # Controlled form with dynamic line items
│   ├── InvoiceTable.tsx          # Sortable table with delete and status badges
│   ├── PrintableInvoice.tsx      # Clean print layout (hidden nav via @media print)
│   ├── StatusBadge.tsx           # Draft / Sent / Paid badge with color variants
│   ├── StatsCard.tsx             # KPI card with Stripe-purple accent
│   └── LineItemRow.tsx           # Individual line item row with remove button
└── lib/
    ├── db.ts                     # SQLite singleton — WAL mode, schema init, typed queries
    ├── actions.ts                # Server Actions — create, update, delete, status toggle
    └── utils.ts                  # formatCurrency, formatDate, generateInvoiceId
```

---

## License

MIT — use it however you like.
