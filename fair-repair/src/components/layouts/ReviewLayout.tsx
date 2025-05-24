import { Review } from "@/lib/types";
import ArticleLayout from "./ArticleLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, ListX } from "lucide-react";

export default function ReviewLayout({ content }: { content: Review }) {
    return (
        <ArticleLayout metadata={content}>
            <div className="not-prose my-8 p-6 bg-muted rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Review Samenvatting</h2>
                <div className="mb-4">
                    <p><strong>Product:</strong> {content.productName}</p>
                    <p><strong>Merk:</strong> {content.brand}</p>
                    <p><strong>Repareerbaarheidsscore:</strong>
                        <Badge
                            variant={content.reparabilityScore >= 7 ? 'default' : content.reparabilityScore >= 4 ? 'secondary' : 'destructive'}
                            className="ml-2"
                        >
                            {content.reparabilityScore}/10
                        </Badge>
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                    {content.pros && content.pros.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-green-600">
                                    <ListChecks className="mr-2 h-5 w-5" /> Voordelen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-5 space-y-1">
                                    {content.pros.map((pro: string, index: number) => (
                                        <li key={index}>{pro}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                    {content.cons && content.cons.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-red-600">
                                    <ListX className="mr-2 h-5 w-5" /> Nadelen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-5 space-y-1">
                                    {content.cons.map((con: string, index: number) => (
                                        <li key={index}>{con}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Render the actual review content */}
            <div dangerouslySetInnerHTML={{ __html: content.body }} />
        </ArticleLayout>
    );
}