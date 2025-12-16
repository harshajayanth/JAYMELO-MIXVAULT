import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Mic,
  Guitar,
  Drum,
  LayoutTemplate,
  FileMusic,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import { useLocation } from "wouter";

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const { data } = useData();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64 border-white/10 hover:bg-white/5"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search chains...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {data.categories.map((category) => (
            <CommandGroup key={category.id} heading={category.name}>
              {category.chains.map((chain) => (
                <CommandItem
                  className="data-[hovered=true]:bg-yellow-400 data-[hovered=true]:text-black"
                  key={chain.id}
                  value={`${category.name} ${chain.name}`}
                  onSelect={() => {
                    runCommand(() => setLocation(`/chain/${category.id}/${chain.id}`));
                  }}
                >
                  <FileMusic className="mr-2 h-4 w-4" />
                  <span>{chain.name}</span>
                </CommandItem>
              ))}
              {category.chains.length === 0 && (
                <CommandItem disabled>No chains in this category</CommandItem>
              )}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
