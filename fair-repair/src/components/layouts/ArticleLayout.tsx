
import { BaseContent } from '@/lib/types'; // BaseContent heeft nu 'body'
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ArticleLayoutProps {
    content: BaseContent; // BaseContent bevat nu 'body' en 'productCategory?'
}

export default function ArticleLayout({ content }: ArticleLayoutProps) {
    return (
        <article className="container mx-auto px-4 py-8 max-w-3xl">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{content.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                    <span>Gepubliceerd op {new Date(content.date).toLocaleDateString('nl-BE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    {content.productCategory && <Badge variant="outline">{content.productCategory.charAt(0).toUpperCase() + content.productCategory.slice(1)}</Badge>}
                </div>
                {content.image && (
                    <div className="relative w-full aspect-[16/9] mt-4 rounded-lg overflow-hidden shadow-md">
                        <Image src={content.image} alt={content.title} fill className="object-cover" priority />
                    </div>
                )}
            </header>
            <div
                className="prose dark:prose-invert lg:prose-xl max-w-none" // prose-xl voor betere leesbaarheid
                dangerouslySetInnerHTML={{ __html: content.body }}
            />
            {/* TODO: Voeg hier eventueel footer, auteur info, gerelateerde artikelen toe */}
        </article>
    );
}