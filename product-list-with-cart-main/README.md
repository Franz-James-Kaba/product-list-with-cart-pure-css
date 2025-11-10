# Frontend Mentor - Product list with cart solution

This is a solution to the [Product list with cart challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/product-list-with-cart-5MmqLVAp_d). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [Key Features](#key-features)
  - [Project Structure](#project-structure)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Add items to the cart and remove them
- Increase/decrease the number of items in the cart
- See an order confirmation modal when they click "Confirm Order"
- Reset their selections when they click "Start New Order"
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Links

- Solution URL: [GitHub Repository](https://github.com/Franz-James-Kaba/product-list-with-cart-pure-css)
- Live Site URL: [View Live Site](https://franz-james-kaba.github.io/product-list-with-cart-pure-css/)

## My process

### Built with

- **Semantic HTML5 markup** - Clean, accessible HTML structure
- **CSS custom properties** - For consistent theming and colors
- **Flexbox** - For component layouts
- **CSS Grid** - Two-level grid system for responsive product layout
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JavaScript implementation
- **LocalStorage API** - For cart persistence across sessions
- **Mobile-first workflow** - Responsive design from 375px to 1440px+

### Key Features

**Pure Vanilla Implementation**
- No frameworks or build tools required
- Zero dependencies - runs directly in the browser
- Just open `index.html` to run the project

**Cart Management**
- Dynamic cart state management with LocalStorage persistence
- Real-time cart updates and total calculations
- Quantity controls with increment/decrement buttons
- Visual feedback when items are in cart (border highlight, opacity change)

**Responsive Grid System**
- Mobile (<480px): 1-column layout
- Large mobile (≥480px): 2-column layout
- Tablet (≥768px): 2-column products + sticky cart sidebar
- Desktop (≥1024px): 3-column products + sticky cart sidebar

**Accessibility**
- ARIA labels and roles throughout
- Semantic HTML structure
- Keyboard support (ESC to close modal)
- Screen reader friendly

### Project Structure

```
├── index.html              # Main HTML file
├── styles.css              # All styling (635 lines)
├── app.js                  # JavaScript logic (473 lines)
├── data.json               # Product data
├── assets/
│   ├── fonts/              # Red Hat Text font family
│   └── images/             # Product images and icons
├── design/                 # Reference designs
└── README.md
```

**JavaScript Architecture**
- State management with `products` and `cart` arrays
- Event-driven cart operations
- Dynamic DOM rendering
- Modal management with overlay

**CSS Organization**
- CSS custom properties for design tokens
- Component-based styling
- Smooth transitions and hover states
- Mobile-first media queries

## Author

- Frontend Mentor - [@Franz-James-Kaba](https://www.frontendmentor.io/profile/Franz-James-Kaba)
- GitHub - [@Franz-James-Kaba](https://github.com/Franz-James-Kaba)
