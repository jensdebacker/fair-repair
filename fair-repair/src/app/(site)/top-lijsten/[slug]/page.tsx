// src/app/(site)/top-lijsten/[slug]/page.tsx
import { getAllSlugsForContentType, getContentItemBySlugAndType } from '@/lib/content';
import { TopXList } from '@/lib/types';
import TopXListLayout from '@/components/layouts/TopXListLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
    return getAllSlugsForContentType('top-lijsten');
}

interface PageProps {
    params: { slug: string };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const list = await getContentItemBySlugAndType<TopXList>('top-lijsten', params.slug);

    if (!list) {
        return {
            title: 'Lijst niet gevonden',
            description: 'Deze lijst kon niet worden gevonden.'
        };
    }

    return {
        title: list.title,
        description: list.summary,
        openGraph: {
            title: list.title,
            description: list.summary,
            images: list.image ? [{ url: list.image }] : [],
        },
    };
}

export default async function TopXListPage(props: PageProps) {
    const params = await props.params;
    const list = await getContentItemBySlugAndType<TopXList>('top-lijsten', params.slug);


    if (!list) {
        notFound();
    }

    // Fix: TopXListLayout expects both metadata and children props
    return (
        <TopXListLayout metadata={list}>
            {/* Add your content here if needed */}
            <div className="content">
                <h1>{list.title}</h1>
                <p>{list.summary}</p>
                <div dangerouslySetInnerHTML={{ __html: list.body }} />

                {/* You can add more content here if needed */}
            </div>
        </TopXListLayout>
    );
}