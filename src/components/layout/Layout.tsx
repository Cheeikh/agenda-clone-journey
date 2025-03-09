
import React, { ReactNode } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <header className="h-12 bg-primary text-primary-foreground flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Google Agenda Clone</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8 text-primary-foreground hover:text-white hover:bg-primary-foreground/20"
          >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
        </header>
        {children}
      </div>
    </SidebarProvider>
  );
};
