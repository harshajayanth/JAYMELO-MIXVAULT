import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { useData } from "@/context/PluginDataContext";
import { PluginJSONv13 } from "shared/types/plugin";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

import {
  ArrowLeft,
  Download,
  Sliders,
  ChevronRight,
  Search
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

/* ---------------- types ---------------- */

interface RouteParams {
  plugin_id: string;
}

/* ---------------- component ---------------- */

export default function PluginDetailPage() {
  const { plugin_id } = useParams<RouteParams>();
  const { data } = useData();
  const { toast } = useToast();

  const [showDownload, setShowDownload] = useState(false);
  const [filter, setFilter] = useState("");

  /* ---------- back navigation ---------- */
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/plugins";
    }
  };

  /* ---------- resolve plugin ---------- */
  const pluginIndexEntry = data.plugins.find(
    p => p.plugin_id === plugin_id
  );

  if (!pluginIndexEntry) {
    return (
      <p className="text-muted-foreground">
        Status: Plugin not found in index
      </p>
    );
  }

  /* ---------- fetch plugin json ---------- */
  const { data: pluginData, isLoading } = useQuery({
    queryKey: ["plugin-json", plugin_id],
    queryFn: async (): Promise<PluginJSONv13> => {
      const res = await fetch(pluginIndexEntry.path);
      if (!res.ok) throw new Error("Failed to load plugin JSON");
      return res.json();
    }
  });

  if (isLoading || !pluginData) {
    return <p className="text-muted-foreground">Loading plugin…</p>;
  }

  /* ---------------- render ---------------- */

  return (
    <section className="space-y-8">
      {/* ================= HEADER ================= */}
      <GlassCard className="p-6 ">
            {/* Top row */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <h1 className="text-3xl font-bold text-white">
                {pluginData.plugin_name}
              </h1>

              {/* Manufacturer logo */}
              <div className="ml-auto">
                <div className="h-15 w-15 flex items-center justify-center">
                  <img
                    src={
                      pluginData.manufacturer === "Logic"
                        ? "/images/logicpro.png"
                        : "/images/waves.png"
                    }
                    alt={`${pluginData.manufacturer} logo`}
                    className="h-15 mt-5 w-auto opacity-90"
                  />
                </div>
              </div>
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-2 mt-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-white/10">
                {pluginData.manufacturer}
              </span>

              <span className="px-3 py-1 rounded-full bg-white/10">
                {pluginData.category}
              </span>

              {pluginData.subcategory.map(sub => (
                <span
                  key={sub}
                  className="px-3 py-1 rounded-full bg-white/10"
                >
                  {sub}
                </span>
              ))}

              <span className="px-3 py-1 rounded-full bg-white/10">
                {pluginData.plugin_type}
              </span>
            </div>
      </GlassCard>


      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------- LEFT ---------- */}
        <div className="lg:col-span-2 space-y-6">
          {/* ===== APPLICATIONS ===== */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Applications</h2>
            </div>

            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Filter applications…"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="pl-9"
              />
            </div>


            {Object.entries(pluginData.application)
              .filter(([key]) =>
                key.toLowerCase().includes(filter.toLowerCase())
              )
              .map(([name, block]) => (
                <GlassCard key={name} className="p-4 mt-4 ">
                  <h3 className="capitalize font-medium text-white">
                    {name.replace("_"," ")}
                  </h3>

                  <ul className="list-disc list-inside text-muted-foreground">
                    {block.when_to_use.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {Object.entries(block.recommended_settings).map(
                      ([param, value]) => (
                        <div
                          key={param}
                          className="flex justify-between px-3 py-2 rounded-md bg-white/5"
                        >
                          <span className="text-muted-foreground">
                            {param.replace("_"," ").toUpperCase()}
                          </span>
                          <span className="text-primary">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </GlassCard>
              ))}
          </GlassCard>

          {/* ===== SIGNAL CHAIN ===== */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Signal Chain</h2>
            </div>

            <p className="text-muted-foreground">
              {pluginData.signal_chain.recommended_position}
            </p>

            <ul className="list-disc list-inside text-muted-foreground">
              {pluginData.signal_chain.common_chains.map(chain => (
                <li key={chain}>{chain}</li>
              ))}
            </ul>
          </GlassCard>

          {/* ===== WORKFLOW TIPS ===== */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold">Workflow Tips</h2>
            <ul className="list-disc list-inside text-muted-foreground">
              {pluginData.workflow_tips.map(tip => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* ---------- RIGHT ---------- */}
        <div className="space-y-6">
          <GlassCard className="p-5 text-sm">
            <p>Skill level: {pluginData.skill_level}</p>
            <p>CPU usage: {pluginData.cpu_usage}</p>
            <p>Latency: {pluginData.latency}</p>
          </GlassCard>

          <GlassCard className="p-4 text-xs text-muted-foreground">
            Last updated: {pluginData.last_updated}
          </GlassCard>
        </div>
      </div>
    </section>
      );
}
