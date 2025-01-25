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
import { ModeToggle } from "./themebutton"

const navigationItems: { title: string; href: string; icon: React.ReactNode }[] = [
  {
    title: "Markets",
    href: "/",
    icon: <TrendingUp className="w-4 h-4 text-[#d64d06]" />
  },
  {
    title: "Create",
    href: "/markets/create",
    icon: <Sword className="w-4 h-4 text-[#d64d06]" />
  }
]

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <nav className="fixed w-full border-b border-[#d64d06]/20 backdrop-blur-lg z-50 bg-background/80">
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
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-foreground/70 hover:text-foreground")}>
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Dynamic Widget - Right */}
          <div className="shrink-0 w-[150px] flex justify-end items-center gap-2">
            <button 
              className="md:hidden text-foreground/70 hover:text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden md:block">
              <ModeToggle />
            </div>
            <div className="hidden md:block">
              <DynamicWidget innerButtonComponent={<p>Login</p>} />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#d64d06]/20">
            <div className="flex flex-col py-4 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-2 px-4 text-foreground/70 hover:text-foreground py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
              <div className="px-4">
                <ModeToggle />
              </div>
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

