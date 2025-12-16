import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { JsonUploader } from "@/components/feature/json-uploader";
import { SearchCommand } from "@/components/feature/search-command";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen w-full text-foreground bg-background selection:bg-primary/30">
      {/* Header */}
      {isAuthenticated && (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-background/50 backdrop-blur-md border-b border-white/5">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity mr-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <div className="flex w-full justify-center">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/30 mb-2">
            <img
              src="/images/profile.jpg"
              alt="Profile"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null; 
                e.currentTarget.src = "/images/blank.jpeg";
              }}
            />
          </div>
        </div>
              </div>
              <span className="font-display font-semibold text-lg tracking-tight hidden md:block"><span className="text-yellow-400">JAYMELO</span> MixVault</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <SearchCommand />
            <JsonUploader />
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="rounded-full hover:bg-white/5 hover:text-destructive transition-colors"
              title="Logout"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] mix-blend-screen opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] mix-blend-screen opacity-30" />
      </div>
    </div>
  );
}
