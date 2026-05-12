import {
  PawPrint, Footprints, Home, Hotel, Heart, Award, Sparkles,
  Dog, Cat, Bone, Bird, Fish, Stethoscope, MapPin, Phone, Mail, type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  PawPrint, Footprints, Home, Hotel, Heart, Award, Sparkles,
  Dog, Cat, Bone, Bird, Fish, Stethoscope, MapPin, Phone, Mail,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export const renderIcon = (name: string, className = "w-6 h-6") => {
  const Icon = ICON_MAP[name] ?? PawPrint;
  return <Icon className={className} />;
};
