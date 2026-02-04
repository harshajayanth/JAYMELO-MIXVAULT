import { useRoute, Link } from "wouter";
import { useData } from "@/context/ChainDataContext";
import { GlassCard } from "@/components/ui/glass-card";
import { getIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:id");
  const { data } = useData();
  
  const category = data.categories.find(c => c.id === params?.id);

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-display">Category not found</h1>
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const Icon = getIcon(category.icon);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
            style={{ backgroundImage: "url('/images/category.jpg')" }}
          />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/10" />

        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
        </div>
      </div>
    <div className="space-y-8 w-full z-10">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <Icon className="h-6 w-6 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">{category.name}</h1>
        </div>
      </div>

      {category.chains.length === 0 ? (
        <GlassCard className="p-12 flex flex-col items-center text-center space-y-4 opacity-50">
          <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground">No chains configured for this category yet.</p>
        </GlassCard>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {category.chains.map((chain) => (
            <Link key={chain.id} href={`/chain/${category.id}/${chain.id}`}>
              <GlassCard 
                variant="interactive" 
                className="p-6 flex flex-col h-full group"
                data-testid={`card-chain-${chain.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center border border-yellow-500 group-hover:bg-yellow-400 transition-colors">
                    <span className="font-display font-bold text-lg text-muted-foreground group-hover:text-black  transition-colors">
                      {chain.name.charAt(0)}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
                    <ChevronRight className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
                
                <h3 className="text-xl font-display font-semibold text-white mb-2 group-hover:text-yellow-400  transition-colors">
                  {chain.name}
                </h3>
                
                {chain.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {chain.description}
                  </p>
                )}

                <div className="mt-auto pt-4 flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full border border-white/5 group-hover:text-black border border-yellow-500 group-hover:bg-yellow-400 transition-colors">
                    {chain.steps.length<2 ? `${chain.steps.length} Plugin` : `${chain.steps.length} Plugins`}
                  </span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
    </div>
  );
}
