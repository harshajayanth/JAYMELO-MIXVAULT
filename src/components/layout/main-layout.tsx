import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { SearchCommand } from "@/components/feature/search-command";

export function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout } = useAuth();

  const [location] = useLocation();

  return (
    <div
      className="
      relative
      min-h-screen
      w-full
      overflow-hidden
      text-foreground
      bg-transparent
      selection:bg-cyan-400/30
    "
    >
      {/* ================= GLOBAL BACKGROUND ================= */}

      <div className="fixed inset-0 z-[-2] overflow-hidden">
        {/* Base Atmosphere */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#071a2f_0%,#02030A_60%)]" />

        {/* Left Cyan Glow */}

        <div className="absolute top-[-200px] left-[-120px] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[180px]" />

        {/* Right Blue Glow */}

        <div className="absolute top-[10%] right-[-150px] h-[650px] w-[650px] rounded-full bg-blue-500/10 blur-[180px]" />

        {/* Bottom Glow */}

        <div className="absolute bottom-[-300px] left-1/3 h-[700px] w-[700px] rounded-full bg-cyan-400/10 blur-[200px]" />

        {/* Mesh Grid */}

        <div
          className="
          absolute
          inset-0
          opacity-[0.03]
          bg-[linear-gradient(rgba(0,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.12)_1px,transparent_1px)]
          bg-[size:80px_80px]
        "
        />

        {/* Scanlines */}

        <div
          className="
          absolute
          inset-0
          opacity-[0.025]
          bg-[linear-gradient(to_bottom,transparent_0%,white_50%,transparent_100%)]
          bg-[length:100%_8px]
        "
        />
      </div>

      {/* ================= HEADER ================= */}

      {isAuthenticated && (
        <header
          className="
          fixed
          top-0
          left-0
          right-0
          z-50
          px-6
          py-4
          border-b
          border-cyan-400/10
          bg-[#050816]/70
          backdrop-blur-2xl
          shadow-[0_0_40px_rgba(0,255,255,0.04)]
        "
        >
          <div className="flex items-center justify-between">
            {/* LEFT */}

            <Link href="/">
              <div
                className="
                flex
                items-center
                gap-4
                cursor-pointer
                transition-all
                duration-300
                hover:scale-[1.02]
              "
              >
                {/* Profile */}

                <div
                  className="
                  relative
                  h-12
                  w-12
                  rounded-full
                  overflow-hidden
                  border
                  border-cyan-400/20
                  shadow-[0_0_30px_rgba(0,255,255,0.15)]
                "
                >
                  {/* Glow */}

                  <div className="absolute inset-0 bg-cyan-400/10 blur-xl" />

                  <img
                    src="/images/profile.jpg"
                    alt="Profile"
                    className="relative z-10 h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "/images/blank.jpeg";
                    }}
                  />
                </div>

                {/* Brand */}

                <div className="hidden md:block">
                  <h1
                    className="
                    text-xl
                    font-black
                    tracking-tight
                    bg-gradient-to-r
                    from-cyan-300
                    via-white
                    to-cyan-500
                    bg-clip-text
                    text-transparent
                    drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]
                  "
                  >
                    <span className="text-yellow-400">
                      JAYMELO
                    </span>{" "}
                    MixVault
                  </h1>

                  <p className="text-xs tracking-[0.25em] uppercase text-cyan-100/40">
                    Audio Intelligence System
                  </p>
                </div>
              </div>
            </Link>

            {/* RIGHT */}

            <div className="flex items-center gap-4">
              {/* Search */}

              <div
                className="
                rounded-2xl
                border
                border-cyan-400/10
                bg-cyan-500/[0.03]
                backdrop-blur-xl
              "
              >
                <SearchCommand />
              </div>

              {/* Logout */}

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Logout"
                data-testid="button-logout"
                className="
                rounded-2xl
                border
                border-cyan-400/10
                bg-cyan-500/[0.03]
                hover:bg-cyan-500/10
                hover:border-cyan-300/20
                transition-all
                duration-300
              "
              >
                <LogOut className="h-4 w-4 text-cyan-200" />
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* ================= MAIN ================= */}

      <main
        className="
        relative
        z-10
        pt-28
        pb-14
        px-4
        md:px-8
        w-full
      "
      >
        {children}
      </main>
    </div>
  );
}