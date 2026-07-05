# CSS Classes Quick Reference

## Color Variables

```css
--bg-primary: #0f172a; /* Dark background */
--bg-secondary: #1e293b; /* Medium background */
--accent-1: #3b82f6; /* Blue */
--accent-2: #8b5cf6; /* Purple */
--accent-3: #ec4899; /* Pink */
--success: #10b981; /* Green */
--danger: #ef4444; /* Red */
--warning: #f59e0b; /* Amber */
--text: #f1f5f9; /* Light text */
--muted: #94a3b8; /* Gray text */
```

## Button Classes

```jsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-ghost">Ghost Button</button>
```

## Animation Classes

```jsx
<div className="animate-float">Floating Element</div>
<div className="animate-pulse">Pulsing Element</div>
<div className="animate-glow">Glowing Element</div>
<div className="animate-bounce">Bouncing Element</div>
<div className="animate-spin">Spinning Loader</div>
<div className="animate-slide-in-left">Slide from Left</div>
<div className="animate-slide-in-right">Slide from Right</div>
<div className="animate-scale-in">Scale In</div>
```

## Shadow & Glow Classes

```jsx
<div className="shadow-glow">Blue Glow</div>
<div className="shadow-glow-pink">Pink Glow</div>
<div className="shadow-glow-purple">Purple Glow</div>
```

## Text Classes

```jsx
<div className="text-gradient">Gradient Text</div>
<div className="gradient-text-blue">Blue-Purple Gradient</div>
<div className="text-muted">Muted Color Text</div>
<div className="text-light">Light Color Text</div>
<div className="text-center">Centered Text</div>
<div className="truncate">Single line truncate...</div>
<div className="line-clamp-2">Multi-line truncate...</div>
```

## Card Classes

```jsx
<div className="card">
  Glass Card with hover effects
</div>

<div className="card glassmorphism">
  Standard Glassmorphism
</div>

<div className="card glassmorphism-heavy">
  Heavy Blur Glassmorphism
</div>
```

## Hover Effect Classes

```jsx
<div className="hover-lift">Lifts up on hover</div>
<div className="hover-scale">Scales up on hover</div>
<div className="hover-glow">Glows on hover</div>
```

## Layout Classes

```jsx
<div className="page">
  <!-- Full width container with padding -->
</div>

<div className="image-grid">
  <!-- Auto-responsive grid -->
</div>

<div className="upload-form">
  <!-- Form container with responsive columns -->
</div>
```

## Alert Classes

```jsx
<div className="alert-error">Error Message</div>
<div className="alert-success">Success Message</div>
```

## Navbar Classes

```jsx
<nav className="navbar">
  <a href="/" className="brand">
    <div className="brand-mark">⚡</div>
    CloudSnap
  </a>
</nav>
```

## Form Input Classes

```jsx
<input className="upload-grid input[type='text']" />
<select className="upload-grid select" />
<textarea className="upload-grid textarea" />
```

## Image Card Classes

```jsx
<div className="image-card">
  <div className="filename">Image Name</div>
  <div className="image-description">Description</div>
  <div className="timer">Time remaining</div>
  <div className="image-card-actions">
    <button>Action 1</button>
    <button>Action 2</button>
  </div>
</div>
```

## Page Classes

```jsx
<div className="page dashboard">Dashboard Page</div>
<div className="auth-page">Auth Page</div>
<div className="share-page">Share Page</div>
```

## Common Patterns

### Loading State

```jsx
<div className="animate-spin">
  <svg><!-- loading spinner --></svg>
</div>
```

### Gradient Button

```jsx
<button className="btn-primary animate-pulse">Click Me</button>
```

### Card with Hover Effect

```jsx
<div className="card hover-lift shadow-glow">
  <h3 className="text-gradient">Title</h3>
  <p className="text-muted">Content</p>
</div>
```

### Animated Badge

```jsx
<span className="badge animate-bounce shadow-glow-pink">New</span>
```

### Image Card Component

```jsx
<div className="image-card hover-lift">
  <div className="filename">My Image.jpg</div>
  <div className="image-description">A beautiful sunset photo</div>
  <div className="timer">5m 32s</div>
  <div className="image-card-actions">
    <button className="btn-secondary">Copy</button>
    <button className="btn-secondary">Delete</button>
  </div>
</div>
```

### Form Group

```jsx
<div className="upload-grid">
  <label>Upload Image</label>
  <div className="file-drop">
    <input type="file" accept="image/*" />
    <span>Choose an image</span>
  </div>
</div>
```

### Auth Form

```jsx
<div className="auth-page">
  <form className="auth-card">
    <h1>Welcome Back</h1>
    <p className="auth-subtitle">Login to continue</p>
    <input placeholder="Username" />
    <input type="password" placeholder="Password" />
    <button className="btn-primary">Login</button>
    <p className="auth-switch">
      New user? <a href="/register">Register</a>
    </p>
  </form>
</div>
```

## Responsive Breakpoints

```css
/* Mobile First */
/* Mobile: < 480px (no media query needed) */

/* Tablet: >= 768px */
@media (min-width: 768px) {
}

/* Desktop: >= 920px */
@media (min-width: 920px) {
}

/* Large Desktop: >= 1200px */
@media (min-width: 1200px) {
}
```

## Performance Tips

### Use Transform Instead of Top/Left

```css
/* ✅ Good - GPU accelerated */
transform: translateY(-5px);

/* ❌ Avoid - causes reflow */
top: -5px;
```

### Use Opacity Instead of Display

```css
/* ✅ Good - GPU accelerated */
opacity: 0;

/* ❌ Avoid - causes layout shift */
display: none;
```

## Accessibility

```jsx
<!-- Focus visible states are automatic -->
<button className="btn-primary">Click</button>

<!-- Use semantic HTML -->
<nav className="navbar">
  <a href="/">Home</a>
</nav>

<!-- High contrast colors for text -->
<p className="text-light">Light text on dark background</p>
```

## Tips & Tricks

1. **Combine classes for effects**:

   ```jsx
   <div className="card hover-lift shadow-glow animate-float">Amazing Card</div>
   ```

2. **Layer animations**:

   ```jsx
   <div className="animate-float">
     <button className="btn-primary animate-pulse">Click</button>
   </div>
   ```

3. **Use custom CSS variables**:

   ```css
   :root {
     --my-color: #3b82f6;
   }

   .element {
     color: var(--my-color);
   }
   ```

4. **Create custom animations**:

   ```css
   @keyframes myAnimation {
     0% {
       opacity: 0;
     }
     100% {
       opacity: 1;
     }
   }

   .animate-my {
     animation: myAnimation 0.5s ease-out;
   }
   ```

---

Keep this reference handy for quick styling implementations! 🎨
