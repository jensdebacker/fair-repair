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

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const gids = await getContentItemBySlugAndType<Reparatiegids>('reparatiegidsen', params.slug);
    if (!gids) return { title: 'Gids niet gevonden' };
    return { title: gids.title, description: gids.summary };
}

export default async function ReparatiegidsPage(props: PageProps) {
    const params = await props.params;
    const gids = await getContentItemBySlugAndType<Reparatiegids>('reparatiegidsen', params.slug);
    if (!gids) notFound();
    return <RepairGuideLayout metadata={gids}>
        <div className="content">
            <h1>{gids.title}</h1>
            <p>{gids.summary}</p>
            {/* You can add more content here if needed */}
            <div dangerouslySetInnerHTML={{ __html: gids.body }} />

        </div>
    </RepairGuideLayout>;
}