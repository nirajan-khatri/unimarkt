'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, MessageCircle, User, X } from 'lucide-react';

export function Header({isSidebarOpen, setIsSidebarOpen}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
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