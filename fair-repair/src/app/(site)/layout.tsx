// app/(site)/layout.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

// 👇 AGAIN, THIS IS THE CRUCIAL PART
export default function SiteLayout({ // Must be a default export and a function
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-dvh">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-24 md:pb-10">
                {children}
            </main>
            <Footer />
            <MobileNav />
        </div>
    );
}