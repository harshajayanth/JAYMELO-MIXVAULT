import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { useQueries } from "@tanstack/react-query";

import { useData } from "@/context/PluginDataContext";
import { PluginJSONv20 } from "shared/types/plugin";

import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  Cpu,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface RouteParams {
  category: string;
  subcategory: string;
}

/* ---------------- HOLO CARD ---------------- */

function HoloCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-cyan-400/15
        bg-white/[0.03]
        backdrop-blur-2xl
        shadow-[0_0_60px_rgba(0,255,255,0.06)]
        transition-all
        duration-500
        ${className}
      `}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.12),transparent_55%)] pointer-events-none" />

      {/* Scan lines */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.045]
          bg-[linear-gradient(to_bottom,transparent_0%,white_50%,transparent_100%)]
          bg-[length:100%_8px]
          pointer-events-none
        "
      />

      {/* Inner border */}
      <div className="absolute inset-[1px] rounded-[32px] border border-white/[0.04] pointer-events-none" />

      {children}
    </div>
  );
}

/* ---------------- PAGE ---------------- */

export default function PluginListPage() {
  const { category, subcategory } = useParams<RouteParams>();

  const decodedCategory = decodeURIComponent(category);
  const decodedSubcategory = decodeURIComponent(subcategory);

  const { data } = useData();

  /* ---------------- FILTER ---------------- */

  const plugins = data.plugins.filter((plugin) => {
    if (plugin.category !== decodedCategory) return false;

    if (decodedSubcategory === "All") return true;

    return plugin.subcategory.includes(decodedSubcategory);
  });

  const modelCountQueries = useQueries({
    queries: plugins.map((plugin) => ({
      queryKey: ["plugin-json-model-count", plugin.plugin_id, plugin.path],
      queryFn: async () => {
        const response = await fetch(plugin.path);

        if (!response.ok) {
          throw new Error("Failed to load plugin model count");
        }

        const pluginData = (await response.json()) as Partial<PluginJSONv20>;
        return Array.isArray(pluginData.models) ? pluginData.models.length : 1;
      },
      staleTime: Infinity,
    })),
  });

  const modelCountByPluginId = new Map(
    plugins.map((plugin, index) => [
      plugin.plugin_id,
      modelCountQueries[index]?.data ?? 0,
    ])
  );

  const totalModels = Array.from(modelCountByPluginId.values()).reduce(
    (sum, count) => sum + count,
    0
  );

  /* ---------------- EMPTY ---------------- */

  if (plugins.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <HoloCard className="p-10 text-center max-w-lg">
          <div className="flex justify-center">
            <div
              className="
                h-20
                w-20
                rounded-full
                border
                border-cyan-400/20
                bg-cyan-500/10
                flex
                items-center
                justify-center
              "
            >
              <Cpu className="h-8 w-8 text-cyan-300" />
            </div>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-white">
            No Plugins Found
          </h2>

          <p className="mt-4 text-cyan-100/60 leading-7">
            Status: Data not provided or category requires
            additional plugin indexing.
          </p>
        </HoloCard>
      </div>
    );
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="
        relative
        min-h-screen
        overflow-hidden
        px-4
        md:px-8
        py-8
        space-y-8
      "
    >
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#071a2f_0%,#02030A_55%)]" />

        {/* Glows */}
        <div className="absolute top-[-200px] left-[-100px] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="absolute top-[20%] right-[-150px] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[180px]" />

        <div className="absolute bottom-[-250px] left-1/3 h-[700px] w-[700px] rounded-full bg-cyan-400/10 blur-[200px]" />

        {/* Grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.04]
            bg-[linear-gradient(rgba(0,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.15)_1px,transparent_1px)]
            bg-[size:80px_80px]
          "
        />
      </div>

      {/* ================= HERO ================= */}

      <HoloCard className="relative p-8 md:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          {/* LEFT */}

          <div className="flex items-center gap-5">
            <Link
              href={`/plugins/${encodeURIComponent(decodedCategory)}`}
            >
              <Button
                variant="ghost"
                size="icon"
                className="
                  rounded-full
                  border
                  border-cyan-400/20
                  bg-cyan-500/5
                  hover:bg-cyan-500/10
                  h-12
                  w-12
                "
              >
                <ArrowLeft className="h-5 w-5 text-cyan-200" />
              </Button>
            </Link>

            <div>
              <p className="text-cyan-300/60 tracking-[0.35em] text-xs uppercase">
                Plugin Category
              </p>

              <h1
                className="
                  mt-3
                  text-5xl
                  md:text-6xl
                  font-black
                  tracking-tight
                  bg-gradient-to-r
                  from-cyan-300
                  via-white
                  to-cyan-500
                  bg-clip-text
                  text-transparent
                  drop-shadow-[0_0_25px_rgba(0,255,255,0.35)]
                "
              >
                {decodedSubcategory}
              </h1>

              <p className="mt-5 text-cyan-100/65 max-w-2xl leading-8">
                Explore futuristic audio processing modules
                and intelligent plugin systems inside{" "}
                {decodedCategory}.
              </p>

              {/* Tags */}

              <div className="flex flex-wrap gap-3 mt-6">
                <div
                  className="
                    px-4
                    py-1.5
                    rounded-full
                    border
                    border-cyan-400/20
                    bg-cyan-500/10
                    text-cyan-100
                    text-xs
                    tracking-widest
                  "
                >
                  {decodedCategory}
                </div>

                <div
                  className="
                    px-4
                    py-1.5
                    rounded-full
                    border
                    border-cyan-400/20
                    bg-cyan-500/10
                    text-cyan-100
                    text-xs
                    tracking-widest
                  "
                >
                  {decodedSubcategory}
                </div>

                <div
                  className="
                    px-4
                    py-1.5
                    rounded-full
                    border
                    border-cyan-400/20
                    bg-cyan-500/10
                    text-cyan-100
                    text-xs
                    tracking-widest
                  "
                >
                  {totalModels || plugins.length} MODELS
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="ml-auto">
            <div
              className="
                relative
                h-36
                w-36
                rounded-[36px]
                border
                border-cyan-400/20
                bg-cyan-500/5
                flex
                items-center
                justify-center
                shadow-[0_0_60px_rgba(0,255,255,0.15)]
              "
            >
              {/* Glow */}

              <div className="absolute inset-0 rounded-[36px] bg-cyan-400/10 blur-3xl" />

              <Sparkles className="relative z-10 h-16 w-16 text-cyan-300" />
            </div>
          </div>
        </div>
      </HoloCard>

      {/* ================= GRID ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">
        {plugins.map((plugin, index) => (
          <Link
            key={plugin.plugin_id}
            href={`/plugin/${plugin.plugin_id}`}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.06,
              }}
              whileHover={{
                y: -8,
                scale: 1.015,
              }}
              className="h-full"
            >
              <HoloCard
                className="
                  group
                  relative
                  p-7
                  h-full
                  overflow-hidden
                  border-cyan-400/15
                  bg-gradient-to-br
                  from-cyan-500/[0.06]
                  via-[#07111f]
                  to-[#050816]
                  hover:border-cyan-300/40
                  hover:shadow-[0_0_80px_rgba(0,255,255,0.18)]
                  cursor-pointer
                "
              >
                {/* Animated glow */}

                <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-400/10 blur-3xl" />

                <div className="absolute bottom-0 left-0 h-32 w-32 bg-blue-500/10 blur-3xl" />

                {/* Top line */}

                <div
                  className="
                    absolute
                    top-0
                    left-6
                    h-[2px]
                    w-32
                    bg-cyan-400
                    blur-[1px]
                  "
                />

                {/* Content */}

                <div className="relative flex flex-col h-full">
                  {/* Header */}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs tracking-[0.3em] uppercase text-cyan-300/50">
                        Audio Module
                      </p>

                      <h2 className="mt-3 text-3xl font-black text-white leading-tight">
                        {plugin.plugin_name}
                      </h2>

                      <p className="mt-3 text-cyan-100/60">
                        {plugin.manufacturer}
                      </p>
                    </div>

                    {/* Icon */}

                    <div
                      className="
                        h-14
                        w-14
                        rounded-2xl
                        border
                        border-cyan-400/15
                        bg-cyan-500/[0.08]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <img
                        src={`/images/${plugin.manufacturer
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "")}.png`}
                        alt={`${plugin.manufacturer} logo`}
                        className="h-10 w-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/plugin.png";
                        }}
                      />
                    </div>
                  </div>

                  {/* Subcategories */}

                  <div className="flex flex-wrap gap-2 mt-6">
                    {plugin.subcategory.map((sub) => (
                      <span
                        key={sub}
                        className="
                          px-3
                          py-1.5
                          rounded-full
                          border
                          border-cyan-400/10
                          bg-cyan-500/[0.05]
                          text-cyan-100/70
                          text-xs
                          tracking-[0.2em]
                        "
                      >
                        {sub}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 text-sm text-cyan-100/58">
                    {modelCountByPluginId.get(plugin.plugin_id) || "..."}{" "}
                    {(modelCountByPluginId.get(plugin.plugin_id) || 0) === 1
                      ? "model"
                      : "models"}
                  </div>

                  {/* Footer */}

                  <div className="mt-auto pt-8 flex items-center justify-between">
                    <div className="text-cyan-300/70 text-sm">
                      Open Plugin
                    </div>

                    <div
                      className="
                        h-12
                        w-12
                        rounded-full
                        border
                        border-cyan-400/15
                        bg-cyan-500/[0.05]
                        flex
                        items-center
                        justify-center
                        group-hover:translate-x-1
                        transition-transform
                      "
                    >
                      <ChevronRight className="h-5 w-5 text-cyan-300" />
                    </div>
                  </div>
                </div>
              </HoloCard>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
