import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, any>();
const listeners = new Map<string, Set<(v: any) => void>>();

async function fetchSection(key: string) {
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("section_key", key)
    .maybeSingle();
  const value = (data?.content as any) ?? {};
  cache.set(key, value);
  listeners.get(key)?.forEach((fn) => fn(value));
  return value;
}

export function useSiteContent<T extends Record<string, any>>(key: string, defaults: T): T {
  const [content, setContent] = useState<T>(() => ({ ...defaults, ...(cache.get(key) ?? {}) }));

  useEffect(() => {
    let mounted = true;
    const set = (v: any) => mounted && setContent({ ...defaults, ...v });
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(set);
    if (cache.has(key)) {
      set(cache.get(key));
    } else {
      fetchSection(key);
    }
    return () => {
      mounted = false;
      listeners.get(key)?.delete(set);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return content;
}

export function invalidateSiteContent(key: string) {
  cache.delete(key);
  fetchSection(key);
}
