import CategoryButton from '@/components/shared/CategoryButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { CategoryInfo, CategorySlug } from '@/lib/types';

// Pas aan naar de categorieën in je mobiele design
const categoriesData: CategoryInfo[] = [
    { slug: 'smartphones', name: 'Smartphones', image: '/images/categories/smartphone.png', imageAlt: 'Smartphones' },
    { slug: 'tablets', name: 'Tablets', image: '/images/categories/tablet.png', imageAlt: 'Tablets' },
    { slug: 'smartwatches', name: 'Smartwatches', image: '/images/categories/smartwatch.png', imageAlt: 'Smartwatches' },
    { slug: 'gameconsoles', name: 'Game Consoles', image: '/images/categories/gameconsole.png', imageAlt: 'Game Consoles' },
    { slug: 'algemeen', name: 'Algemeen', image: '/images/categories/algemeen.png', imageAlt: 'Algemeen' },
];

export default function PopularCategories() {
    return (
        <section className="py-10 md:py-12">
            <SectionTitle title="Popular Categories" />
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {categoriesData.map((category) => (
                    <CategoryButton key={category.slug} category={category} />
                ))}
            </div>
        </section>
    );
}