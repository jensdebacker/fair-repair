import ArticleLayout from "./ArticleLayout";
import { Reparatiegids } from "@/lib/types"; // Import the correct type
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export default function RepairGuideLayout({ metadata, children }: { metadata: Reparatiegids, children: React.ReactNode }) {
    return (
        <ArticleLayout metadata={metadata}>
            <div className="not-prose my-8 p-6 bg-muted rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Reparatie Details</h2>

                {metadata.difficulty && (
                    <p>
                        <strong>Moeilijkheidsgraad:</strong>
                        <Badge
                            variant={
                                metadata.difficulty === 'makkelijk' ? 'default' :
                                    metadata.difficulty === 'gemiddeld' ? 'secondary' :
                                        'destructive'
                            }
                            className="ml-2"
                        >
                            {metadata.difficulty.charAt(0).toUpperCase() + metadata.difficulty.slice(1)}
                        </Badge>
                    </p>
                )}

                {/* Note: reparabilityScore is not in Reparatiegids interface, but if you need it, add it to the interface */}

                {metadata.tools && metadata.tools.length > 0 && (
                    <>
                        <h3 className="text-xl font-semibold mt-4 mb-2">Benodigde Tools:</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tool</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {metadata.tools.map((tool: string, index: number) => (
                                    <TableRow key={index}>
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