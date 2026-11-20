import type { z } from 'zod';
import type { Resolver, FieldValues, FieldErrors } from 'react-hook-form';

/**
 * Zero-dependency Zod resolver adapter for React Hook Form.
 */
export function zodResolver<T extends FieldValues>(
  schema: z.ZodSchema<T>
): Resolver<T> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const errors: FieldErrors<T> = {};

    for (const issue of result.error.issues) {
      const fieldPath = issue.path.join('.');
      if (!(fieldPath in errors)) {
        (errors as Record<string, unknown>)[fieldPath] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }

    return {
      values: {} as Record<string, never>,
      errors,
    };
  };
}

export default zodResolver;
