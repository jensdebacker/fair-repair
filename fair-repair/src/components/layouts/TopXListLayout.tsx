import { ContentMetadata } from "@/lib/content";
import ArticleLayout from "./ArticleLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AffiliateLink } from "@/components/mdx/AffiliateLink"; // Hergebruik de MDX component
import Image from "next/image";

interface Product {
    name: string;
    image?: string;
    affiliateLink: string;
    pros?: string[];
    cons?: string[];
    description?: string;
}

export default function TopXListLayout({ metadata, children }: { metadata: ContentMetadata & { products?: Product[] }, children: React.ReactNode }) {
    return (
        <ArticleLayout metadata={metadata}>
            {/* De MDX content (introductie etc.) komt hier via children */}
            {children}
            <div className="mt-8 space-y-8 not-prose">
                {metadata.products && metadata.products.map((product: Product, index: number) => (
                    <Card key={index} className="overflow-hidden">
                        <div className="md:flex">
                            {product.image && (
                                <div className="md:w-1/3 relative aspect-square md:aspect-auto">
                                    <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" />
                                </div>
                            )}
                            <div className="md:w-2/3">
                                <CardHeader>
                                    <CardTitle>{index + 1}. {product.name}</CardTitle>
                                    {product.description && <CardDescription>{product.description}</CardDescription>}
                                </CardHeader>
                                <CardContent>
                                    {product.pros && product.pros.length > 0 && (
                                        <>
                                            <h4 className="font-semibold text-green-600">Voordelen:</h4>
                                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                                {product.pros.map(pro => <li key={pro}>{pro}</li>)}
                                            </ul>
                                        </>
                                    )}
                                    {product.cons && product.cons.length > 0 && (
                                        <>
                                            <h4 className="font-semibold text-red-600 mt-2">Nadelen:</h4>
                                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                                {product.cons.map(con => <li key={con}>{con}</li>)}
                                            </ul>
                                        </>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <AffiliateLink href={product.affiliateLink} showIcon>
                                        <Button>Bekijk prijs / Koop nu</Button>
                                    </AffiliateLink>
                                </CardFooter>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            {metadata.affiliateDisclaimer !== false && (
                <p className="text-xs text-muted-foreground mt-8 italic">
                    Disclaimer: Deze pagina bevat affiliate links. Als u via deze links een aankoop doet, ontvangen wij mogelijk een kleine commissie zonder extra kosten voor u.
                </p>
            )}
        </ArticleLayout>
    );
}