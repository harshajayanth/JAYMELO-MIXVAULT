import React, { createContext, useContext } from "react";

import rawIndex from "@/data/index.json";
import { IndexJSONv13 } from "shared/types/index";
import { AppData } from "@/lib/plugintypes";

// 🔒 Load runtime data from index.json
const index = rawIndex as IndexJSONv13;

// ---------- Context ----------
interface PluginDataContextValue {
  data: AppData;
}

const PluginDataContext = createContext<
  PluginDataContextValue | undefined
>(undefined);

// ---------- Provider ----------
export const PluginDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const data: AppData = {
    plugins: Array.isArray(index.plugins) ? index.plugins : [],
  };

  return (
    <PluginDataContext.Provider value={{ data }}>
      {children}
    </PluginDataContext.Provider>
  );
};

// ---------- Hook (RENAMED & CORRECT) ----------
export function useData() {
  const context = useContext(PluginDataContext);

  if (!context) {
    throw new Error(
      "usePluginData must be used within PluginDataProvider"
    );
  }

  return context;
}
  