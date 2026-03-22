'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, MessageCircle, User, X } from 'lucide-react';

export function Header({isSidebarOpen, setIsSidebarOpen}: {isSidebarOpen: boolean; setIsSidebarOpen: (v: boolean) => void}) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <Link href="/" className="ml-2 font-semibold">
              UniMarkt
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                pathname === '/' 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              Home
              {pathname === '/' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></span>
              )}
            </Link>
            <Link 
              href="/skills" 
              className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                pathname === '/skills' 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              Skills
              {pathname === '/skills' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></span>
              )}
            </Link>
          </div>
        </div>

        {/* Right side - Icons */}
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Messages"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </header>
  );
}