# Navbar Component

A responsive, classy navigation bar component built with shadcn/ui components and Tailwind CSS. **Only available for protected routes.**

## Features

- **Responsive Design**: Adapts to mobile and desktop screens
- **Authentication Aware**: Shows different navigation items based on login status
- **Mobile Menu**: Collapsible hamburger menu for mobile devices
- **User Profile Display**: Shows user information when logged in
- **CSS Variables**: Uses proper CSS variables from globals.css
- **Smooth Animations**: Includes hover effects and transitions
- **Protected Routes Only**: Automatically included in all protected routes

## Usage

### Automatic Usage in Protected Routes

The navbar is automatically included in all routes under `(protected)` via the layout:

```tsx
// frontend/src/app/(protected)/layout.tsx
export default function ProtectedLayout({children}) {
    // Authentication check
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}
```

### Manual Usage (if needed)

```tsx
import { Navbar } from "@/components/ui/navbar"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
```

## Navigation Links

The navbar includes the following links:

- **Articles** (`/articles`) - Always visible
- **Profile** (`/profile`) - Only visible when authenticated
- **Logout** - Only visible when authenticated (button)

## Customization

### Adding New Links

Edit the `navLinks` array in `navbar.tsx`:

```tsx
const navLinks: NavLink[] = [
  // existing links...
  {
    href: "/new-page",
    label: "New Page",
    icon: <NewIcon className="size-4" />,
    requiresAuth: false, // optional
    hideWhenAuth: false, // optional
  },
]
```

### Styling

The component uses CSS variables from `globals.css`:

- `--background` - Main background color
- `--foreground` - Text color
- `--primary` - Primary accent color
- `--muted-foreground` - Secondary text color
- `--border` - Border color
- `--accent` - Hover background color

## Dependencies

- `lucide-react` - Icons
- `next/link` - Navigation
- `next/navigation` - Router hooks
- `@/lib/utils` - cn utility function
- `@/components/ui/button` - Button component
- `@/components/hooks/store/use-auth-store` - Authentication state
- `react-hot-toast` - Toast notifications

## Mobile Responsiveness

- **Desktop**: Full horizontal navigation with user info
- **Tablet**: Condensed navigation
- **Mobile**: Hamburger menu with slide-down navigation

## Authentication Integration

The navbar automatically:
- Shows/hides links based on authentication status
- Displays user information when logged in
- Handles logout functionality
- Redirects after logout
