// src/app/(site)/tech-uitgelegd/[slug]/page.tsx
import { getAllSlugsForContentType, getContentItemBySlugAndType } from '@/lib/content';
import { TechUitgelegd } from '@/lib/types';
import ArticleLayout from '@/components/layouts/ArticleLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
    return getAllSlugsForContentType('tech-uitgelegd');
}

interface PageProps {
    params: { slug: string };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const item = await getContentItemBySlugAndType<TechUitgelegd>('tech-uitgelegd', params.slug);

    if (!item) {
        return {
            title: 'Artikel niet gevonden',
            description: 'Dit artikel kon niet worden gevonden.'
        };
    }

    return {
        title: item.title,
        description: item.summary,
        openGraph: {
            title: item.title,
            description: item.summary,
            images: item.image ? [{ url: item.image }] : [],
        },
    };
}

export default async function TechUitgelegdPage(props: PageProps) {
    const params = await props.params;
    const item = await getContentItemBySlugAndType<TechUitgelegd>('tech-uitgelegd', params.slug);

    if (!item) {
        notFound();
    }

    // Fix: Use 'metadata' instead of 'content' to match ArticleLayout expectation
    return <ArticleLayout metadata={item} />;
}