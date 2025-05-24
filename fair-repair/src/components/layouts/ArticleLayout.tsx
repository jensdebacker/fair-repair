import { BaseContent } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ArticleLayoutProps {
    metadata: BaseContent; // Changed from 'content' to 'metadata' for consistency
    children?: React.ReactNode; // Added children prop for nested content
}

export default function ArticleLayout({ metadata, children }: ArticleLayoutProps) {
    return (
        <article className="container mx-auto px-4 py-8 max-w-3xl">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{metadata.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                    <span>Gepubliceerd op {new Date(metadata.date).toLocaleDateString('nl-BE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    {metadata.productCategory && <Badge variant="outline">{metadata.productCategory.charAt(0).toUpperCase() + metadata.productCategory.slice(1)}</Badge>}
                </div>
                {metadata.image && (
                    <div className="relative w-full aspect-[16/9] mt-4 rounded-lg overflow-hidden shadow-md">
                        <Image src={metadata.image} alt={metadata.title} fill className="object-cover" priority />
                    </div>
                )}
            </header>

            {/* If children are provided, render them; otherwise render the body */}
            {children ? (
                <div className="prose dark:prose-invert lg:prose-xl max-w-none">
                    {children}
                </div>
            ) : (
                <div
                    className="prose dark:prose-invert lg:prose-xl max-w-none"
                    dangerouslySetInnerHTML={{ __html: metadata.body }}
                />
            )}

            {/* TODO: Add footer, author info, related articles */}
        </article>
    );
}