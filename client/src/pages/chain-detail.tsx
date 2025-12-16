import { useState } from "react";
import bcrypt from "bcryptjs";
import { useRoute, Link } from "wouter";
import { useData } from "@/context/DataContext";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Download, Sliders, ChevronRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

function ChainDetailPage() {
  const [, params] = useRoute("/chain/:categoryId/:chainId");
  const { data } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [downloadPassword, setDownloadPassword] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const DOWNLOAD_PASSWORD_HASH = import.meta.env.VITE_DOWNLOAD_PASSWORD_HASH || "";

  const category = data.categories.find(c => c.id === params?.categoryId);
  const chain = category?.chains.find(c => c.id === params?.chainId);

  if (!category || !chain) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-display">Chain not found</h1>
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isValidUrl = (url?: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };


  const filteredSteps = chain.steps.filter(step => 
    step.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    step.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex justify-center overflow-hidden min-h-screen p-4">
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Background image */}
        <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/chain-detail.jpg')" }}
          />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80" />

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/10" />

        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
        </div>
      </div>
      <div className="space-y-8 w-full z-10">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href={`/category/${category.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>{category.name}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{chain.name}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-4xl font-display font-bold text-white">{chain.name}</h1>
            {chain.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {chain.description}
              </p>
            )}
          </div>
          
          {chain.downloadUrl && (
            <>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-xl h-12 px-6"
                onClick={() => setShowPasswordDialog(true)}
                data-testid="button-download-preset"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Preset
              </Button>
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent className="max-w-xs">
                  <DialogHeader>
                    <DialogTitle>Enter Download Password</DialogTitle>
                  </DialogHeader>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={downloadPassword}
                    onChange={e => setDownloadPassword(e.target.value)}
                    className="mt-2"
                    autoFocus
                  />
                  {downloadError && (
                    <div className="text-red-500 text-xs mt-2">{downloadError}</div>
                  )}
                  <DialogFooter>
                      <Button
                        onClick={async () => {
                          const match = await bcrypt.compare(
                            downloadPassword,
                            DOWNLOAD_PASSWORD_HASH
                          );

                          if (!match) {
                            setDownloadError("Incorrect password");
                            return;
                          }

                          if (!isValidUrl(chain.downloadUrl)) {
                            toast({
                              title: "Download unavailable",
                              description: "No valid download link found for this preset.",
                              variant: "destructive",
                            });
                            return;
                          }

                          setShowPasswordDialog(false);
                          setDownloadPassword("");
                          setDownloadError("");

                          window.open(chain.downloadUrl!, "_blank");
                        }}
                      >
                        Unlock Download
                      </Button>
                    </DialogFooter>

                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chain Steps Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2 text-cyan-400">
              <Sliders className="h-5 w-5 text-cyan-400" />
              Processing Chain
            </h2>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Filter plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 focus-visible:ring-cyan-500/50"
              />
            </div>
          </div>

          <div className="space-y-4 relative min-h-[200px]">
            {/* Connecting Line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-cyan-500/50 to-transparent border-l border-dashed border-cyan-500/30" />

            <AnimatePresence mode="popLayout">
              {filteredSteps.length > 0 ? (
                filteredSteps.map((step, index) => (
                  <motion.div
                    key={`${step.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <GlassCard className="p-6 relative overflow-visible">
                      {/* Step Number Badge - Only show if not filtering, or show original index? 
                          Showing dynamic index based on filter results for now */}
                      <div className="absolute -left-3 top-6 h-6 w-6 rounded-full bg-background border border-cyan-500 text-cyan-400 text-xs font-bold flex items-center justify-center z-10 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                        {chain.steps.indexOf(step) + 1}
                      </div>

                      <div className="pl-6 space-y-4">
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">{step.name}</h3>
                        </div>
                        
                        {step.description && (
                          <p className="text-sm text-muted-foreground italic">
                            {step.description}
                          </p>
                        )}

                        {step.settings && Object.keys(step.settings).length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            {Object.entries(step.settings).map(([key, value]) => (
                              <div key={key} className="bg-white/5 rounded-lg p-2 border border-white/5 hover:border-cyan-500/30 transition-colors">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{key}</div>
                                <div className="text-sm font-medium text-cyan-400 font-mono">{value}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="p-8 text-center text-muted-foreground bg-white/5 rounded-2xl border border-white/5 border-dashed"
                >
                  No plugins found matching "{searchQuery}"
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* References Column */}
        {chain.referenceImages && chain.referenceImages.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-display font-semibold">Reference</h2>
            <div className="space-y-4">
              {chain.referenceImages.map((url, idx) => (
                <GlassCard key={idx} className="p-2 overflow-hidden group">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50">
                    <img 
                      src={url} 
                      alt={`Reference ${idx + 1}`} 
                      className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500 hover:scale-105 transform"
                    />
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default ChainDetailPage;
