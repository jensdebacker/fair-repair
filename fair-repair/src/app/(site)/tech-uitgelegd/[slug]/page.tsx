// src/app/(site)/tech-uitgelegd/[slug]/page.tsx
import { getAllSlugsForContentType, getContentItemBySlugAndType } from '@/lib/content';
import { TechUitgelegd } from '@/lib/types';
import ArticleLayout from '@/components/layouts/ArticleLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
    return getAllSlugsForContentType('tech-uitgelegd');
}

interface PageProps { params: { slug: string }; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const item = await getContentItemBySlugAndType<TechUitgelegd>('tech-uitgelegd', params.slug);
    if (!item) return { title: 'Artikel niet gevonden' };
    return { title: item.title, description: item.summary };
}

export default async function TechUitgelegdPage({ params }: PageProps) {
    const item = await getContentItemBySlugAndType<TechUitgelegd>('tech-uitgelegd', params.slug);
    if (!item) notFound();
    return <ArticleLayout content={item} />;
}