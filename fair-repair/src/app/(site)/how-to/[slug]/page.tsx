// src/app/(site)/how-to/[slug]/page.tsx
import { getAllSlugsForContentType, getContentItemBySlugAndType } from '@/lib/content';
import { HowToGids } from '@/lib/types';
import ArticleLayout from '@/components/layouts/ArticleLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
    return getAllSlugsForContentType('how-to');
}

interface PageProps { params: { slug: string }; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = params; // Destructure slug

    const item = await getContentItemBySlugAndType<HowToGids>('how-to', slug);
    if (!item) return { title: 'Artikel niet gevonden' };
    return { title: item.title, description: item.summary };
}

export default async function HowToPage({ params }: PageProps) {
    const { slug } = params; // Destructure slug
    const howto = await getContentItemBySlugAndType<HowToGids>('how-to', slug); if (!howto) notFound();
    return <ArticleLayout metadata={howto} />;
}