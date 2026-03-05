import axios from 'axios';
export interface ValidationError {
  field: string;
  message: string;
}
export interface ParsedError {
  genericMessage: string;
  errors: ValidationError[] | null;
}
export function getAxiosErrorMessage(error: unknown, fallback = 'Something went wrong'): ParsedError {
  if (axios.isAxiosError(error)) {
    return {
      genericMessage: error.response?.data?.message || fallback,
      errors: error.response?.data?.errors || null,
    };
  }
  if (error instanceof Error) {
    return { genericMessage: error.message, errors: null };
  }
  return { genericMessage: fallback, errors: null };
}
