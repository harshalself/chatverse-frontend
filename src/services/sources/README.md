# Sources Services

This directory contains modularized service files for different types of sources in the AgentFlow application.

## Architecture

The sources services are organized as follows:

- `base.service.ts`: Contains common functionality for all source types
- `file.service.ts`: File sources specific operations
- `text.service.ts`: Text sources specific operations
- `website.service.ts`: Website sources specific operations
- `database.service.ts`: Database sources specific operations
- `qa.service.ts`: Q&A sources specific operations
- `index.ts`: Exports all services for easy importing

## Usage

Import specific services as needed in your components:

```typescript
import { FileSourcesService, TextSourcesService } from "@/services/sources";

// Example usage
const fileSource = await FileSourcesService.uploadFileSource(agentId, file);
const textSource = await TextSourcesService.createTextSource(
  agentId,
  "Text Name",
  "Text Content"
);
```

## Migration

The monolithic `SourcesService` class is being deprecated in favor of these modularized services. Please use the specific service classes instead of the monolithic SourcesService.

## API Structure

Each service follows a consistent API pattern:

- `create[Type]Source`: Create a new source of the specific type
- `get[Type]Sources`: Get all sources of the specific type for an agent
- `get[Type]Source`: Get a single source of the specific type by ID
- `update[Type]Source`: Update a source of the specific type
- `delete[Type]Source`: Delete a source of the specific type

Additional type-specific methods are included as needed (e.g., testing connections for website and database sources).

## File Upload Format

### IMPORTANT: Base64 Format Requirements

When uploading files using the FileSourcesService, the base64 string **MUST** include the data URI prefix with MIME type:

```
Format: data:[MIME type];base64,[base64 data]
```

Examples:

- PDF: `data:application/pdf;base64,JVBERi0xLjMKJcTl8...`
- JPEG: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...`
- PNG: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`

The FileSourcesService handles this automatically when using the `uploadFileSource` method with a File object. If you're constructing the payload manually, make sure to include the full data URI.

### Common Error Resolution

If you encounter a "500 - Invalid base64 format" error, check that:

1. You're including the complete data URI prefix (`data:[MIME type];base64,`)
2. The base64 string doesn't contain line breaks or special characters
3. The MIME type matches the actual file type

See `file-upload-examples.ts` for properly formatted examples.
