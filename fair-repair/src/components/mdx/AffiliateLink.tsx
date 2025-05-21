import React from 'react';
import { ExternalLinkIcon } from 'lucide-react';

interface AffiliateLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
    showIcon?: boolean;
}

export const AffiliateLink: React.FC<AffiliateLinkProps> = ({ href, children, showIcon = false, className, ...props }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="sponsored noopener noreferrer" // Belangrijk voor affiliate links
            className={`text-primary hover:underline inline-flex items-center ${className}`}
            {...props}
        >
            {children}
            {showIcon && <ExternalLinkIcon className="inline-block w-4 h-4 ml-1" />}
        </a>
    );
};