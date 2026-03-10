import { useQuery, useMutation } from "@tanstack/react-query";
import { api, type CalculateRequest } from "@shared/routes";

// GET /api/breeds
export function useBreeds() {
  return useQuery({
    queryKey: [api.breeds.list.path],
    queryFn: async () => {
      const res = await fetch(api.breeds.list.path);
      if (!res.ok) throw new Error("Failed to fetch breeds");
      // Use the Zod schema from routes to validate/parse the response
      return api.breeds.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/calculate
export function useCalculateDogAge() {
  return useMutation({
    mutationFn: async (data: CalculateRequest) => {
      const validatedInput = api.calculate.input.parse(data);
      const res = await fetch(api.calculate.path, {
        method: api.calculate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
      });

      if (!res.ok) {
        if (res.status === 400) {
           const error = api.calculate.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to calculate age");
      }

      return api.calculate.responses[200].parse(await res.json());
    },
  });
}
