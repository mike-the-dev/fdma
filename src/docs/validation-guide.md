# Enterprise Validation Framework Guide

## Overview

This project uses **Zod** as the primary validation framework, integrated with **React Hook Form** for enterprise-grade form validation. This combination provides:

- **Type Safety**: Compile-time and runtime type checking
- **Performance**: Minimal bundle size with excellent tree-shaking
- **Developer Experience**: Intuitive API with excellent TypeScript support
- **Maintainability**: Self-documenting schemas that serve as both validation and type definitions

## Architecture

### Validation Schema (`src/schemas/accountDeployment.ts`)

The validation schema defines:
- **Name validation**: 2-100 characters, alphanumeric with spaces, hyphens, apostrophes, and periods
- **Company validation**: 2-200 characters, alphanumeric with common business characters
- **State validation**: Must be a valid US state code
- **Domain validation**: Comprehensive domain validation including TLD verification

### Key Features

1. **Real-time Validation**: Validates on blur for optimal UX
2. **Error Display**: Visual feedback with error messages
3. **Type Inference**: Automatic TypeScript type generation
4. **Transform Functions**: Data sanitization (trimming, lowercase for domains)
5. **Custom Validation**: Advanced domain validation with TLD checking

## Usage Examples

### Basic Form Integration

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountDeploymentSchema, AccountDeploymentFormData } from "../../schemas/accountDeployment";

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<AccountDeploymentFormData>({
    resolver: zodResolver(accountDeploymentSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      company: "",
      state: "",
      domain: ""
    }
  });

  const onSubmit = async (data: AccountDeploymentFormData) => {
    // Data is already validated and typed
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input 
        {...register("name")}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />
      {/* Other fields... */}
    </form>
  );
};
```

### Field-Level Validation

```typescript
import { validateAccountDeploymentField } from "../../schemas/accountDeployment";

const validateField = (field: string, value: string) => {
  const result = validateAccountDeploymentField(field as keyof AccountDeploymentFormData, value);
  if (!result.success) {
    console.error("Validation error:", result.error.issues);
  }
  return result.success;
};
```

## Validation Rules

### Name Field
- **Required**: Yes
- **Min Length**: 2 characters
- **Max Length**: 100 characters
- **Pattern**: `^[a-zA-Z\s\-'\.]+$`
- **Transform**: Trims whitespace

### Company Field
- **Required**: Yes
- **Min Length**: 2 characters
- **Max Length**: 200 characters
- **Pattern**: `^[a-zA-Z0-9\s\-'\.&,()]+$`
- **Transform**: Trims whitespace

### State Field
- **Required**: Yes
- **Validation**: Must be a valid US state code
- **Options**: 50 US states (AL, AK, AZ, etc.)

### Domain Field
- **Required**: Yes
- **Min Length**: 3 characters
- **Max Length**: 253 characters
- **Pattern**: Complex domain regex with TLD validation
- **Transform**: Converts to lowercase and trims
- **Additional**: Validates TLD length and characters

## Error Handling

The form provides comprehensive error handling:

1. **Visual Indicators**: Red borders and error icons
2. **Error Messages**: Clear, user-friendly messages
3. **Real-time Feedback**: Validation on blur
4. **Submit Prevention**: Button disabled during validation errors

## Best Practices

1. **Schema-First**: Define validation schemas before implementing forms
2. **Type Safety**: Use inferred types from Zod schemas
3. **Error Messages**: Provide clear, actionable error messages
4. **Performance**: Use `mode: "onBlur"` for better performance
5. **Accessibility**: Ensure error messages are accessible to screen readers

## Extending Validation

To add new validation rules:

1. Update the Zod schema in `src/schemas/accountDeployment.ts`
2. Add new fields to the form component
3. Update TypeScript types (automatically inferred)
4. Test validation rules thoroughly

## Dependencies

- `zod`: Schema validation library
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Zod integration for React Hook Form

This setup provides enterprise-grade validation that is maintainable, performant, and developer-friendly.

