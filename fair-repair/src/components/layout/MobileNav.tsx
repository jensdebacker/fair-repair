"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, Search as SearchIconLucide } from 'lucide-react'; // Renamed to avoid conflict if Search component is imported
import { Input } from '@/components/ui/input'; // Search bar in de MobileNav

//Hier nav items voor de mobiele navigatie
// Definieer een interface voor de navigatielinks
const mobileNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/guides', label: 'Guides', icon: Wrench },
    // { href: '/forum', label: 'Forum', icon: Users }, // Toekomstige toevoeging
    // { href: '/profile', label: 'Profile', icon: UserCircle }, // Toekomstige toevoeging
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background md:hidden">
            {/* Search bar as per mobile design */}
            <div className="p-3 border-b bg-muted/30">
                <div className="relative">
                    <SearchIconLucide className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search articles, guides..."
                        className="w-full pl-10 h-10 rounded-md bg-background" // Added bg-background for better contrast
                    />
                </div>
            </div>
            <nav className="flex justify-around items-center h-16">
                {mobileNavItems.map((item) => {
                    const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex flex-col items-center justify-center p-1 w-1/4 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                            <item.icon className={`h-5 w-5 mb-0.5 ${isActive ? 'text-primary' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                            <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}