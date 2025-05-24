// src/app/(site)/reparatiegidsen/page.tsx
import { getAllReparatiegidsen } from '@/lib/content';
import ArticleCard from '@/components/shared/ArticleCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { Metadata } from 'next';
import { ContentListItem } from '@/lib/types';

export const metadata: Metadata = {
    title: 'Alle Reparatiegidsen - FairRepair',
    description: 'Vind hier al onze reparatiegidsen voor consumentenelektronica.',
};

export default async function ReparatiegidsenOverzichtPage() {
    const gidsen = await getAllReparatiegidsen();
    const itemsForCard: ContentListItem[] = gidsen.map(g => ({
        slug: g.slug, title: g.title, date: g.date, summary: g.summary,
        image: g.image, type: 'reparatiegidsen', productCategory: g.productCategory,
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            <SectionTitle title='Alle Reparatiegidsen'></SectionTitle>
            {itemsForCard.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itemsForCard.map((item) => (
                        <ArticleCard key={item.slug} item={item} />
                    ))}
                </div>
            ) : (
                <p>Er zijn momenteel geen reparatiegidsen beschikbaar.</p>
            )}
        </div>
    );
}