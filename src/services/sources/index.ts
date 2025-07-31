// Export all sources services from a central location
// This allows importing like: import { FileSourcesService } from "@/services/sources";

export * from "./base.service";
export * from "./file.service";
export * from "./text.service";
export * from "./website.service";
export * from "./database.service";
export * from "./qa.service";

// The SourcesService class has been removed and replaced by the modular services above.
// Any code previously using SourcesService should migrate to the appropriate service class.
