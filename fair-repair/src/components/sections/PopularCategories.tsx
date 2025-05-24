import CategoryButton from '@/components/shared/CategoryButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Category } from '@/lib/types';

// Pas aan naar de categorieën in je mobiele design
const categoriesData: Category[] = [
    { slug: 'smartphones', name: 'Smartphones', imageUrl: '/images/categories/smartphone.png', imageAlt: 'Smartphones' },
    { slug: 'tablets', name: 'Tablets', imageUrl: '/images/categories/tablet.png', imageAlt: 'Tablets' },
    { slug: 'smartwatches', name: 'Smartwatches', imageUrl: '/images/categories/smartwatch.png', imageAlt: 'Smartwatches' },
    { slug: 'gameconsoles', name: 'Game Consoles', imageUrl: '/images/categories/gameconsole.png', imageAlt: 'Game Consoles' },
    { slug: 'algemeen', name: 'Algemeen', imageUrl: '/images/categories/algemeen.png', imageAlt: 'Algemeen' },
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