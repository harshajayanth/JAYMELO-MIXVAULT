import { useData } from "@/context/DataContext";
import { GlassCard } from "@/components/ui/glass-card";
import { getIcon } from "@/lib/icons";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data } = useData();

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
              style={{ backgroundImage: "url('/images/dashboard.jpg')" }}
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
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-display font-bold text-white">Dashboard</h1>
              <p className="text-muted-foreground text-lg">Select a category to access your mixing chains.</p>
            </div>

            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {data.categories.map((category) => {
                const Icon = getIcon(category.icon);
                
                return (
                  <Link key={category.id} href={`/category/${category.id}`}>
                    <GlassCard 
                      variant="interactive" 
                      className="p-8 flex flex-col items-center text-center gap-6 group h-full justify-center min-h-[240px]"
                      data-testid={`card-category-${category.id}`}
                    >
                      <div className="ml-3 h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-yellow-400/20 group-hover:border-yellow-400/30 transition-all duration-300">
                        <Icon className="h-10 w-10 text-muted-foreground group-hover:text-yellow-400 transition-colors" />
                      </div>

                      <div className="space-y-2">
                        <h2 className="m-4 text-2xl font-display font-semibold text-white group-hover:text-yellow-400 transition-colors">
                          {category.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {category.chains.length < 2 ? `${category.chains.length} Chain` : `${category.chains.length} Chains`}
                        </p>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </motion.div>
    </div>
    </div>
  );
}
