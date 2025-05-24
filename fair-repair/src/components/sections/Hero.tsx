import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-full bg-slate-800 text-white pt-50 pb-15 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 rounded-2xl">
            {/* Background Image - Circuit Board */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-slate-900/70 rounded-2xl" />

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center justify-center ">
                <div className="text-left  max-w-6xl">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Your Guide to Sustainable Electronics
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-200 mb-8  mx-auto leading-relaxed">
                        Empowering consumers with the knowledge and resources to repair and maintain their devices,
                        promoting sustainability and reducing e-waste in the Benelux.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            size="lg"
                            asChild
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold"
                        >
                            <Link href="/guides">Find Repair Guides</Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            asChild
                            className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3 text-base font-semibold"
                        >
                            <Link href="/over-ons">Our Mission</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}