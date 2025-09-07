
"use client";

import Link from 'next/link';
import { Globe, Github } from 'lucide-react';

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);


export function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center justify-center bg-background/80 backdrop-blur-xl border border-border/60 rounded-full shadow-lg px-6 py-2.5">
        <div className="flex items-center justify-center">
            <span className="font-headline text-lg font-semibold whitespace-nowrap">Made by Vatsa Joshi</span>
        </div>
        <div className="w-px h-6 bg-border/80 mx-4"></div>
        <div className="flex items-center justify-end space-x-1">
            <Link
              href="https://vatsajoshi.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full p-2 text-sm font-medium text-muted-foreground ring-offset-background transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              title="Website"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Website</span>
            </Link>
            <Link
              href="https://github.com/Vatsa10"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full p-2 text-sm font-medium text-muted-foreground ring-offset-background transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/vatsa-joshi/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full p-2 text-sm font-medium text-muted-foreground ring-offset-background transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              title="LinkedIn"
            >
              <LinkedInIcon className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
        </div>
      </div>
    </nav>
  );
}
