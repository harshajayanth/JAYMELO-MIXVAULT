import { 
  Mic, 
  Guitar, 
  Drum, 
  LayoutTemplate, 
  Music, 
  Sliders, 
  Settings, 
  Headphones,
  Speaker,
  Volume2,
  Waves
} from "lucide-react";

export const IconMap: Record<string, any> = {
  "Mic": Mic,
  "Guitar": Guitar,
  "Drum": Drum,
  "LayoutTemplate": LayoutTemplate,
  "Music": Music,
  "Sliders": Sliders,
  "Settings": Settings,
  "Headphones": Headphones,
  "Speaker": Speaker,
  "Volume2": Volume2,
  "Waves": Waves
};

export function getIcon(name?: string) {
  if (!name) return Music;
  return IconMap[name] || Music;
}
