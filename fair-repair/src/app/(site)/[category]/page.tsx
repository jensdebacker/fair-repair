// src/app/(site)/[category]/page.tsx
import { getContentListItemsByProductCategory } from '@/lib/content';
import { CategorySlug } from '@/lib/types';
import ArticleCard from '@/components/shared/ArticleCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { notFound } from 'next/navigation';

const validCategories: CategorySlug[] = ["smartphones", "tablets", "smartwatches", "gameconsoles", "algemeen"];

export async function generateStaticParams() {
    return validCategories.map((category) => ({
        category: category,
    }));
}

interface CategoryPageProps {
    params: {
        category: CategorySlug;
    };
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);
    return {
        title: `${categoryName} - Alle Artikelen en Gidsen`,
        description: `Vind alle informatie over ${params.category}, inclusief reviews, reparatiegidsen en meer.`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = params;

    if (!validCategories.includes(category)) {
        notFound();
    }

    const items = await getContentListItemsByProductCategory(category);

    return (
        <div className="container mx-auto px-4 py-8">

            <SectionTitle title={category.charAt(0).toUpperCase() + category.slice(1)} />
            {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <ArticleCard key={`${item.type}-${item.slug}`} item={item} />
                    ))}
                </div>
            ) : (
                <p>Er zijn nog geen artikelen, gidsen of reviews beschikbaar in de categorie {category}.</p>
            )}
        </div>
    );
}