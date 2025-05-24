import ArticleLayout from "./ArticleLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AffiliateLink } from "@/components/mdx/AffiliateLink"; // Hergebruik de MDX component
import Image from "next/image";
import { TopXList } from "@/lib/types";

interface Product {
    name: string;
    image?: string;
    affiliateLink: string;
    pros?: string[];
    cons?: string[];
    description?: string;
}

export default function TopXListLayout({ metadata, children }: { metadata: TopXList; children: React.ReactNode }) {
    return (
        <ArticleLayout metadata={metadata}>
            {/* TopX-specific content zoals productenlijst */}
            <div className="products-grid">
                {metadata.products && metadata.products.length > 0 && metadata.products.map(product => (
                    <Card key={product.name} className="product-card">
                        {product.image && (
                            <Image src={product.image} alt={product.name} width={200} height={200} />
                        )}
                        <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Remove description if not present in product type */}
                            {product.pros && product.pros.length > 0 && (
                                <ul>
                                    {product.pros.map((pro, idx) => (
                                        <li key={idx}>+ {pro}</li>
                                    ))}
                                </ul>
                            )}
                            {product.cons && product.cons.length > 0 && (
                                <ul>
                                    {product.cons.map((con, idx) => (
                                        <li key={idx}>- {con}</li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                        <CardFooter>
                            <AffiliateLink href={product.link}>
                                <Button>Bekijk product</Button>
                            </AffiliateLink>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {children}
        </ArticleLayout>
    );
}