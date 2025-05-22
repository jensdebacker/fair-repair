// app/(site)/articles/[category]/page.tsx
import { getSortedArticleMetadata } from '@/lib/markdown';
import ArticleCard from '@/components/shared/ArticleCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { ArticlePost } from '@/lib/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
    params: { category: string }; // bv. "how-to"
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const categoryName = decodeURIComponent(params.category).replace(/-/g, ' ');
    const titleCasedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    return {
        title: `Artikelen: ${titleCasedCategory}`,
        description: `Vind alle artikelen in de categorie "${categoryName}" op Fair Repair.`,
    };
}

export async function generateStaticParams() {
    const articles = getSortedArticleMetadata();
    const categories = new Set(articles.map(article => article.categoryPath).filter(Boolean)); // categoryPath is bv "how-to"
    return Array.from(categories).map(cat => ({ category: cat }));
}

export default async function ArticlesByCategoryPage({ params }: Props) {
    const allArticles = getSortedArticleMetadata();
    // Filter artikelen waarvan de categoryPath (bv. "how-to") overeenkomt met params.category
    const categoryArticles = allArticles.filter(article => article.categoryPath === params.category);

    if (categoryArticles.length === 0) {
        notFound();
    }
    const categoryName = decodeURIComponent(params.category).replace(/-/g, ' ');
    const titleCasedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    return (
        <div className="container mx-auto py-8">
            <SectionTitle title={`${titleCasedCategory} Artikelen`} textAlignment="text-left" />
            {categoryArticles.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {categoryArticles.map(post => (
                        // @ts-ignore - item is van type ArticlePost, wat ArticleCard verwacht
                        <ArticleCard key={post.fullSlug} item={post} />
                    ))}
                </div>
            ) : (
                <p>Geen artikelen gevonden in deze categorie.</p>
            )}
        </div>
    );
}