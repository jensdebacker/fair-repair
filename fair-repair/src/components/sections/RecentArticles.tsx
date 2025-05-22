// components/sections/RecentArticles.tsx
import { getAllContentMetadataForLists } from '@/lib/markdown'; // Gebruik de nieuwe functie
import ArticleCard from '@/components/shared/ArticleCard';
import SectionTitle from '../shared/SectionTitle';
// ... (andere imports)

export default async function RecentArticles() {
    const allContent = getAllContentMetadataForLists(); // Haalt gemixte lijst op van artikel- en gids-metadata

    // Filter alleen artikelen voor deze sectie, of toon gemixt
    const recentItems = allContent
        // .filter(item => item.layoutType === 'article') // Als je alleen artikelen wilt
        .slice(0, 3);

    return (
        <section className="py-10 md:py-12 bg-muted/20 -mx-4 px-4 sm:-mx-6 lg:-mx-8 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <SectionTitle title="Recent Articles & Guides" subtitle="The latest news, tips, and insights from our team." />
                {recentItems.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {recentItems.map((item) => (
                            // @ts-ignore item type kan ArticlePost of GuidePost zijn, ArticleCard handelt dit af
                            <ArticleCard key={item.layoutType === 'article' ? item.fullSlug : item.slug} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-lg text-muted-foreground">No recent articles available.</p>
                    </div>
                )}
                {/* ... (View All button) ... */}
            </div>
        </section>
    );
}