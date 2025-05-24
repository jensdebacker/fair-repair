// src/app/(site)/reviews/[slug]/page.tsx
import { getAllSlugsForContentType, getContentItemBySlugAndType } from '@/lib/content';
import { Review } from '@/lib/types';
import ReviewLayout from '@/components/layouts/ReviewLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
    return getAllSlugsForContentType('reviews');
}

interface PageProps { params: { slug: string }; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const review = await getContentItemBySlugAndType<Review>('reviews', params.slug);
    if (!review) return { title: 'Review niet gevonden' };
    return { title: review.title, description: review.summary };
}

export default async function ReviewPage({ params }: PageProps) {
    const review = await getContentItemBySlugAndType<Review>('reviews', params.slug);
    if (!review) notFound();
    return <ReviewLayout review={review} />;
}