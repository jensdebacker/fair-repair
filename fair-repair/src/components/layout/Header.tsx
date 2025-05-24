"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, Search, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import MobileNav from './MobileNav';

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

interface ContentListItem {
    slug: string;
    title: string;
    date: string;
    summary: string;
    image?: string;
    type: string;
    productCategory: string;
}

export default function Header() {
    console.log("Header component rendering...");
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
    const [allSearchableData, setAllSearchableData] = useState<SearchResultItem[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const searchContainerRef = useRef<HTMLDivElement>(null);
    const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

    // Functie om data op te halen via API route
    const fetchSearchData = async (): Promise<ContentListItem[]> => {
        try {
            console.log("fetchSearchData: Making API call...");
            const response = await fetch('/api/search-data');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("fetchSearchData: API response:", data);
            return data.articles || [];
        } catch (error) {
            console.error("fetchSearchData: Error fetching search data:", error);
            throw error;
        }
    };

    useEffect(() => {
        console.log("useEffect: Initial data fetch running...");
        const fetchAndPrepareData = async () => {
            if (dataLoaded) return; // Voorkom dubbele calls

            console.log("fetchAndPrepareData: Starting to fetch articles.");
            setIsLoading(true);

            try {
                const articles: ContentListItem[] = await fetchSearchData();
                console.log("fetchAndPrepareData: Articles fetched:", articles);

                if (!articles || articles.length === 0) {
                    console.warn("fetchAndPrepareData: No articles returned from API.");
                    setAllSearchableData([]);
                    setDataLoaded(true);
                    return;
                }

                const articleResults: SearchResultItem[] = articles.map(article => {
                    if (!article.title || !article.slug || !article.productCategory) {
                        console.warn("fetchAndPrepareData: Article missing required fields:", article);
                    }
                    return {
                        id: article.slug,
                        type: 'article' as const,
                        title: article.title || 'Geen titel',
                        href: `/${article.productCategory}/${article.slug}`,
                        categoryName: siteCategories.find(c => c.slug === article.productCategory)?.name || article.productCategory,
                    };
                });
                console.log("fetchAndPrepareData: Mapped article results:", articleResults);

                const categoryResults: SearchResultItem[] = siteCategories.map(category => ({
                    id: category.slug,
                    type: 'category' as const,
                    title: category.name,
                    href: category.href,
                }));
                console.log("fetchAndPrepareData: Mapped category results:", categoryResults);

                const combinedData = [...articleResults, ...categoryResults];
                console.log("fetchAndPrepareData: Combined data before setting state:", combinedData);
                setAllSearchableData(combinedData);
                setDataLoaded(true);
                console.log("fetchAndPrepareData: All searchable data set successfully");
            } catch (error) {
                console.error("fetchAndPrepareData: Error during data fetching:", error);
                setAllSearchableData([]);
                setDataLoaded(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndPrepareData();
    }, [dataLoaded]);

    // Debounced search effect
    useEffect(() => {
        console.log(`useEffect: searchQuery changed. New query: "${searchQuery}"`);
        console.log(`useEffect: Current allSearchableData:`, allSearchableData);
        console.log(`useEffect: allSearchableData length:`, allSearchableData.length);

        if (searchQuery.trim() === '') {
            console.log("useEffect (filter): Search query is empty, clearing results.");
            setSearchResults([]);
            setIsDropdownVisible(false);
            return;
        }

        // Verlaag debounce voor snellere feedback tijdens debugging
        const timeoutId = setTimeout(() => {
            console.log("useEffect (filter): Starting filter process...");
            console.log("useEffect (filter): All searchable data:", allSearchableData);

            if (allSearchableData.length === 0) {
                console.warn("useEffect (filter): No searchable data available to filter.");
                setSearchResults([]);
                setIsDropdownVisible(false);
                return;
            }

            const lowerCaseQuery = searchQuery.toLowerCase();
            console.log(`useEffect (filter): Searching for: "${lowerCaseQuery}"`);

            const filteredResults = allSearchableData.filter(item => {
                const itemTitle = item.title ? item.title.toLowerCase() : '';
                const matches = itemTitle.includes(lowerCaseQuery);
                console.log(`useEffect (filter): "${itemTitle}" matches "${lowerCaseQuery}"? ${matches}`);
                return matches;
            });

            console.log(`useEffect (filter): Filtered results for "${searchQuery}":`, filteredResults);
            console.log(`useEffect (filter): Number of filtered results:`, filteredResults.length);

            setSearchResults(filteredResults);
            const shouldShowDropdown = filteredResults.length > 0;
            setIsDropdownVisible(shouldShowDropdown);

            console.log(`useEffect (filter): Setting isDropdownVisible to ${shouldShowDropdown}`);
            console.log(`useEffect (filter): Current searchResults state will be:`, filteredResults);
        }, 100); // Verlaagd van 300ms naar 100ms voor snellere debugging

        return () => clearTimeout(timeoutId);
    }, [searchQuery, allSearchableData]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            let closeDropdown = false;

            if (searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node) &&
                !isMobileNavOpen) {
                closeDropdown = true;
            }

            if (mobileSearchContainerRef.current &&
                !mobileSearchContainerRef.current.contains(event.target as Node) &&
                isMobileNavOpen) {
                closeDropdown = true;
            }

            if (closeDropdown) {
                console.log("handleClickOutside: Closing dropdown.");
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
        if (searchQuery.trim() !== '' && searchResults.length > 0) {
            console.log("handleInputFocus: Showing dropdown because query and results exist.");
            setIsDropdownVisible(true);
        }
    };

    const onItemClick = () => {
        console.log("onItemClick: Item clicked from dropdown.");
        setIsDropdownVisible(false);
        setSearchQuery('');
    };

    const renderDropdown = (isMobile = false) => {
        console.log(`renderDropdown called: isMobile=${isMobile}`);
        console.log(`renderDropdown: isDropdownVisible=${isDropdownVisible}`);
        console.log(`renderDropdown: searchResults.length=${searchResults.length}`);
        console.log(`renderDropdown: searchResults=`, searchResults);
        console.log(`renderDropdown: isMobileNavOpen=${isMobileNavOpen}`);

        if (!isDropdownVisible || searchResults.length === 0) {
            console.log("renderDropdown: Not rendering - no visibility or no results");
            return null;
        }

        if (isMobile && !isMobileNavOpen) {
            console.log("renderDropdown: Not rendering mobile dropdown - mobile nav closed");
            return null;
        }
        if (!isMobile && isMobileNavOpen) {
            console.log("renderDropdown: Not rendering desktop dropdown - mobile nav open");
            return null;
        }

        console.log(`renderDropdown: RENDERING dropdown. isMobile: ${isMobile}, Items:`, searchResults);

        return (
            <div
                data-testid={isMobile ? "mobile-search-dropdown" : "desktop-search-dropdown"}
                className={`absolute mt-1 w-full ${isMobile ? '' : 'md:w-96'} max-h-80 overflow-y-auto rounded-md bg-background border border-border shadow-lg py-1 z-[55]`}
                style={{ backgroundColor: 'white', border: '2px solid red' }} // Tijdelijke debug styling
            >
                <div className="px-4 py-2 text-xs text-gray-500 border-b">
                    {searchResults.length} resultaten gevonden
                </div>
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
                        className="block px-4 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none border-b border-gray-100"
                    >
                        <div className="font-medium text-black">{item.title}</div>
                        {item.type === 'article' && item.categoryName && (
                            <div className="text-xs text-gray-600">in {item.categoryName}</div>
                        )}
                        {item.type === 'category' && (
                            <div className="text-xs text-gray-600">Categorie</div>
                        )}
                    </Link>
                ))}
            </div>
        );
    };

    const showDesktopDropdown = isDropdownVisible && searchResults.length > 0 && !isMobileNavOpen;
    const showMobileDropdown = isDropdownVisible && searchResults.length > 0 && isMobileNavOpen;

    console.log(`Render: showDesktopDropdown=${showDesktopDropdown}, showMobileDropdown=${showMobileDropdown}`);
    console.log(`Render: isDropdownVisible=${isDropdownVisible}, searchResults.length=${searchResults.length}, isMobileNavOpen=${isMobileNavOpen}`);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60  mx-auto">
            <div className="container flex h-16 items-center justify-between max-w-6xl mx-auto">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-lg">FairRepair</span>
                </Link>

                {/* Desktop Navigation & Search */}
                <div className="hidden md:flex md:items-center md:space-x-6">

                    <div className="relative" ref={searchContainerRef}>
                        <div className="relative flex items-center">
                            <Input
                                type="search"
                                placeholder={isLoading ? "Laden..." : "Zoeken..."}
                                className="pr-10 h-9"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleInputFocus}
                                disabled={isLoading}
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
                                        placeholder={isLoading ? "Laden..." : "Zoeken..."}
                                        className="pr-10 h-9 w-full"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={handleInputFocus}
                                        disabled={isLoading}
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