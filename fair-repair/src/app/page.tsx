import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { getAllContentMetadata } from '@/lib/content'; // Functie om metadata te lezen

export default async function HomePage() {
  const allPosts = await getAllContentMetadata(); // Implementeer deze functie

  // Filter en sorteer posts voor verschillende secties
  const recentArticles = allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3); // Toon 3 meest recente

  const featuredRepairs = allPosts
    .filter(post => post.layoutType === 'repairGuide' && post.reparabilityScore && post.reparabilityScore >= 7)
    .slice(0, 2); // Toon 2 uitgelichte reparatiegidsen

  return (
    <div>
      <section className="text-center py-12 bg-muted -mx-4 px-4 sm:-mx-8 md:-mx-16 lg:-mx-24">
        <h1 className="text-4xl font-bold text-primary mb-4">Welkom bij Fair-repair</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Uw gids voor duurzame en repareerbare consumentenelektronica in de Benelux.
        </p>
        <Button asChild size="lg">
          <Link href="/over-ons">Meer over onze missie</Link>
        </Button>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-semibold mb-8 text-center">Recente Artikelen</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {recentArticles.map(post => (
            <Card key={post.slug}>
              <CardHeader>
                {post.featuredImage && (
                  <img src={post.featuredImage} alt={post.title} className="rounded-t-lg mb-4 aspect-video object-cover" />
                )}
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{new Date(post.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })} - {post.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                <Button variant="link" asChild className="p-0 mt-4">
                  <Link href={`/${post.category}/${post.slug}`}>Lees meer</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {featuredRepairs.length > 0 && (
        <section className="py-12 bg-secondary/50 -mx-4 px-4 sm:-mx-8 md:-mx-16 lg:-mx-24">
          <h2 className="text-3xl font-semibold mb-8 text-center">Uitgelichte Reparaties</h2>
          <div className="grid md:grid-cols-2 gap-6 container">
            {/* Vergelijkbare Card structuur voor featuredRepairs */}
          </div>
        </section>
      )}

      <section className="py-12">
        <h2 className="text-3xl font-semibold mb-8 text-center">Ontdek per Categorie</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Knoppen of kaarten naar categoriepagina's */}
          {['smartphones', 'tablets', 'smartwatches', 'gameconsoles'].map(cat => (
            <Button key={cat} variant="outline" size="lg" asChild className="h-24 text-lg">
              <Link href={`/${cat}`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Link>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}