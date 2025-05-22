import CategoryButton from '@/components/shared/CategoryButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Category } from '@/lib/types';

// Pas aan naar de categorieën in je mobiele design
const categoriesData: Category[] = [
    { slug: 'smartphones', name: 'Smartphones', imageUrl: '/images/categories/smartphones.png', imageAlt: 'Smartphones' },
    { slug: 'laptops', name: 'Laptops', imageUrl: '/images/categories/laptops.png', imageAlt: 'Laptops' },
    { slug: 'home-appliances', name: 'Home Appliances', imageUrl: '/images/categories/tablets.png', imageAlt: 'Home Appliances' }, // tablets.png is placeholder
    { slug: 'audio-equipment', name: 'Audio Equipment', imageUrl: '/images/categories/audio.png', imageAlt: 'Audio Equipment' },
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