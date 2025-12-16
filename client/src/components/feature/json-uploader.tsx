import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";

export function JsonUploader() {
  const { uploadData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadData(file);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
        data-testid="input-json-upload"
      />
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-colors"
        onClick={() => fileInputRef.current?.click()}
        title="Upload Configuration JSON"
        data-testid="button-upload-json"
      >
        <Upload className="h-4 w-4" />
      </Button>
    </>
  );
}
