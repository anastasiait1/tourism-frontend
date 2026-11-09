import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { boundsToBbox, type LngLatBounds } from "@shared/lib/geo";
import { poiApi } from "../api/poiApi";

export function usePoisByBounds(bounds: LngLatBounds | null) {
  const currentBbox = bounds ? boundsToBbox(bounds) : null;
  const [debouncedBbox, setDebouncedBbox] = useState<string | null>(currentBbox);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedBbox(currentBbox), 300);
    return () => window.clearTimeout(timeoutId);
  }, [currentBbox]);

  return useQuery({
    queryKey: ["pois", "bbox", debouncedBbox],
    queryFn: ({ signal }) => poiApi.getByBbox(debouncedBbox!, signal),
    enabled: Boolean(debouncedBbox),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
