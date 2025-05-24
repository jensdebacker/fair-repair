// components/shared/ArticleCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ArticlePost, GuidePost, PostFrontMatter } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { CalendarDays, ArrowRight, BookOpen, Wrench, Clock, Eye } from 'lucide-react';
import { Button } from '../ui/button';

interface ArticleCardProps {
    item: (Omit<ArticlePost, 'contentHtml'> & { layoutType: 'article' }) | (Omit<GuidePost, 'contentHtml'> & { layoutType: 'guide' });
}

export default function ArticleCard2({ item }: ArticleCardProps) {
    let href: string;
    let title: string;
    let excerpt: string;
    let featuredImage: string | undefined;
    let date: string;
    let category: string;

    if (item.layoutType === 'article') {
        // @ts-ignore
        href = `/articles/${item.fullSlug}`;
        title = item.title;
        excerpt = item.excerpt;
        featuredImage = item.featuredImage;
        date = item.date;
        category = item.category;
    } else if (item.layoutType === 'guide') {
        // @ts-ignore
        href = `/guides/${item.slug}`;
        title = item.title;
        excerpt = item.excerpt;
        featuredImage = item.featuredImage;
        date = item.date;
        category = item.category;
    } else {
        return <p>Error: Unknown item type</p>;
    }

    const formattedDate = new Date(date).toLocaleDateString('nl-NL', {
        year: 'numeric', month: 'short', day: 'numeric',
    });

    const isGuide = item.layoutType === 'guide';

    return (
        <Card className="group relative overflow-hidden bg-white dark:bg-slate-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 rounded-2xl">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl" />
            </div>

            <div className="relative z-10">
                {/* Image with Overlay Effects */}
                {featuredImage && (
                    <div className="relative overflow-hidden rounded-t-2xl">
                        <Link href={href} className="block aspect-video relative group">
                            <Image
                                src={featuredImage}
                                alt={title}
                                fill
                                sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                                className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Floating Category Badge */}
                            <div className="absolute top-4 left-4">
                                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-lg transition-all duration-300 ${isGuide
                                    ? 'bg-blue-500/90 text-white border-blue-400/30'
                                    : 'bg-emerald-500/90 text-white border-emerald-400/30'
                                    }`}>
                                    {isGuide ? <Wrench className="w-3 h-3 mr-1" /> : <BookOpen className="w-3 h-3 mr-1" />}
                                    {isGuide ? "Reparatie Gids" : "Artikel"}
                                </div>
                            </div>

                            {/* View More Hint */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                <div className="bg-white/20 backdrop-blur-md rounded-full p-2">
                                    <Eye className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Content Section */}
                <div className="p-6 space-y-4">
                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <CalendarDays className="w-3 h-3 mr-1" />
                                <span>{formattedDate}</span>
                            </div>
                            {category && (
                                <div className="flex items-center">
                                    <span className="w-1 h-1 bg-slate-400 rounded-full mr-2" />
                                    <span className="capitalize">{category.replace(/-/g, ' ')}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center text-slate-400">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>5 min</span>
                        </div>
                    </div>

                    {/* Title */}
                    <CardTitle className="text-xl font-bold leading-tight text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-300">
                        <Link href={href} className="line-clamp-2">
                            {title}
                        </Link>
                    </CardTitle>

                    {/* Excerpt */}
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                        {excerpt}
                    </p>

                    {/* Action Button */}
                    <div className="pt-2">
                        <Link href={href}>
                            <Button
                                variant="ghost"
                                className="group/btn p-0 h-auto font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                            >
                                <span className="mr-2">Lees verder</span>
                                <div className="relative overflow-hidden">
                                    <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover/btn:translate-x-1" />
                                    <ArrowRight className="w-4 h-4 absolute inset-0 -translate-x-4 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300" />
                                </div>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Bottom Accent Line */}
                <div className={`h-1 w-full bg-gradient-to-r transition-all duration-500 ${isGuide
                    ? 'from-blue-500 to-purple-500'
                    : 'from-emerald-500 to-blue-500'
                    } scale-x-0 group-hover:scale-x-100 origin-left`} />
            </div>
        </Card>
    );
}