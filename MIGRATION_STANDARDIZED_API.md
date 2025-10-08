# Migration Guide: Standardized API Response Format

## Overview
This guide outlines the migration from legacy API responses to the new standardized format where all responses follow:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* actual response data */ },
  "meta": { /* optional metadata */ }
}
```

## Changes Made

### 1. **Updated Type Definitions** (`src/types/api.types.ts`)
- ✅ Added `success` field to `ApiResponse<T>`
- ✅ Added optional `meta` field for pagination/metadata
- ✅ Updated `ApiErrorResponse` to include standardized error codes

### 2. **Enhanced API Client** (`src/lib/client.ts`)
- ✅ Added response interceptor to check `success` field
- ✅ Automatic error handling for `success: false` responses
- ✅ Backward compatibility with legacy responses

### 3. **Improved Error Handler** (`src/lib/error-handler.ts`)
- ✅ Added `handleApiErrorWithCode()` method for standardized error codes
- ✅ Support for new error format with error codes
- ✅ Backward compatibility with legacy error format

### 4. **Utility Functions** (`src/lib/utils.ts`)
- ✅ `extractApiData<T>()` - Extract data from standardized responses
- ✅ `extractApiMessage()` - Extract message from responses
- ✅ `extractApiMeta()` - Extract metadata from responses
- ✅ `isApiSuccess()` - Check if response indicates success

### 5. **Updated Auth Service** (`src/services/auth.service.ts`)
- ✅ Login method updated to use `extractApiData()`
- ✅ Register method updated to handle new format
- ✅ Backward compatibility maintained

## What Still Needs to be Done

### **Priority 1: Critical Updates**
1. **Update All Service Methods** - Each service method should use the utility functions:
   ```typescript
   // Before
   static async getAgents(): Promise<AgentsResponse> {
     return apiClient.get(API_ENDPOINTS.AGENTS.LIST);
   }

   // After
   static async getAgents(): Promise<AgentsResponse> {
     const response = await apiClient.get(API_ENDPOINTS.AGENTS.LIST);
     return {
       success: true,
       data: extractApiData(response),
       message: extractApiMessage(response) || "Agents retrieved successfully"
     };
   }
   ```

2. **Update Hook Error Handling** - Use the new error handler:
   ```typescript
   // Before
   onError: (error) => {
     ErrorHandler.handleApiError(error, "Failed to create agent");
   }

   // After
   onError: (error) => {
     ErrorHandler.handleApiErrorWithCode(error, "Failed to create agent");
   }
   ```

### **Priority 2: Type Updates**
1. Update all response type definitions to use the new `ApiResponse<T>` format
2. Remove legacy response types that don't include `success` field

### **Priority 3: Component Updates**
1. Update components that directly access response properties
2. Use utility functions instead of direct property access

## Testing Strategy

### **Phase 1: Gradual Migration**
1. Test with both legacy and new format responses
2. Verify backward compatibility
3. Monitor error handling in development

### **Phase 2: Service-by-Service Update**
1. Update one service at a time
2. Test thoroughly before moving to next service
3. Update corresponding hooks and components

### **Phase 3: Full Migration**
1. Remove legacy format support
2. Update all remaining components
3. Clean up old type definitions

## Rollback Plan

If issues are encountered:
1. **Immediate**: The changes are backward compatible, so no immediate rollback needed
2. **API Client**: Revert `src/lib/client.ts` to remove success checking
3. **Type Definitions**: Revert `src/types/api.types.ts` to legacy format
4. **Services**: Individual services can be reverted independently

## Validation Checklist

- [ ] All API calls work with new backend format
- [ ] Error handling displays correct messages
- [ ] Success responses extract data correctly
- [ ] Pagination metadata is accessible
- [ ] Authentication flow works correctly
- [ ] No TypeScript compilation errors
- [ ] All existing functionality preserved

## Error Code Reference

The new format includes standardized error codes:
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions  
- `NOT_FOUND` - Resource not found
- `VALIDATION_FAILED` - Input validation error
- `CONFLICT` - Resource conflict
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Next Steps

1. **Week 1**: Complete critical service updates (auth, agents, analytics)
2. **Week 2**: Update remaining services and hooks
3. **Week 3**: Test thoroughly and update components
4. **Week 4**: Remove legacy support and clean up code

## Support

For questions about this migration:
1. Check the utility functions in `src/lib/utils.ts`
2. Review error handling in `src/lib/error-handler.ts`
3. Test API responses in development environment
4. Contact backend team if response format seems incorrect