import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
    return (
        // Full-width section, adjust negative margins if your global container has padding
        <section className="relative bg-slate-700 text-white py-16 md:py-24 lg:py-32 -mx-4 sm:-mx-6 lg:-mx-8">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('/images/hero-background.jpg')" }} // De afbeelding van de printplaat
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-800/80 via-slate-800/60 to-slate-800/20" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                    Your Guide to Sustainable Electronics
                </h1>
                <p className="text-md sm:text-lg md:text-xl text-slate-200 mb-8 md:mb-10 max-w-3xl mx-auto">
                    Empowering consumers with the knowledge and resources to repair and maintain their devices,
                    promoting sustainable practices in the Benelux.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base">
                        <Link href="/guides">Find Repair Guides</Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white/10 px-8 py-3 text-base">
                        <Link href="/over-ons">Our Mission</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}