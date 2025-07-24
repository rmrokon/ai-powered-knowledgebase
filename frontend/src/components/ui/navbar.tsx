"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, User, LogOut, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/components/hooks/store/use-auth-store"
import toast from "react-hot-toast"
import ClientOnly from "@/components/client-only"

interface NavLink {
  href: string
  label: string
  icon: React.ReactNode
  requiresAuth?: boolean
  hideWhenAuth?: boolean
}

const navLinks: NavLink[] = [
  {
    href: "/articles",
    label: "Articles",
    icon: <FileText className="size-4" />,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <User className="size-4" />,
    requiresAuth: true,
  },
]

function NavbarComponent() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { isLoggedIn, user, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    if(typeof window !== 'undefined'){

      localStorage.removeItem("accessToken")
    }
    logout()
    toast.success("Logged out successfully")
    router.push("/login")
    setIsOpen(false)
  }

  const filteredLinks = navLinks.filter(link => {
    if (link.requiresAuth && !isLoggedIn) return false
    if (link.hideWhenAuth && isLoggedIn) return false
    return true
  })

  const toggleMobileMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="size-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline-block">KnowledgeBase</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {filteredLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </Button>
              )}
            </div>
          </div>

          {/* User Info (Desktop) */}
          {isLoggedIn && user && (
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="size-8 rounded-full bg-primary flex items-center justify-center">
                <User className="size-4 text-primary-foreground" />
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-muted-foreground hover:text-foreground"
            >
              {isOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border/40">
            {/* User Info (Mobile) */}
            {isLoggedIn && user && (
              <div className="flex items-center space-x-3 px-3 py-3 border-b border-border/40 mb-2">
                <div className="size-10 rounded-full bg-primary flex items-center justify-center">
                  <User className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}

            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            
            {isLoggedIn && (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start space-x-3 px-3 py-3 text-base font-medium text-muted-foreground hover:text-foreground"
              >
                <LogOut className="size-4" />
                <span>Logout</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export function Navbar() {
  return (
    <ClientOnly>
      <NavbarComponent />
    </ClientOnly>
  )
}
