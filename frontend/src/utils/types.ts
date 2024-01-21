// Import schema.d.ts file
import { components, paths } from "types/schema"

export type Greenhouse = components["schemas"]["Greenhouse"]
export type GreenhouseListResponse = paths["/api/greenhouses/"]["get"]["responses"][200]["content"]["application/json"]

