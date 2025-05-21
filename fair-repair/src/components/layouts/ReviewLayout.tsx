import { ContentMetadata } from "@/lib/content";
import ArticleLayout from "./ArticleLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, ListX } from "lucide-react";

export default function ReviewLayout({ metadata, children }: { metadata: ContentMetadata, children: React.ReactNode }) {
    return (
        <ArticleLayout metadata={metadata}>
            <div className="not-prose my-8 p-6 bg-muted rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Review Samenvatting</h2>
                {metadata.reparabilityScore && <p><strong>Repareerbaarheidsscore:</strong> <Badge variant={metadata.reparabilityScore >= 7 ? 'default' : metadata.reparabilityScore >= 4 ? 'secondary' : 'destructive'}>{metadata.reparabilityScore}/10</Badge></p>}
                {/* Voeg hier andere review-specifieke metadata toe */}
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                    {metadata.pros && metadata.pros.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-green-600"><ListChecks className="mr-2 h-5 w-5" /> Voordelen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-5 space-y-1">
                                    {metadata.pros.map((pro: string) => <li key={pro}>{pro}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                    {metadata.cons && metadata.cons.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-red-600"><ListX className="mr-2 h-5 w-5" /> Nadelen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-5 space-y-1">
                                    {metadata.cons.map((con: string) => <li key={con}>{con}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
            {children}
        </ArticleLayout>
    );
}