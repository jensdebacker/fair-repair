// src/app/(site)/top-lijsten/[slug]/page.tsx
import { getAllSlugsForContentType, getContentItemBySlugAndType } from '@/lib/content';
import { TopXList } from '@/lib/types';
import TopXListLayout from '@/components/layouts/TopXListLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
    return getAllSlugsForContentType('top-lijsten');
}

interface PageProps { params: { slug: string }; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const list = await getContentItemBySlugAndType<TopXList>('top-lijsten', params.slug);
    if (!list) return { title: 'Lijst niet gevonden' };
    return { title: list.title, description: list.summary };
}

export default async function TopXListPage({ params }: PageProps) {
    const list = await getContentItemBySlugAndType<TopXList>('top-lijsten', params.slug);
    if (!list) notFound();
    return <TopXListLayout list={list} />;
}