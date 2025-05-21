import { getContentByCategory, ContentMetadata } from '@/lib/content';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { notFound } from 'next/navigation';

const VALID_CATEGORIES = ['smartphones', 'tablets', 'smartwatches', 'gameconsoles', 'tech-uitgelegd', 'how-to'];

export async function generateStaticParams() {
    return VALID_CATEGORIES.map(category => ({ category }));
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }) {
    const params = await props.params;
    const { category } = params;
    const decodedCategory = decodeURIComponent(category);
    if (!VALID_CATEGORIES.includes(decodedCategory)) {
        return { title: 'Categorie Niet Gevonden' };
    }
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    return {
        title: `${categoryName} - Overzicht`,
        description: `Vind alle artikelen, reviews en gidsen over ${categoryName} op Fair-repair.`,
    };
}

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
    const params = await props.params;
    const category = decodeURIComponent(params.category);

    if (!VALID_CATEGORIES.includes(category)) {
        notFound();
    }

    const items: ContentMetadata[] = await getContentByCategory(category);

    // Correctie: controleer of items bestaat en een array is voordat length wordt gebruikt
    if (!items || items.length === 0) {
        // notFound(); // Optioneel: stuur naar 404 als lege categorieën niet gewenst zijn
        // Of toon een bericht:
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        return (
            <div>
                <h1 className="text-4xl font-bold mb-8">{categoryName}</h1>
                <p>Er is momenteel geen content beschikbaar in deze categorie.</p>
            </div>
        );
    }
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">{categoryName}</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item: ContentMetadata) => (
                    <Card key={item.slug + item.category} className="flex flex-col">
                        {item.featuredImage && (
                            <Link href={`/${item.category}/${item.slug}`} className="block">
                                <img src={item.featuredImage} alt={item.title} className="rounded-t-lg aspect-video object-cover hover:opacity-80 transition-opacity" />
                            </Link>
                        )}
                        <CardHeader>
                            <CardTitle>
                                <Link href={`/${item.category}/${item.slug}`} className="hover:text-primary transition-colors">
                                    {item.title}
                                </Link>
                            </CardTitle>
                            <CardDescription>{new Date(item.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button variant="link" asChild className="p-0">
                                <Link href={`/${item.category}/${item.slug}`}>Lees meer &rarr;</Link>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}