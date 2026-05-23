import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";

import { useData } from "@/context/PluginDataContext";
import { PluginJSONv20, PluginModel } from "shared/types/plugin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowLeft,
  BadgeInfo,
  Boxes,
  BrainCircuit,
  CalendarDays,
  Gauge,
  ImageIcon,
  Layers3,
  ListFilter,
  Microchip,
  Search,
  Settings2,
  Sliders,
  Sparkles,
  Tags,
  Waves,
  X,
} from "lucide-react";

interface RouteParams {
  plugin_id: string;
}

function HoloPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-cyan-300/15 bg-slate-950/55 shadow-[0_0_70px_rgba(34,211,238,0.08)] backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.18),transparent_34%),linear-gradient(135deg,rgba(14,165,233,0.08),transparent_42%,rgba(20,184,166,0.07))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] bg-[linear-gradient(to_bottom,transparent_0%,white_48%,transparent_100%)] bg-[length:100%_7px]" />
      <div className="pointer-events-none absolute inset-[1px] border border-white/[0.04]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/60">
          {eyebrow}
        </p>
        <h2 className="text-xl font-semibold text-white md:text-2xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

function DataRow({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  if (!value) return null;

  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 border-b border-cyan-300/10 py-3 last:border-b-0">
      <dt className="text-xs uppercase tracking-[0.2em] text-cyan-300/50">
        {label}
      </dt>
      <dd className="min-w-0 text-sm leading-6 text-cyan-50/82">{value}</dd>
    </div>
  );
}

function Meter({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden bg-slate-900/80">
      <div
        className="h-full bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 shadow-[0_0_22px_rgba(34,211,238,0.45)]"
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  );
}

function TagList({ values }: { values: string[] }) {
  if (!values.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1 text-xs uppercase tracking-[0.16em] text-cyan-100/80"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function normalizeSearchValue(value: string) {
  return value.replace(/[_-]/g, " ").toLowerCase();
}

export default function PluginDetailPage() {
  const { plugin_id } = useParams<RouteParams>();
  const { data } = useData();
  const [filter, setFilter] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("");

  const pluginIndexEntry = data.plugins.find((p) => p.plugin_id === plugin_id);

  const { data: pluginData, isLoading } = useQuery({
    queryKey: ["plugin-json", plugin_id],
    enabled: Boolean(pluginIndexEntry),
    queryFn: async (): Promise<PluginJSONv20> => {
      const res = await fetch(pluginIndexEntry!.path);

      if (!res.ok) {
        throw new Error("Failed to load plugin");
      }

      return res.json();
    },
  });

  const activeModel: PluginModel | undefined =
    pluginData?.models.find((model) => model.model_id === selectedModel) ||
    pluginData?.models[0];

  const search = normalizeSearchValue(filter.trim());
  const filteredApplications = activeModel
    ? Object.entries(activeModel.application).filter(([name, block]) => {
        if (!search) return true;

        return normalizeSearchValue(name).includes(search);
      })
    : [];

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/plugins";
    }
  };

  if (!pluginIndexEntry) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-cyan-200">
        Plugin not found
      </div>
    );
  }

  if (isLoading || !pluginData || !activeModel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-cyan-300">
        Loading Plugin...
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative min-h-screen overflow-hidden bg-[#030711] px-4 py-6 text-cyan-50 md:px-8 md:py-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(45,212,191,0.12),transparent_26%),linear-gradient(115deg,rgba(2,6,23,0.95),rgba(8,13,28,0.88))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.09] bg-[linear-gradient(rgba(103,232,249,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.12)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative z-10 mx-auto max-w-[1500px] space-y-5">
        <header className="flex flex-col gap-4 border-b border-cyan-300/15 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className="h-11 w-11 border border-cyan-300/20 bg-cyan-300/5 text-cyan-100 hover:bg-cyan-300/10 hover:text-white"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300/60">
                 Plugin Interface
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-normal text-white md:text-6xl">
                {pluginData.plugin_name}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-cyan-50/72">
                {activeModel.description.detailed}
              </p>
            </div>
          </div>

          <div className="w-full md:w-[360px]">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/65">
              Model Selector
            </label>
            <Select
              value={activeModel.model_id}
              onValueChange={(value) => {
                setSelectedModel(value);
                setSelectedImage(null);
                setImageLoading(true);
              }}
            >
              <SelectTrigger className="h-12 border-cyan-300/25 bg-slate-950/80 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.12)] focus:ring-cyan-300/45">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="border-cyan-300/20 bg-slate-950 text-cyan-50">
                {pluginData.models.map((model) => (
                  <SelectItem
                    key={model.model_id}
                    value={model.model_id}
                    className="focus:bg-cyan-300/10 focus:text-white"
                  >
                    {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <HoloPanel className="p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <SectionTitle
                  icon={Microchip}
                  eyebrow="Selected Model"
                  title={activeModel.model_name}
                />
                <span className="border border-cyan-300/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                  {activeModel.model_id}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedImage(activeModel.ref_img.main)}
                className="group relative block h-[220px] w-full overflow-hidden border border-cyan-300/15 bg-slate-950 md:h-[280px]"
              >
                {activeModel.ref_img.main ? (
                  <img
                    key={`${activeModel.model_id}-${activeModel.ref_img.main}`}
                    src={activeModel.ref_img.main}
                    alt={activeModel.model_name}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                    className={`h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.03] ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-cyan-300/55">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                )}
                {activeModel.ref_img.main && imageLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/72 text-cyan-100 backdrop-blur-sm">
                    <Spinner className="h-7 w-7 text-cyan-200" />
                    <span className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                      Loading Image
                    </span>
                  </div>
                )}
                <span className="absolute bottom-3 right-3 border border-cyan-300/20 bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cyan-100">
                  Inspect
                </span>
              </button>

              <div className="mt-5 border border-cyan-300/12 bg-cyan-300/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/50">
                  Snapshot
                </p>
                <p className="mt-3 text-sm leading-6 text-cyan-50/76">
                  {activeModel.description.short}
                </p>
              </div>
            </HoloPanel>

            <HoloPanel className="p-5">
              <SectionTitle icon={Sparkles} eyebrow="Best Targets" title="Best For" />
              <div className="mt-5">
                <TagList values={activeModel.best_for} />
              </div>
            </HoloPanel>

            <HoloPanel className="p-5">
              <SectionTitle icon={BadgeInfo} eyebrow="Plugin Core" title="Identity" />
              <dl className="mt-5">
                <DataRow label="Schema" value={pluginData.schema_version} />
                <DataRow label="Plugin ID" value={pluginData.plugin_id} />
                <DataRow label="Maker" value={pluginData.manufacturer} />
                <DataRow label="Developer" value={pluginData.developer} />
                <DataRow label="Category" value={pluginData.category} />
                <DataRow label="Subcategory" value={pluginData.subcategory.join(", ")} />
                <DataRow label="Type" value={pluginData.plugin_type} />
                <DataRow label="Updated" value={pluginData.last_updated} />
              </dl>
            </HoloPanel>

            <HoloPanel className="p-5">
              <SectionTitle icon={Gauge} eyebrow="Model DNA" title="Circuit Profile" />
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  ["Circuit", activeModel.circuit_type, BrainCircuit],
                  ["Source", activeModel.hardware_inspiration, Microchip],
                  ["Uses", `${activeModel.best_for.length} targets`, Sparkles],
                ].map(([label, value, Icon]) => {
                  const RuntimeIcon = Icon as React.ElementType;

                  return (
                    <div
                      key={String(label)}
                      className="border border-cyan-300/12 bg-cyan-300/[0.045] p-3"
                    >
                      <RuntimeIcon className="mx-auto h-5 w-5 text-cyan-200" />
                      <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-cyan-300/50">
                        {label as string}
                      </p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-white">
                        {value as string}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5">
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-cyan-300/50">
                  Character
                </p>
                <TagList values={activeModel.character} />
              </div>
            </HoloPanel>

            <HoloPanel className="p-5">
              <SectionTitle icon={Tags} eyebrow="Tags" title="Search Signals" />
              <div className="mt-5">
                <TagList values={pluginData.tags} />
              </div>
            </HoloPanel>

            <HoloPanel className="p-5">
              <SectionTitle icon={CalendarDays} eyebrow="Full Record" title="All Models" />
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="border-b border-cyan-300/15 text-xs uppercase tracking-[0.18em] text-cyan-300/55">
                    <tr>
                      <th className="py-3 pr-4 font-medium">Model</th>
                      <th className="py-3 pr-4 font-medium">Circuit</th>
                      <th className="py-3 pr-4 font-medium">Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-300/10 text-cyan-50/72">
                    {pluginData.models.map((model) => (
                      <tr key={model.model_id}>
                        <td className="py-4 pr-4 font-semibold text-cyan-100">
                          {model.model_name}
                        </td>
                        <td className="py-4 pr-4 text-cyan-100/70">
                          {model.circuit_type}
                        </td>
                        <td className="py-4 pr-4 leading-6">
                          {model.description.short}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </HoloPanel>
          </aside>

          <main className="space-y-5">
            <HoloPanel className="p-5 md:p-6">
              <SectionTitle icon={Sparkles} eyebrow="Model Brief" title="Overview" />
              <div className="mt-5 space-y-4">
                <p className="border-l-2 border-cyan-300/40 pl-4 text-lg leading-8 text-cyan-50/84">
                  {activeModel.description.short}
                </p>
                <p className="text-base leading-8 text-cyan-50/70">
                  {activeModel.description.detailed}
                </p>
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.22em] text-cyan-300/50">
                    Best for
                  </p>
                  <TagList values={activeModel.best_for} />
                </div>
              </div>
            </HoloPanel>

            <HoloPanel className="p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <SectionTitle
                  icon={ListFilter}
                  eyebrow="Use Cases"
                  title="Applications"
                />
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300/55" />
                    <Input
                      placeholder="Filter by application name"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    className="h-10 border-cyan-300/20 bg-slate-950/70 pl-10 text-cyan-50 placeholder:text-cyan-200/35 focus-visible:ring-cyan-300/35"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {filteredApplications.map(([name, block]) => (
                  <div
                    key={name}
                    className="border border-cyan-300/12 bg-slate-950/35 p-4"
                  >
                    <h3 className="text-xl font-semibold capitalize text-cyan-100">
                      {name.replace(/_/g, " ")}
                    </h3>
                    <div className="mt-4 grid gap-5 md:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/50">
                          When to use
                        </p>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-cyan-50/75">
                          {block.when_to_use.map((item) => (
                            <li key={item} className="flex gap-2">
                              <Waves className="mt-1 h-4 w-4 flex-none text-cyan-300/70" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/50">
                          Recommended settings
                        </p>
                        <dl className="mt-3 space-y-2">
                          {Object.entries(block.recommended_settings).map(
                            ([setting, value]) => (
                              <div
                                key={setting}
                                className="flex items-center justify-between gap-4 border-b border-cyan-300/10 pb-2 text-sm"
                              >
                                <dt className="capitalize text-cyan-50/55">
                                  {setting}
                                </dt>
                                <dd className="font-semibold text-cyan-100">
                                  {value}
                                </dd>
                              </div>
                            )
                          )}
                        </dl>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredApplications.length === 0 && (
                  <div className="border border-cyan-300/12 bg-slate-950/35 p-5 text-sm leading-6 text-cyan-50/68">
                    No applications match this filter.
                  </div>
                )}
              </div>
            </HoloPanel>

            <div className="grid gap-5 xl:grid-cols-2">
              <HoloPanel className="p-5 md:p-6">
                <SectionTitle icon={Microchip} eyebrow="Circuit" title="Hardware Inspiration" />
                <p className="mt-5 text-base leading-8 text-cyan-50/78">
                  {activeModel.hardware_inspiration}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {activeModel.character.map((trait) => (
                    <div
                      key={trait}
                      className="border border-cyan-300/12 bg-cyan-300/[0.045] px-4 py-3 text-sm text-cyan-50/82"
                    >
                      {trait}
                    </div>
                  ))}
                </div>
              </HoloPanel>

              <HoloPanel className="p-5 md:p-6">
                <SectionTitle icon={Settings2} eyebrow="Flow" title="Workflow Tips" />
                <ul className="mt-5 space-y-3 text-sm leading-6 text-cyan-50/78">
                  {activeModel.workflow_tips.map((tip) => (
                    <li key={tip} className="flex gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4 flex-none text-cyan-300" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </HoloPanel>
            </div>

            <HoloPanel className="p-5 md:p-6">
              <SectionTitle icon={Sliders} eyebrow="Control Matrix" title="Shared Controls" />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {pluginData.shared_controls.map((control) => (
                  <div
                    key={control.name}
                    className="border border-cyan-300/12 bg-slate-950/35 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-cyan-100">
                        {control.name}
                      </h3>
                      <span className="border border-cyan-300/15 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-300/70">
                        Shared
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-cyan-50/70">
                      {control.description}
                    </p>
                  </div>
                ))}
              </div>
            </HoloPanel>

            <HoloPanel className="p-5 md:p-6">
              <SectionTitle icon={Layers3} eyebrow="Genre Matrix" title="Suitability" />
              <div className="mt-6 space-y-4">
                {activeModel.genre_suitability.map((genre) => (
                  <div key={genre.genre} className="grid gap-3 md:grid-cols-[160px_1fr_56px] md:items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-100">
                        {genre.genre}
                      </h3>
                      <p className="text-sm leading-6 text-cyan-50/62">
                        {activeModel.circuit_type} fit score
                      </p>
                    </div>
                    <Meter value={genre.rating} />
                    <p className="text-right text-2xl font-black text-cyan-200">
                      {genre.rating}
                    </p>
                  </div>
                ))}
              </div>
            </HoloPanel>

            <HoloPanel className="p-5 md:p-6">
              <SectionTitle icon={Boxes} eyebrow="Adjacent Tools" title="Related Plugins" />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {pluginData.related_plugins.map((plugin) => (
                  <div
                    key={plugin.name}
                    className="border border-cyan-300/12 bg-cyan-300/[0.045] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-cyan-100">
                        {plugin.name}
                      </h3>
                      <span className="text-xs uppercase tracking-[0.18em] text-cyan-300/55">
                        {plugin.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </HoloPanel>

            <HoloPanel className="p-5 md:p-6">
              <SectionTitle icon={BadgeInfo} eyebrow="Reference" title="Official Sources" />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="border border-cyan-300/12 bg-slate-950/35 p-4">
                  <h3 className="text-lg font-semibold text-cyan-100">
                    Apple Docs
                  </h3>
                  <div className="mt-4 space-y-3">
                    {pluginData.official_reference.apple_docs.map((source) => (
                      <a
                        key={source}
                        href={source}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-all text-sm leading-6 text-cyan-100/74 hover:text-cyan-100"
                      >
                        {source}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="border border-cyan-300/12 bg-slate-950/35 p-4">
                  <h3 className="text-lg font-semibold text-cyan-100">
                    Educational Sources
                  </h3>
                  <div className="mt-4 space-y-3">
                    {pluginData.official_reference.educational_sources.map((source) => (
                      <a
                        key={source}
                        href={source}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-all text-sm leading-6 text-cyan-100/74 hover:text-cyan-100"
                      >
                        {source}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </HoloPanel>
          </main>
        </div>
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/86 p-5 backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-6xl overflow-hidden border border-cyan-300/25 bg-slate-950"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-20 h-10 w-10 border border-cyan-300/20 bg-black/55 text-cyan-100 hover:bg-cyan-300/10 hover:text-white"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={selectedImage}
              alt={`${activeModel.model_name} enlarged reference`}
              className="h-full max-h-[90vh] w-full object-contain p-4"
            />
          </motion.div>
        </div>
      )}
    </motion.section>
  );
}
