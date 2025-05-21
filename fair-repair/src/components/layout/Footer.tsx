export default function Footer() {
    return (
        <footer className="border-t border-border/40 py-8 bg-muted">
            <div className="container text-center text-muted-foreground text-sm">
                <p>&copy; {new Date().getFullYear()} Fair-repair. Alle rechten voorbehouden.</p>
                <p className="mt-2">
                    Gebouwd met Next.js, Tailwind CSS, en Shadcn/UI.
                </p>
                {/* Voeg hier eventueel extra links toe, zoals privacybeleid, contact, etc. */}
            </div>
        </footer>
    );
}