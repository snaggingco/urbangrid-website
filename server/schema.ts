// Shared schema keeps initial production HTML and client navigation consistent.
import { pageSchemaScript } from "../shared/pageStructuredData";

export function homepageSchema(): string {
  return pageSchemaScript("/", "Property Snagging Dubai & UAE | From AED 800 | UrbanGrid",
    "Independent residential inspection and building consultancy across the UAE.");
}
export function locationSchema(emirate: string, emirateTitle: string, description: string): string {
  return pageSchemaScript(`/locations/${emirate}`, `UrbanGrid Property Inspection ${emirateTitle}`, description);
}
export function serviceSchema(servicePath: string, serviceTitle: string, serviceDesc: string, _serviceCategory: string, _canonical: string): string {
  return pageSchemaScript(servicePath, serviceTitle, serviceDesc);
}