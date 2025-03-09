
import React, { ReactNode } from 'react';
import { MoonIcon, SunIcon, PanelLeftClose, PanelLeft } from 'lucide-react';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

interface LayoutProps {
  children: ReactNode;
}

const LayoutContent: React.FC<LayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const { state, toggleSidebar } = useSidebar();
  const isSidebarOpen = state === 'expanded';

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <header className="h-12 bg-primary text-primary-foreground flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-primary-foreground hover:text-white hover:bg-primary-foreground/20"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </Button>
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
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};
