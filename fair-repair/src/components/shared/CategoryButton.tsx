import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CategoryInfo, CategorySlug } from '@/lib/types';// Gebruik de Category type

interface CategoryButtonProps {
    category: CategoryInfo;
}

export default function CategoryButton({ category }: CategoryButtonProps) {
    return (
        <Button
            asChild
            variant="outline" // Behoud outline, of maak custom styling
            className="h-auto p-0 border bg-card shadow-sm hover:shadow-md transition-all group rounded-lg overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
            <Link href={`/category/${category.slug}`} className="flex flex-col items-center justify-start p-4 text-center h-full">
                <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3"> {/* Consistent met mobiel design */}
                    <Image
                        src={category.image}
                        alt={category.imageAlt}
                        fill
                        sizes="(max-width: 768px) 64px, 80px"
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                    {category.name}
                </span>
            </Link>
        </Button>
    );
}