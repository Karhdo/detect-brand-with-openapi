import { ValidationError } from 'class-validator';

export type FormattedValidationError = {
  field: string;
  errorMessage: string;
  value: any;
};

export const formatValidationError = (errors: ValidationError[]): FormattedValidationError[] => {
  const extractErrors = (errorList: ValidationError[], currentPath: string): FormattedValidationError[] => {
    return errorList.flatMap((error) => {
      const keyPath = currentPath ? `${currentPath}.${error.property}` : error.property;
      const formattedErrors: FormattedValidationError[] = [];

      if (error.constraints) {
        formattedErrors.push({
          field: keyPath,
          errorMessage: Object.values(error.constraints).join(', '),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value: error.value,
        });
      }

      if (error.children && error.children.length) {
        formattedErrors.push(...extractErrors(error.children, keyPath));
      }

      return formattedErrors;
    });
  };

  return extractErrors(errors, '');
};

export const getConfigErrorMessage = (errors: ValidationError[]): FormattedValidationError[] => {
  return formatValidationError(errors);
};

export const displayConfigErrorMessage = (
  configErrors: FormattedValidationError[],
  options: { stopAtFirstError?: boolean } = {},
): string => {
  const messages = configErrors.map((configError) => {
    return Object.entries(configError)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
  });

  const displayedMessages = options.stopAtFirstError ? messages.slice(0, 1) : messages;

  return `[Invalid Configure Application] ${displayedMessages.join('\n')}`;
};
