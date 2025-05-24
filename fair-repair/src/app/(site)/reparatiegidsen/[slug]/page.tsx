// src/app/(site)/reparatiegidsen/[slug]/page.tsx
import { getAllSlugsForContentType, getContentItemBySlugAndType } from '@/lib/content';
import { Reparatiegids } from '@/lib/types';
import RepairGuideLayout from '@/components/layouts/RepairGuideLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
    return getAllSlugsForContentType('reparatiegidsen');
}

interface PageProps { params: { slug: string }; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const gids = await getContentItemBySlugAndType<Reparatiegids>('reparatiegidsen', params.slug);
    if (!gids) return { title: 'Gids niet gevonden' };
    return { title: gids.title, description: gids.summary };
}

export default async function ReparatiegidsPage({ params }: PageProps) {
    const gids = await getContentItemBySlugAndType<Reparatiegids>('reparatiegidsen', params.slug);
    if (!gids) notFound();
    return <RepairGuideLayout guide={gids} />;
}