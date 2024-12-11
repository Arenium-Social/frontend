"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { DynamicWidget } from "@dynamic-labs/sdk-react-core"
import { Sword, Trophy, Ticket, TrendingUp, Menu, X } from "lucide-react"

const markets: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Memecoin Markets",
    href: "#",
    description: "Predict and bet on price movements of Arena-launched memecoins.",
    icon: <TrendingUp className="w-4 h-4 text-[#d64d06]" />
  },
  {
    title: "Ticket Markets",
    href: "#",
    description: "Trade predictions on user ticket values within The Arena ecosystem.",
    icon: <Ticket className="w-4 h-4 text-[#d64d06]" />
  },
  {
    title: "Event Markets",
    href: "#",
    description: "Participate in predictions for sports and cultural events.",
    icon: <Trophy className="w-4 h-4 text-[#d64d06]" />
  }
]

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const offset = 80
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="fixed w-full border-b border-[#d64d06]/20 backdrop-blur-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 shrink-0 w-[150px]">
            <Sword className="w-6 h-6 text-[#d64d06]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#d64d06] to-[#ff6b1a] text-transparent bg-clip-text">
              ARENIUM
            </span>
            <Sword className="w-6 h-6 text-[#d64d06] scale-x-[-1]" />
          </Link>

          {/* Navigation - Center (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-4">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white/70 hover:text-white">
                    Markets
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1">
                      {markets.map((market) => (
                        <ListItem
                          key={market.title}
                          title={market.title}
                          href={market.href}
                          icon={market.icon}
                        >
                          {market.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className={cn(navigationMenuTriggerStyle(), "text-white/70 hover:text-white")}
                  >
                    Features
                  </button>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className={cn(navigationMenuTriggerStyle(), "text-white/70 hover:text-white")}
                  >
                    How It Works
                  </button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Dynamic Widget - Right */}
          <div className="shrink-0 w-[150px] flex justify-end">
            {/* Hamburger for mobile */}
            <button 
              className="md:hidden text-white/70 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {/* Widget for desktop */}
            <div className="hidden md:block">
              <DynamicWidget innerButtonComponent={<p>Login</p>} />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#d64d06]/20">
            <div className="flex flex-col py-4 space-y-4">
              <div className="px-4">
                <button 
                  className="text-white/70 hover:text-white w-full text-left py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Markets
                </button>
                <div className="pl-4 space-y-2 mt-2">
                  {markets.map((market) => (
                    <a 
                      key={market.title}
                      href={market.href}
                      className="flex items-center gap-2 text-white/70 hover:text-white py-1"
                    >
                      {market.icon}
                      <span>{market.title}</span>
                    </a>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => scrollToSection('features')}
                className="px-4 text-white/70 hover:text-white text-left py-2"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="px-4 text-white/70 hover:text-white text-left py-2"
              >
                How It Works
              </button>
              {/* Widget for mobile */}
              <div className="px-4 pt-2">
                <DynamicWidget />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#d64d06]/10",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <div className="text-sm font-medium leading-none text-[#d64d06]">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-white/70">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

