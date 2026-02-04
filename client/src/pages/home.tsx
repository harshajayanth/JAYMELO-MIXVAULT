import { motion } from "framer-motion";
import { DASHBOARD_TABS } from "@/data/dashboardTabs";
import { DashboardTabs } from "@/components/ui/DashboardTabs";
import { DashboardChains } from "@/components/dashboard/DashboardChains";

export default function HomePage() {
  return (
    <div className="flex justify-center min-h-screen p-4">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/dashboard.jpg')" }}
        />

        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-white/5" />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 
            -translate-x-1/2 -translate-y-1/2 
            w-[500px] h-[500px] 
            bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 w-full z-10">
        <div>
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Select a category to access your mixing data.
          </p>
        </div>

        {/* 🔒 URL-based tabs */}
        <DashboardTabs tabs={DASHBOARD_TABS} />

        {/* 🔒 Dashboard only shows chains */}
        <DashboardChains />
      </div>
    </div>
  );
}
