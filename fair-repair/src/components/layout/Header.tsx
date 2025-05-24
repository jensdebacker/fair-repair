"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, Search, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { getAllContentListItems } from '@/lib/content';
import { BaseContent, ContentListItem } from '@/lib/types'; // Zorg ervoor dat BaseArticle correct gedefinieerd is

// Definieer categorieën die doorzoekbaar moeten zijn
const siteCategories = [
    { name: "Reparatiegidsen", href: "/reparatiegidsen", slug: "reparatiegidsen" },
    { name: "Reviews", href: "/reviews", slug: "reviews" },
    { name: "Tech Uitgelegd", href: "/tech-uitgelegd", slug: "tech-uitgelegd" },
    { name: "How-To", href: "/how-to", slug: "how-to" },
    { name: "Top Lijsten", href: "/top-lijsten", slug: "top-lijsten" },
];

interface SearchResultItem {
    id: string;
    type: 'article' | 'category';
    title: string;
    href: string;
    categoryName?: string;
}

export default function Header() {
    console.log("Header component rendering...");
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
    const [allSearchableData, setAllSearchableData] = useState<SearchResultItem[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("useEffect: Initial data fetch running...");
        const fetchAndPrepareData = async () => {
            console.log("fetchAndPrepareData: Starting to fetch articles.");
            try {
                const articles: ContentListItem[] = await getAllContentListItems(); console.log("fetchAndPrepareData: Articles fetched:", articles);

                if (!articles || articles.length === 0) {
                    console.warn("fetchAndPrepareData: No articles returned from getAllArticles().");
                }

                const articleResults: SearchResultItem[] = articles.map(article => {
                    if (!article.title || !article.slug || !article.productCategory) {
                        console.warn("fetchAndPrepareData: Article missing title, slug, or category:", article);
                    }
                    return {
                        id: article.slug,
                        type: 'article',
                        title: article.title,
                        href: `/${article.productCategory}/${article.slug}`, // Zorg dat article.category de slug is
                        categoryName: siteCategories.find(c => c.slug === article.productCategory)?.name || article.productCategory,
                    };
                });
                console.log("fetchAndPrepareData: Mapped article results:", articleResults);

                const categoryResults: SearchResultItem[] = siteCategories.map(category => ({
                    id: category.slug,
                    type: 'category',
                    title: category.name,
                    href: category.href,
                }));
                console.log("fetchAndPrepareData: Mapped category results:", categoryResults);

                const combinedData = [...articleResults, ...categoryResults];
                setAllSearchableData(combinedData);
                console.log("fetchAndPrepareData: All searchable data set:", combinedData);
            } catch (error) {
                console.error("fetchAndPrepareData: Failed to load or process articles for search:", error);
                setAllSearchableData([]);
            }
        };

        fetchAndPrepareData();
    }, []);

    useEffect(() => {
        console.log(`useEffect: searchQuery or allSearchableData changed. searchQuery: "${searchQuery}"`);
        if (searchQuery.trim() === '') {
            console.log("useEffect (filter): Search query is empty, clearing results.");
            setSearchResults([]);
            setIsDropdownVisible(false);
            return;
        }

        console.log("useEffect (filter): Filtering data. All searchable data length:", allSearchableData.length);
        if (allSearchableData.length === 0) {
            console.warn("useEffect (filter): No searchable data available to filter. Check if data loaded correctly.");
        }

        const lowerCaseQuery = searchQuery.toLowerCase();
        const filteredResults = allSearchableData.filter(item => {
            const itemTitle = item.title ? item.title.toLowerCase() : '';
            // console.log(`useEffect (filter): Checking item: "${itemTitle}" against query: "${lowerCaseQuery}"`);
            return itemTitle.includes(lowerCaseQuery);
        });

        console.log(`useEffect (filter): Filtered results for "${searchQuery}":`, filteredResults);
        setSearchResults(filteredResults);
        setIsDropdownVisible(filteredResults.length > 0);
        console.log(`useEffect (filter): isDropdownVisible set to ${filteredResults.length > 0}`);
    }, [searchQuery, allSearchableData]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            let closeDropdown = false;
            // Check desktop: if ref exists, click is outside, and mobile nav is NOT open
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node) && !isMobileNavOpen) {
                closeDropdown = true;
            }
            // Check mobile: if ref exists, click is outside, and mobile nav IS open
            if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(event.target as Node) && isMobileNavOpen) {
                closeDropdown = true;
            }

            if (closeDropdown) {
                // console.log("handleClickOutside: Closing dropdown.");
                setIsDropdownVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileNavOpen]);


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        console.log("handleSearchChange: Input changed. New query:", newQuery);
        setSearchQuery(newQuery);
    };

    const handleInputFocus = () => {
        console.log("handleInputFocus: Input focused. Current query:", searchQuery, "Results length:", searchResults.length);
        // Show dropdown if there's a query and results, or even if query is empty but input is focused (optional)
        if (searchQuery.trim() !== '' && searchResults.length > 0) {
            console.log("handleInputFocus: Showing dropdown because query and results exist.");
            setIsDropdownVisible(true);
        } else if (searchQuery.trim() === '' && allSearchableData.length > 0) {
            // Optioneel: toon alle items of recente zoekopdrachten bij focus op lege input
            // Voor nu: doe niets of toon een beperkte lijst
            // setIsDropdownVisible(true); // Dit zou alle items tonen als searchResults dan gevuld wordt
        }
    };

    const onItemClick = () => {
        console.log("onItemClick: Item clicked from dropdown.");
        setIsDropdownVisible(false);
        setSearchQuery(''); // Wis zoekopdracht na selectie
    };

    const renderDropdown = (isMobile = false) => {
        // Deze check is cruciaal en moet vóór de JSX.
        if (!isDropdownVisible || searchResults.length === 0) {
            // console.log(`renderDropdown: Not rendering. isDropdownVisible: ${isDropdownVisible}, searchResults length: ${searchResults.length}`);
            return null;
        }
        // Voorkom dat de verkeerde dropdown rendert
        if (isMobile && !isMobileNavOpen) {
            // console.log("renderDropdown (mobile): Not rendering because mobile nav is closed.");
            return null;
        }
        if (!isMobile && isMobileNavOpen) {
            // console.log("renderDropdown (desktop): Not rendering because mobile nav is open.");
            return null;
        }

        console.log(`renderDropdown: Rendering dropdown. isMobile: ${isMobile}, Items:`, searchResults);

        return (
            <div
                data-testid={isMobile ? "mobile-search-dropdown" : "desktop-search-dropdown"}
                className={`absolute mt-1 w-full ${isMobile ? '' : 'md:w-96'} max-h-80 overflow-y-auto rounded-md bg-background border border-border shadow-lg py-1 z-[55]`}
            >
                {searchResults.map(item => (
                    <Link
                        key={`${item.type}-${item.id}-${isMobile ? 'mobile' : 'desktop'}`}
                        href={item.href}
                        onClick={() => {
                            onItemClick();
                            if (isMobile) {
                                setIsMobileNavOpen(false);
                            }
                        }}
                        className="block px-4 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none"
                    >
                        <div className="font-medium">{item.title || "Geen titel"}</div>
                        {item.type === 'article' && item.categoryName && (
                            <div className="text-xs text-muted-foreground">in {item.categoryName}</div>
                        )}
                        {item.type === 'category' && (
                            <div className="text-xs text-muted-foreground">Categorie</div>
                        )}
                    </Link>
                ))}
            </div>
        );
    };

    const showDesktopDropdown = isDropdownVisible && searchResults.length > 0 && !isMobileNavOpen;
    const showMobileDropdown = isDropdownVisible && searchResults.length > 0 && isMobileNavOpen;

    // console.log(`Dropdown visibility: Desktop=${showDesktopDropdown}, Mobile=${showMobileDropdown}, isMobileNavOpen=${isMobileNavOpen}, isDropdownVisible=${isDropdownVisible}, results=${searchResults.length}`);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-lg">FairRepair</span>
                </Link>

                {/* Desktop Navigation & Search */}
                <div className="hidden md:flex md:items-center md:space-x-6">
                    <Navbar />
                    <div className="relative" ref={searchContainerRef}>
                        <div className="relative flex items-center">
                            <Input
                                type="search"
                                placeholder="Zoeken..."
                                className="pr-10 h-9"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleInputFocus}
                                aria-label="Zoeken op site"
                            />
                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                        {showDesktopDropdown && renderDropdown()}
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        <span className="sr-only">Thema wisselen</span>
                    </Button>
                </div>

                {/* Mobile Navigation Trigger & Search */}
                <div className="flex items-center md:hidden">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        <span className="sr-only">Thema wisselen</span>
                    </Button>
                    <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Menu openen</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-xs p-0">
                            <div className="flex justify-end p-4 pb-0">
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)}>
                                    <X className="h-6 w-6" />
                                    <span className="sr-only">Menu sluiten</span>
                                </Button>
                            </div>

                            <div className="p-4" ref={mobileSearchContainerRef}>
                                <div className="relative flex items-center">
                                    <Input
                                        type="search"
                                        placeholder="Zoeken..."
                                        className="pr-10 h-9 w-full"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={handleInputFocus}
                                        aria-label="Zoeken op site (mobiel)"
                                    />
                                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                </div>
                                {showMobileDropdown && renderDropdown(true)}
                            </div>
                            <MobileNav />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}