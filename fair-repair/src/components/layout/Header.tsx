"use client";

import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Voor mobiel menu
import { MenuIcon } from "lucide-react"; // Lucide icon voor hamburger

// Definieer een interface voor de navigatielinks
interface NavLinkItem {
    href: string;
    label: string;
}

const navLinks: NavLinkItem[] = [];

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
                        {navLinks.map((link: NavLinkItem) => ( // Type toegevoegd aan link
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
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MenuIcon className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <nav className="grid gap-4 text-lg p-4">
                                {navLinks.map((link: NavLinkItem) => (
                                    <Link key={link.href} href={link.href} legacyBehavior passHref>
                                        <NavigationMenuLink
                                            className={`${navigationMenuTriggerStyle()} justify-start`}
                                            onClick={() => {
                                                // Optioneel: sluit sheet na klikken
                                                // Dit vereist state management voor de Sheet open/close state
                                                const trigger = document.querySelector('[aria-expanded="true"]');
                                                if (trigger instanceof HTMLElement) {
                                                    trigger.click();
                                                }
                                            }}
                                        >
                                            {link.label}
                                        </NavigationMenuLink>
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}