import { getAllSlugsForContentType, getContentItemBySlugAndType } from '@/lib/content';
import { Review } from '@/lib/types';
import ReviewLayoutComponent from '@/components/layouts/ReviewLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
    params: { slug: string };
}

export async function generateStaticParams() {
    return getAllSlugsForContentType('reviews');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const reviewItem = await getContentItemBySlugAndType<Review>('reviews', params.slug);

    if (!reviewItem) {
        return {
            title: 'Review niet gevonden',
            description: 'Deze review kon niet worden gevonden.',
        };
    }

    return {
        title: reviewItem.title,
        description: reviewItem.summary,
        openGraph: {
            title: reviewItem.title,
            description: reviewItem.summary,
            images: reviewItem.image ? [{ url: reviewItem.image }] : [],
        },
    };
}

export default async function ReviewPage({ params }: PageProps) {
    const reviewData = await getContentItemBySlugAndType<Review>('reviews', params.slug);

    if (!reviewData) {
        notFound();
    }

    // Use 'content' prop name to match ReviewLayout expectation
    return <ReviewLayoutComponent content={reviewData} />;
}