# Understanding the Grid Layout

## The Two-Level Grid System

### Level 1: Main Container Grid (2 columns)

```
.container {
    display: grid;
    grid-template-columns: 2fr 1fr;
}
```

**What this means:**
- `display: grid` - Turn this into a grid container
- `grid-template-columns: 2fr 1fr` - Create 2 columns
  - First column gets 2 "fractions" (2/3 of space) = 66.67%
  - Second column gets 1 "fraction" (1/3 of space) = 33.33%

**Visual representation:**
```
┌─────────────────────────────┬──────────────┐
│                             │              │
│    Column 1 (2fr)          │ Column 2(1fr)│
│    Products Section         │ Cart Section │
│    Takes 2/3 width         │ Takes 1/3    │
│                             │              │
└─────────────────────────────┴──────────────┘
```

**Placing items in the grid:**
```css
.products-section {
    grid-column: 1;  /* Put me in column 1 */
}

.cart-section {
    grid-column: 2;  /* Put me in column 2 */
}
```

### Level 2: Products Grid (3 columns)

Inside the products-section, we have ANOTHER grid for the product cards:

```css
.products-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* or: repeat(3, 1fr) - same thing */
}
```

**What this means:**
- Creates 3 equal columns
- Each column gets 1 fraction (1/3 of space each)

**Visual representation:**
```
┌────────────┬────────────┬────────────┐
│            │            │            │
│  Product 1 │ Product 2  │ Product 3  │
│            │            │            │
├────────────┼────────────┼────────────┤
│            │            │            │
│  Product 4 │ Product 5  │ Product 6  │
│            │            │            │
└────────────┴────────────┴────────────┘
```

## Grid Lines vs Grid Tracks

**IMPORTANT CONCEPT:**

When you have 2 columns, you have 3 grid lines:

```
     Line 1      Line 2       Line 3
        │           │            │
        │  Col 1    │   Col 2    │
        │           │            │
```

**Grid Column Syntax:**
- `grid-column: 1` means "put me in column 1"
- `grid-column: 2` means "put me in column 2"
- `grid-column: 1 / 3` means "start at line 1, end at line 3" (spans both columns)

## Common Mistakes

❌ **WRONG:**
```css
/* Your container only has 2 columns */
grid-template-columns: 2fr 1fr;

/* But you're trying to put something in column 3! */
.products-section {
    grid-column: 3 / 4;  /* Column 3 doesn't exist! */
}
```

✅ **CORRECT:**
```css
/* Container has 2 columns */
grid-template-columns: 2fr 1fr;

/* Put products in column 1 */
.products-section {
    grid-column: 1;
}

/* Put cart in column 2 */
.cart-section {
    grid-column: 2;
}
```

## Responsive Breakpoints

We adjust the layout at different screen sizes:

### Mobile (< 768px): Stack everything
```css
.container {
    grid-template-columns: 1fr;  /* One column */
}
/* Products on top, cart below */
```

### Tablet/Desktop (≥ 768px): Side by side
```css
.container {
    grid-template-columns: 2fr 1fr;  /* Two columns */
}
```

### Products Grid Responsive:
- Small mobile: 1 column
- Large mobile: 2 columns
- Tablet with sidebar: 2 columns (less space available)
- Desktop: 3 columns

## Summary

1. **Container Grid** = 2 columns (products area + cart sidebar)
2. **Products Grid** = 3 columns of cards (inside products area)
3. Use `grid-column` to place items
4. Use media queries to make it responsive
5. Remember: grid lines are numbered, not just columns!
