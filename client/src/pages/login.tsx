import { useEffect } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/hooks/use-toast";


export default function LoginPage() {
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Prevent scroll on login page
  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setLocation("/");
      toast({ title: "Welcome back", description: "Successfully logged in to MixVault" });
    } else {
      toast({ 
        title: "Access Denied", 
        description: "Incorrect password", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="fixed inset-0 z-0 overflow-hidden">
          {/* Background image with animation */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/login.jpg')" }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Glass overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

          {/* Glow effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
          </div>
        </div>

      <GlassCard className="w-full max-w-md p-8 flex flex-col items-center text-center space-y-6">
        <div className="flex w-full justify-center">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/30 mb-2">
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


        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-white"><span className="text-yellow-400">JAYMELO</span> MixVault</h1>
          <p className="text-muted-foreground m-4">Enter your access code to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/5 border-white/10 text-center text-lg h-12 tracking-widest placeholder:tracking-normal focus:border-primary/50 focus:ring-primary/20 transition-all"
            data-testid="input-password"
            autoFocus
          />
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
            data-testid="button-login"
          >
            Unlock Vault
          </Button>
        </form>

        <p className="text-xs text-muted-foreground/50 pt-4">
          Personal use only. Unauthorized access prohibited.
        </p>
      </GlassCard>
    </div>
  );
}
