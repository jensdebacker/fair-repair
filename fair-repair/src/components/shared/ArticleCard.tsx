// components/shared/ArticleCard.tsx
import Link from 'next/link';
import Image from 'next/image';
// ... (andere imports zoals Card, Button, icons)
import { ArticlePost, GuidePost, PostFrontMatter } from '@/lib/types'; // Gebruik de types
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface ArticleCardProps {
    // item kan een ArticlePost of GuidePost zijn (of een gecombineerd type met metadata)
    item: (Omit<ArticlePost, 'contentHtml'> & { layoutType: 'article' }) | (Omit<GuidePost, 'contentHtml'> & { layoutType: 'guide' });
}

export default function ArticleCard({ item }: ArticleCardProps) {
    let href: string;
    let title: string;
    let excerpt: string;
    let featuredImage: string | undefined;
    let date: string;
    let category: string; // Of specifieker type

    if (item.layoutType === 'article') {
        // Het is een ArticlePost (of de metadata ervan)
        // @ts-ignore (slugSegments en fullSlug bestaan op ArticlePost)
        href = `/articles/${item.fullSlug}`;
        title = item.title;
        excerpt = item.excerpt;
        featuredImage = item.featuredImage;
        date = item.date;
        category = item.category;
    } else if (item.layoutType === 'guide') {
        // Het is een GuidePost
        // @ts-ignore (slug bestaat op GuidePost)
        href = `/guides/${item.slug}`;
        title = item.title;
        excerpt = item.excerpt;
        featuredImage = item.featuredImage;
        date = item.date;
        category = item.category; // Guides kunnen ook een categorie hebben
    } else {
        // Fallback of error
        return <p>Error: Unknown item type</p>;
    }

    const formattedDate = new Date(date).toLocaleDateString('nl-NL', {
        year: 'numeric', month: 'short', day: 'numeric',
    });

    return (
        <Card className="flex flex-col h-full overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg group bg-card">
            {featuredImage && (
                <Link href={href} className="block aspect-video relative overflow-hidden rounded-t-lg">
                    <Image src={featuredImage} alt={title} fill sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw" className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                </Link>
            )}
            <CardHeader className="p-4">
                <CardDescription className="text-xs flex items-center text-muted-foreground mb-1">
                    <span className={`inline-block text-xs mr-2 px-2 py-0.5 rounded-full ${item.layoutType === 'guide' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {item.layoutType === 'guide' ? "Gids" : "Artikel"}
                    </span>
                    {/* Optioneel: Categorie specifiek voor het item */}
                    {category && <span className="mr-2 text-xs">{category.replace(/-/g, ' ')}</span>}
                    <CalendarDays className="h-3.5 w-3.5 mr-1" />
                    {formattedDate}
                </CardDescription>
                <CardTitle className="text-base md:text-lg leading-snug font-semibold">
                    <Link href={href} className="hover:text-primary transition-colors line-clamp-2">{title}</Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
            </CardContent>
            <CardFooter className="p-4 pt-2">
                <Button variant="link" asChild className="p-0 text-sm text-primary hover:underline font-medium">
                    <Link href={href}>Lees meer <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
            </CardFooter>
        </Card>
    );
}