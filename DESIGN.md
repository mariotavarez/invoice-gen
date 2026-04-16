# Design System Inspired by Stripe

> Source: [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/stripe)
> Generated with: `npx getdesign@latest add stripe`

## Colors

| Token | Value | Use |
|---|---|---|
| `--color-brand` | `#533afd` | Primary CTA, links, active states |
| `--color-heading` | `#061b31` | All headings — deep navy, not black |
| `--color-body` | `#64748d` | Body text, descriptions |
| `--color-label` | `#273951` | Form labels, secondary headings |
| `--color-success` | `#15be53` | Success, paid status |
| `--color-border` | `#e5edf5` | Card borders, dividers |
| `--color-brand-dark` | `#1c1e54` | Dark section backgrounds |
| `--color-brand-hover` | `#4434d4` | Hover on primary buttons |

## Typography

- Font family: `Inter`, fallback `-apple-system, sans-serif`
- **Signature**: weight 300 for headings (light = confidence)
- Display/hero: 48px, weight 300, letter-spacing -0.96px
- Section headings: 32px, weight 300, letter-spacing -0.64px
- Body: 16px, weight 400, line-height 1.4

## Shadows

Multi-layer blue-tinted:
```
rgba(50,50,93,0.25) 0px 13px 27px -5px, rgba(0,0,0,0.1) 0px 8px 16px -8px
```

## Borders & Radius
- Cards: `1px solid #e5edf5`, radius 6px
- Buttons: radius 4px
- Nothing pill-shaped, nothing harsh

## Buttons
- Primary: bg `#533afd`, white text, radius 4px, padding 8px 16px
- Ghost: transparent, `#533afd` text, border `1px solid #b9b9f9`
- Hover primary: `#4434d4`
