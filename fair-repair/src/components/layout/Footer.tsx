import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-t bg-muted/50 text-muted-foreground">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8 py-6 text-sm">
                <p className="mb-2 md:mb-0">&copy; {currentYear} Fair-repair. All rights reserved.</p>
                <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                    <Link href="/over-ons" className="hover:text-primary transition-colors">About Us</Link>
                    <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link href="/tos" className="hover:text-primary transition-colors">Terms of Service</Link>
                    {/* <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link> */}
                </nav>
            </div>
        </footer>
    );
}