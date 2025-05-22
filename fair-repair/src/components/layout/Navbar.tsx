"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
    { href: "/category/smartphones", label: "Smartphones" }, // Voorbeeld, pas aan
    { href: "/category/laptops", label: "Laptops" },
    { href: "/guides", label: "Repair Guides" },
    { href: "/over-ons", label: "About Us" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
                    Fair Repair
                </Link>

                <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-2 py-1 rounded-md transition-colors hover:text-primary hover:bg-accent ${pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) ? "text-primary font-semibold bg-accent" : "text-muted-foreground"}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="hidden sm:block relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input type="search" placeholder="Search..." className="pl-10 h-9 w-32 lg:w-56 rounded-md" />
                    </div>
                    <Button variant="ghost" size="icon" className="sm:hidden hover:bg-accent"> {/* Search Icon only on mobile if no bar */}
                        <Search className="h-5 w-5" />
                    </Button>

                    <div className="md:hidden">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-accent">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm">
                                <SheetHeader className="mb-6 flex flex-row justify-between items-center">
                                    <SheetTitle className="text-xl font-bold text-primary">Menu</SheetTitle>
                                    <SheetClose asChild>
                                        <Button variant="ghost" size="icon"><X className="h-5 w-5" /></Button>
                                    </SheetClose>
                                </SheetHeader>
                                <nav className="grid gap-4 text-base font-medium">
                                    <SheetClose asChild><Link href="/" className="py-2 hover:text-primary" onClick={() => setIsSheetOpen(false)}>Home</Link></SheetClose>
                                    {navItems.map((item) => (
                                        <SheetClose asChild key={item.href}>
                                            <Link href={item.href} className={`py-2 hover:text-primary ${pathname === item.href ? "text-primary font-semibold" : ""}`} onClick={() => setIsSheetOpen(false)}>
                                                {item.label}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}