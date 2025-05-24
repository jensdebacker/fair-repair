// src/components/shared/ArticleCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentListItem, ContentType } from '@/lib/types'; // Importeer ContentType

interface ArticleCardProps {
    item: ContentListItem;
}

// Helper om de basis URL per content type te krijgen
// Zorg dat de cases overeenkomen met de `ContentType` waarden (mapnamen)
const getBasePathForType = (type: ContentType): string => {
    switch (type) {
        case 'reparatiegidsen': return '/reparatiegidsen';
        case 'reviews': return '/reviews';
        case 'top-lijsten': return '/top-lijsten';
        case 'tech-uitgelegd': return '/tech-uitgelegd';
        case 'how-to': return '/how-to';
        case 'nieuws': return '/nieuws';
        default:
            // Fallback voor het geval een onbekend type wordt meegegeven.
            // Gooi een error of log een waarschuwing.
            console.warn(`Unknown content type for basePath: ${type}`);
            return '/'; // Of een geschikte fallback/error pagina
    }
};

export default function ArticleCard({ item }: ArticleCardProps) {
    const basePath = getBasePathForType(item.type);
    const href = `${basePath}/${item.slug}`;
    return (
        <Link href={href} className="group block h-full">
            <Card className="h-full flex flex-col transition-shadow duration-300 ease-in-out group-hover:shadow-lg">
                {item.image && (
                    <div className="relative w-full aspect-[16/9]"> {/* Gebruik aspect ratio voor consistentie */}
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded-t-lg"
                        />
                    </div>
                )}
                <CardHeader>
                    <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                    </CardTitle>
                    {item.productCategory && (
                        <Badge variant="secondary" className="mt-1 w-fit">{item.productCategory}</Badge>
                    )}
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString('nl-BE', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </CardFooter>
            </Card>
        </Link>
    );
}