import { ContentMetadata } from "@/lib/content";
import ArticleLayout from "./ArticleLayout"; // Kan ArticleLayout hergebruiken voor header/basis
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";


export default function RepairGuideLayout({ metadata, children }: { metadata: ContentMetadata, children: React.ReactNode }) {
    return (
        <ArticleLayout metadata={metadata}>
            <div className="not-prose my-8 p-6 bg-muted rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Reparatie Details</h2>
                {metadata.difficulty && <p><strong>Moeilijkheidsgraad:</strong> <Badge variant={metadata.difficulty === 'Eenvoudig' ? 'default' : metadata.difficulty === 'Gemiddeld' ? 'secondary' : 'destructive'}>{metadata.difficulty}</Badge></p>}
                {metadata.reparabilityScore && <p><strong>Repareerbaarheidsscore:</strong> {metadata.reparabilityScore}/10</p>}
                {metadata.toolsNeeded && metadata.toolsNeeded.length > 0 && (
                    <>
                        <h3 className="text-xl font-semibold mt-4 mb-2">Benodigde Tools:</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tool</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {metadata.toolsNeeded.map((tool: string) => (
                                    <TableRow key={tool}>
                                        <TableCell>{tool}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}
                {metadata.costBenefitAnalysis && (
                    <Alert className="mt-6">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Kosten-Batenanalyse</AlertTitle>
                        <AlertDescription>
                            {metadata.costBenefitAnalysis}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            {/* De MDX content (stappen etc.) komt hier via children */}
            {children}
        </ArticleLayout>
    );
}