
import { useQuery } from "@tanstack/react-query";
import { poiApi } from "../api/poiApi";

export function usePoiById(id: string | undefined) {
  return useQuery({
    queryKey: ["pois", "detail", id],
    queryFn: ({ signal }) => {
      if (!id) {
        throw new Error("Не указан ID объекта");
      }

      return poiApi.getById(id, signal);
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
