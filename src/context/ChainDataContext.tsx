import React, { createContext, useContext, useState, useEffect } from "react";
import { AppData } from "@/lib/chaintypes";
import { AppDataSchema } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import initialDataJson from "@/data/initial-data.json";
import { ZodError } from "zod";

interface DataContextType {
  data: AppData;
  uploadData: (file: File) => Promise<void>;
  resetData: () => void;
}

const ChainDataContext = createContext<DataContextType | undefined>(undefined);

// Safely cast the JSON import to AppData after validation, or use fallback
let validatedInitialData: AppData;

try {
  validatedInitialData = AppDataSchema.parse(initialDataJson);
} catch (error) {
  console.error("Critical: Initial JSON data is invalid", error);
  // Fallback to empty state if the file is corrupted
  validatedInitialData = { categories: [] };
}

export function ChainDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(validatedInitialData);
  const { toast } = useToast();

  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("mixvault_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const validated = AppDataSchema.parse(parsed);
        setData(validated);
      } catch (e) {
        console.error("Failed to parse saved data or validation failed", e);
        // If local storage data is invalid, revert to initial data but don't clear it immediately to avoid data loss if it's just a minor schema mismatch
        // However, for consistency, we'll warn the user.
        toast({
          title: "Data Warning",
          description: "Saved configuration was invalid and has been reset to defaults.",
          variant: "destructive",
        });
        localStorage.removeItem("mixvault_data");
        setData(validatedInitialData);
      }
    }
  }, [toast]);

  const uploadData = async (file: File) => {
    try {
      const text = await file.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid JSON file format");
      }
      
      // Validate with Zod
      const validated = AppDataSchema.parse(json);

      setData(validated);
      localStorage.setItem("mixvault_data", JSON.stringify(validated));
      toast({
        title: "Success",
        description: "Configuration loaded successfully",
      });
    } catch (error) {
      let errorMessage = "Failed to process file";
      
      if (error instanceof ZodError) {
        // Create a more readable error message from Zod issues
        const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
        errorMessage = `Validation Error: ${issues}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Upload error:", error);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const resetData = () => {
    setData(validatedInitialData);
    localStorage.removeItem("mixvault_data");
    toast({
      title: "Reset",
      description: "Restored default configuration",
    });
  };

  return (
    <ChainDataContext.Provider value={{ data, uploadData, resetData }}>
      {children}
    </ChainDataContext.Provider>
  );
}

export function useData() {
  const context = useContext(ChainDataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a ChainDataProvider");
  }
  return context;
}
