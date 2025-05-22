interface SectionTitleProps {
    title: string;
    subtitle?: string;
    className?: string;
    textAlignment?: 'text-center' | 'text-left' | 'text-right';
}

export default function SectionTitle({ title, subtitle, className = '', textAlignment = 'text-center' }: SectionTitleProps) {
    return (
        <div className={`mb-8 md:mb-10 ${textAlignment} ${className}`}>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {title}
            </h2>
            {subtitle && <p className="mt-2 text-md text-muted-foreground max-w-xl mx-auto (if text-center)">{subtitle}</p>}
        </div>
    );
}