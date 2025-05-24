// src/components/sections/FeaturedGuides.tsx
import SectionTitle from '@/components/shared/SectionTitle';
import ArticleCard from '@/components/shared/ArticleCard';
import { getAllReparatiegidsen } from '@/lib/content';
import { ContentListItem } from '@/lib/types'; // Voor consistentie met ArticleCard

export default async function FeaturedGuides() {
    const guides = await getAllReparatiegidsen();
    // Implementeer logica om "featured" gidsen te selecteren, bv. op basis van een frontmatter veld
    // Voor nu, neem de eerste 3 als voorbeeld
    const featured = guides.slice(0, 3);

    const itemsForCard: ContentListItem[] = featured.map(guide => ({
        slug: guide.slug,
        title: guide.title,
        date: guide.date,
        summary: guide.summary,
        image: guide.image,
        type: 'reparatiegidsen', // Zorg dat dit overeenkomt met ContentType
        productCategory: guide.productCategory,
    }));

    if (itemsForCard.length === 0) {
        return null; // Of een placeholder als je dat wilt
    }

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <SectionTitle title='Uitgelichte Reparatiegidsen' />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itemsForCard.map((item) => (
                        <ArticleCard key={item.slug} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}