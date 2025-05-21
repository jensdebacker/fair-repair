import { getContentItem, getAllContentPaths, ContentMetadata } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/layouts/ArticleLayout';
import RepairGuideLayout from '@/components/layouts/RepairGuideLayout';
import ReviewLayout from '@/components/layouts/ReviewLayout';
import TopXListLayout from '@/components/layouts/TopXListLayout';
import { AffiliateLink } from '@/components/mdx/AffiliateLink';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge"; // Voorbeeld Shadcn component
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Voorbeeld Shadcn component
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Voorbeeld Shadcn component
import Image from 'next/image'; // Voorbeeld voor afbeeldingen

export async function generateStaticParams() {
    const paths = await getAllContentPaths();
    return paths.map(path => ({
        category: path.category,
        slug: path.slug,
    }));
}

export async function generateMetadata({ params }: { params: { category: string, slug: string } }) {
    const item = await getContentItem(decodeURIComponent(params.category), decodeURIComponent(params.slug));
    if (!item) {
        return { title: 'Content Niet Gevonden' };
    }
    return {
        title: item.metadata.title,
        description: item.metadata.excerpt,
        openGraph: {
            title: item.metadata.title,
            description: item.metadata.excerpt,
            images: item.metadata.featuredImage ? [item.metadata.featuredImage] : [],
        }
    };
}

const mdxComponents = {
    AffiliateLink,
    Alert,
    AlertTitle,
    AlertDescription,
    Badge,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Accordion, AccordionContent, AccordionItem, AccordionTrigger,
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        if (typeof props.src === 'string' && props.src.startsWith('/')) { // Interne afbeeldingen
            return <Image {...props as any} width={700} height={400} className="rounded-lg shadow-md my-6" />;
        }
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...props} className="rounded-lg shadow-md my-6" />; // Externe afbeeldingen
    },
    // Voeg hier andere custom componenten toe
};

export default async function ContentPage({ params }: { params: { category: string, slug: string } }) {
    const item = await getContentItem(decodeURIComponent(params.category), decodeURIComponent(params.slug));

    if (!item) {
        notFound();
    }

    const { metadata, content } = item;

    let LayoutComponent;
    switch (metadata.layoutType) {
        case 'repairGuide':
            LayoutComponent = RepairGuideLayout;
            break;
        case 'review':
            LayoutComponent = ReviewLayout;
            break;
        case 'topXList':
            LayoutComponent = TopXListLayout;
            break;
        case 'techExplained':
        case 'howTo':
        default:
            LayoutComponent = ArticleLayout;
            break;
    }

    return (
        <LayoutComponent metadata={metadata}>
            <MDXRemote
                source={content}
                components={mdxComponents}
                options={{
                    mdxOptions: {
                        // remarkPlugins:, // Voeg hier remark plugins toe indien nodig
                        // rehypePlugins:, // Voeg hier rehype plugins toe indien nodig
                    },
                }}
            />
        </LayoutComponent>
    );
}