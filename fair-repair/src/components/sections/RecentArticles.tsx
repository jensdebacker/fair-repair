import SectionTitle from '@/components/shared/SectionTitle';
import ArticleCard from '@/components/shared/ArticleCard';
import { getAllContentListItems } from '@/lib/content';

export default async function RecentArticles() {
    const allItems = await getAllContentListItems();
    const recentItems = allItems.slice(0, 6); // Toon bijvoorbeeld de 6 meest recente items

    return (
        <section className="py-12 bg-muted/40">
            <div className="container mx-auto px-4">
                <SectionTitle title='Recente Artikelen & Gidsen' />
                {recentItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentItems.map((item) => (
                            <ArticleCard key={`${item.type}-${item.slug}`} item={item} />
                        ))}
                    </div>
                ) : (
                    <p>Er zijn nog geen recente publicaties.</p>
                )}
            </div>
        </section>
    );
}