"use client"; // Als NavigationMenu client-side interactiviteit vereist

import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"; // Shadcn/UI
import { Button } from '@/components/ui/button';
// Importeer een logo component of afbeelding
// import Logo from './Logo';

const navLinks =;

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    {/* <Logo /> */}
                    <span className="font-bold text-xl text-primary">Fair-repair</span>
                </Link>
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        {navLinks.map((link) => (
                            <NavigationMenuItem key={link.href}>
                                <Link href={link.href} legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        {link.label}
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="md:hidden">
                    {/* Mobiel menu knop (bijv. Hamburger icon) */}
                    <Button variant="outline" size="icon">
                        {/* <MenuIcon className="h-5 w-5" /> */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </Button>
                </div>
            </div>
        </header>
    );
}