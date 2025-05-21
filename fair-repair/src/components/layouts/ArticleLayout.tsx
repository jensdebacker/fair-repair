import { ContentMetadata } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ArticleLayout({ metadata, children }: { metadata: ContentMetadata, children: React.ReactNode }) {
    return (
        <article className="prose prose-lg dark:prose-invert max-w-none mx-auto">
            <header className="mb-8 not-prose"> {/* not-prose om prose styling hier te vermijden indien nodig */}
                <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl mb-2">{metadata.title}</h1>
                <p className="text-muted-foreground text-sm">
                    Gepubliceerd op: {new Date(metadata.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {metadata.lastUpdated && metadata.lastUpdated !== metadata.date && (
                        <> | Laatst bijgewerkt: {new Date(metadata.lastUpdated).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</>
                    )}
                </p>
                {metadata.author && <p className="text-muted-foreground text-sm">Door: {metadata.author}</p>}
                {metadata.tags && metadata.tags.length > 0 && (
                    <div className="mt-4 space-x-2">
                        {metadata.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                )}
            </header>
            {metadata.featuredImage && (
                <div className="my-8 relative aspect-video not-prose"> {/* not-prose om prose styling hier te vermijden */}
                    <Image src={metadata.featuredImage} alt={metadata.title} layout="fill" objectFit="cover" className="rounded-lg shadow-md" />
                </div>
            )}
            {children}
        </article>
    );
}