// app/(site)/articles/[...slug]/page.tsx
import { getArticleData, getAllArticleSlugsForStaticParams } from '@/lib/markdown';
import { ArticlePost } from '@/lib/types'; // Gebruik het nieuwe type
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
    params: { slug: string[] }; // slug is een array: bv. ["how-to", "artikelnaam"]
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const post = await getArticleData(params.slug);
        return {
            title: post.title,
            description: post.excerpt,
            keywords: post.tags || [],
            openGraph: {
                title: post.title,
                description: post.excerpt,
                type: 'article',
                publishedTime: post.date,
                authors: post.author ? [post.author] : undefined,
                images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
            }
        };
    } catch (error) {
        return { title: "Artikel Niet Gevonden" };
    }
}

export async function generateStaticParams() {
    const articles = getAllArticleSlugsForStaticParams(); // Geeft { params: { slug: string[] } }[]
    return articles.map(article => ({
        slug: article.params.slug,
    }));
}

export default async function ArticlePage({ params }: Props) {
    let post: ArticlePost;
    try {
        post = await getArticleData(params.slug);
    } catch (error) {
        console.error(`Error fetching article /articles/${params.slug.join('/')}:`, error);
        notFound();
    }

    // Breadcrumb type with optional isActive
    type Breadcrumb = { label: string; href: string; isActive?: boolean };

    // Voorbeeld breadcrumbs
    const breadcrumbs: Breadcrumb[] = [{ label: "Home", href: "/" }, { label: "Artikelen", href: "/articles" }];
    if (post.categoryPath) {
        breadcrumbs.push({
            label: post.categoryPath.split('/').map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')).join(' > '),
            href: `/articles/${post.categoryPath}`
        });
    }
    breadcrumbs.push({ label: post.title, href: `/articles/${post.fullSlug}`, isActive: true });


    return (
        <article className="prose prose-slate dark:prose-invert lg:prose-xl max-w-4xl mx-auto py-8 px-4">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
                <ol className="list-none p-0 inline-flex">
                    {breadcrumbs.map((crumb, index) => (
                        <li key={index} className="flex items-center">
                            {!crumb.isActive ? (
                                <a href={crumb.href} className="hover:text-primary">{crumb.label}</a>
                            ) : (
                                <span className="text-foreground font-medium">{crumb.label}</span>
                            )}
                            {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                        </li>
                    ))}
                </ol>
            </nav>

            <h1 className="mb-3 text-3xl md:text-4xl font-extrabold leading-tight">{post.title}</h1>
            {post.featuredImage && (
                <img src={post.featuredImage} alt={post.title} className="w-full h-auto object-cover rounded-lg my-6 max-h-[500px]" />
            )}
            <p className="text-muted-foreground text-base mb-1">
                Gepubliceerd: {new Date(post.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                {post.author && ` door ${post.author}`}
                {post.category && <span className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{post.category.replace(/-/g, ' ')}</span>}
            </p>

            <div className="mt-6" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>
    );
}